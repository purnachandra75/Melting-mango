/* Shared parlour location, contact details, and opening hours. */
export const HOURS = {
  weekday: { open: 12, close: 23, label: '12 PM - 11 PM' },
  weekend: { open: 11, close: 24, label: '11 AM - 12 AM' },
};

export const CONTACT = {
  name: 'South Jordan',
  city: 'South Jordan',
  address: '10366 S Redwood Rd suite B, South Jordan, UT 84095, United States',
  phone: '(385) 539-7674',
  phoneTel: 'tel:+13855397674',
  streetLine: '10366 S Redwood Rd, Suite B',
  localityLine: 'South Jordan, UT 84095',
};

export function mapsSearchUrl(address = CONTACT.address) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function mapsEmbedUrl(address = CONTACT.address) {
  return `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
}

export const LOCATIONS = [
  {
    city: CONTACT.city,
    name: CONTACT.name,
    address: CONTACT.address,
    phone: CONTACT.phone,
    phoneTel: CONTACT.phoneTel,
    streetLine: CONTACT.streetLine,
    localityLine: CONTACT.localityLine,
    mapsUrl: mapsSearchUrl(CONTACT.address),
    mapsEmbed: mapsEmbedUrl(CONTACT.address),
  },
];

export const FLAGSHIP = LOCATIONS[0];
