import { flavors as seedFlavors, SCOOP_SIZES as seedScoops, CONTAINERS as seedContainers } from './flavors';

const KEYS = {
  flavors: 'mm_admin_flavors',
  scoops: 'mm_admin_scoops',
  containers: 'mm_admin_containers',
};

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return structuredClone(fallback);
    return JSON.parse(raw);
  } catch {
    return structuredClone(fallback);
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

const seedList = seedFlavors.map((f) => ({
  ...f,
  photo: '',
  active: true,
  diet: f.tags?.filter((t) =>
    ['Egg-free', 'Contains nuts', 'Gluten-free', 'Dairy-free'].includes(t)
  ) || [],
}));

export const DIET_OPTIONS = ['Egg-free', 'Contains nuts', 'Gluten-free', 'Dairy-free', 'Vegan'];
export const AVAILABILITY_OPTIONS = ['Normal', 'Seasonal'];

export function getAdminFlavors() {
  return read(KEYS.flavors, seedList);
}

export function saveAdminFlavors(list) {
  write(KEYS.flavors, list);
}

export function getAdminScoops() {
  return read(KEYS.scoops, seedScoops);
}

export function saveAdminScoops(list) {
  write(KEYS.scoops, list);
}

export function getAdminContainers() {
  return read(KEYS.containers, seedContainers);
}

export function saveAdminContainers(list) {
  write(KEYS.containers, list);
}

export function slugify(name) {
  return String(name)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || `flavour-${Date.now()}`;
}

export function emptyFlavour() {
  return {
    id: '',
    name: '',
    availability: 'Normal',
    price: '',
    notes: '',
    description: '',
    tags: [],
    diet: [],
    color: '#F6C945',
    topping: 'none',
    vessel: 'waffle',
    tint: '#FFF3C4',
    photo: '',
    active: true,
  };
}
