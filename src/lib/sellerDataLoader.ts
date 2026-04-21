const sellerDataModules = import.meta.glob('@/data/*.json');

function normalizeGlid(value: string) {
  return String(value || '').trim().toLowerCase();
}

function getModulePathForGlid(glid: string) {
  return `/src/data/${glid}.json`;
}

export async function loadSellerRawDataByGlid(glid: string) {
  const normalizedGlid = normalizeGlid(glid);
  const modulePath = getModulePathForGlid(normalizedGlid);
  const loader = sellerDataModules[modulePath];

  if (!loader) {
    return null;
  }

  const module = (await loader()) as { default?: unknown };
  return module.default ?? null;
}

export function listAvailableSellerGlids() {
  return Object.keys(sellerDataModules)
    .map((path) => path.split('/').pop()?.replace('.json', '') || '')
    .filter(Boolean);
}
