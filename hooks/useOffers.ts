import { useCallback } from 'react';

import { OfferModel } from '@/models/Offer';
import { offerRepository } from '@/repositories/OfferRepository';
import { useFirestoreData } from '@/hooks/useFirestoreData';

export function useOffers() {
  const loader = useCallback(() => offerRepository.listActive(), []);
  return useFirestoreData<OfferModel[]>('offers:active', [], loader);
}
