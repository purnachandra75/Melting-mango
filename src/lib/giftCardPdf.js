/**
 * Turns the on-screen gift card faces (front art + back with number/PIN) into pictures, then into a
 * PDF download or a print job. Using pictures keeps every colour exactly as shown on the page, which a
 * normal browser "print page" drops (it leaves out backgrounds by default).
 */
import { toJpeg } from 'html-to-image';

const encoder = new TextEncoder();

function dataUrlToBytes(dataUrl) {
  const bin = atob(dataUrl.split(',')[1]);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) out[i] = bin.charCodeAt(i);
  return out;
}

function loadSize(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => reject(new Error('Could not read the card picture.'));
    img.src = dataUrl;
  });
}

async function capture(node) {
  const dataUrl = await toJpeg(node, {
    quality: 0.96,
    pixelRatio: 4, // sharp when printed
    backgroundColor: '#ffffff',
    cacheBust: true,
  });
  const { width, height } = await loadSize(dataUrl);
  return { dataUrl, bytes: dataUrlToBytes(dataUrl), width, height };
}

/** groups: [[frontElement, backElement], ...]  ->  [[frontPic, backPic], ...] */
export async function captureCardFaces(groups) {
  if (document.fonts?.ready) await document.fonts.ready;
  const pages = [];
  for (const [front, back] of groups) {
    pages.push([await capture(front), await capture(back)]);
  }
  return pages;
}

/** Minimal PDF writer: one A4 page per card, the two pictures stacked and centred. */
function buildPdf(pages) {
  const PAGE_W = 595.28;
  const PAGE_H = 841.89;
  const MARGIN = 56;
  const GAP = 30;

  const chunks = [];
  let offset = 0;
  const offsets = [];
  const push = (part) => {
    const bytes = typeof part === 'string' ? encoder.encode(part) : part;
    chunks.push(bytes);
    offset += bytes.length;
  };
  const begin = (id) => {
    offsets[id] = offset;
    push(`${id} 0 obj\n`);
  };

  let nextId = 3;
  const plan = pages.map((imgs) => {
    const pageId = nextId++;
    const contentId = nextId++;
    const imageIds = imgs.map(() => nextId++);
    return { imgs, pageId, contentId, imageIds };
  });
  const lastId = nextId - 1;

  push(new Uint8Array([37, 80, 68, 70, 45, 49, 46, 52, 10, 37, 226, 227, 207, 211, 10])); // %PDF-1.4 + binary marker
  begin(1);
  push('<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
  begin(2);
  push(`<< /Type /Pages /Kids [${plan.map((p) => `${p.pageId} 0 R`).join(' ')}] /Count ${plan.length} >>\nendobj\n`);

  for (const { imgs, pageId, contentId, imageIds } of plan) {
    const usableW = PAGE_W - MARGIN * 2;
    const sizes = imgs.map((img) => ({ w: usableW, h: (usableW * img.height) / img.width }));
    const total = sizes.reduce((sum, s) => sum + s.h, 0) + GAP * (sizes.length - 1);
    let top = (PAGE_H + total) / 2;

    let content = '';
    sizes.forEach((s, i) => {
      const y = top - s.h;
      content += `q ${s.w.toFixed(2)} 0 0 ${s.h.toFixed(2)} ${MARGIN.toFixed(2)} ${y.toFixed(2)} cm /Im${i} Do Q\n`;
      top = y - GAP;
    });

    begin(pageId);
    push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] ` +
        `/Resources << /XObject << ${imageIds.map((id, i) => `/Im${i} ${id} 0 R`).join(' ')} >> >> ` +
        `/Contents ${contentId} 0 R >>\nendobj\n`
    );
    begin(contentId);
    push(`<< /Length ${content.length} >>\nstream\n${content}endstream\nendobj\n`);

    imgs.forEach((img, i) => {
      begin(imageIds[i]);
      push(
        `<< /Type /XObject /Subtype /Image /Width ${img.width} /Height ${img.height} ` +
          `/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${img.bytes.length} >>\nstream\n`
      );
      push(img.bytes);
      push('\nendstream\nendobj\n');
    });
  }

  const xrefAt = offset;
  let xref = `xref\n0 ${lastId + 1}\n0000000000 65535 f \n`;
  for (let id = 1; id <= lastId; id += 1) xref += `${String(offsets[id]).padStart(10, '0')} 00000 n \n`;
  push(xref);
  push(`trailer\n<< /Size ${lastId + 1} /Root 1 0 R >>\nstartxref\n${xrefAt}\n%%EOF\n`);

  return new Blob(chunks, { type: 'application/pdf' });
}

export function downloadCardPdf(pages, filename = 'gift-card.pdf') {
  const url = URL.createObjectURL(buildPdf(pages));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 15000);
}

/** Print the same pictures through a hidden frame, so the print matches the PDF exactly. */
export function printCardPages(pages) {
  const frame = document.createElement('iframe');
  frame.setAttribute('aria-hidden', 'true');
  frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
  document.body.appendChild(frame);

  const doc = frame.contentDocument;
  doc.open();
  doc.write(`<!doctype html><html><head><meta charset="utf-8"><title>Gift card</title>
<style>
  @page { size: A4; margin: 12mm; }
  html, body { margin: 0; padding: 0; background: #fff; }
  .pg { display: grid; align-content: center; justify-items: center; gap: 10mm; min-height: 270mm; page-break-after: always; }
  .pg:last-child { page-break-after: auto; }
  img { display: block; width: 170mm; max-width: 100%; height: auto; }
</style></head><body>
${pages.map((imgs) => `<div class="pg">${imgs.map((i) => `<img src="${i.dataUrl}" alt="">`).join('')}</div>`).join('')}
</body></html>`);
  doc.close();

  const cleanup = () => setTimeout(() => frame.remove(), 500);
  const run = () => {
    const win = frame.contentWindow;
    win.addEventListener('afterprint', cleanup);
    win.focus();
    win.print();
    setTimeout(cleanup, 120000); // safety net
  };
  const imgs = [...doc.images];
  let pending = imgs.filter((img) => !img.complete).length;
  if (pending === 0) {
    run();
  } else {
    imgs.forEach((img) => {
      if (img.complete) return;
      img.addEventListener('load', () => {
        pending -= 1;
        if (pending === 0) run();
      });
    });
  }
}
