import { useCallback } from 'react';

import { OfferModel } from '@/models/Offer';
import { offerRepository } from '@/repositories/OfferRepository';
import { useFirestoreData } from '@/hooks/useFirestoreData';
import { sampleOfferModels } from '@/utils/sampleModelFallbacks';

export function useOffers() {
  const loader = useCallback(async () => {
    const offers = await offerRepository.listActive();
    return offers.length > 0 ? offers : sampleOfferModels;
  }, []);
  return useFirestoreData<OfferModel[]>('offers:active', sampleOfferModels, loader);
}
