import { useEffect, useState } from 'react';
import { catalogFlavors, subscribeCatalog } from '../data/flavors';

export function useLiveFlavors() {
  const [, setVersion] = useState(0);
  useEffect(() => subscribeCatalog(() => setVersion((version) => version + 1)), []);
  return catalogFlavors();
}
