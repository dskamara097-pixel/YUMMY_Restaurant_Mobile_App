import { useCallback } from 'react';

import { PlatformSettingsModel } from '@/models/Settings';
import { settingsRepository } from '@/repositories/SettingsRepository';
import { useFirestoreData } from '@/hooks/useFirestoreData';

const initialSettings: PlatformSettingsModel = {
  id: 'platform',
  platformName: 'YUMMY Restaurant',
  taxPercentage: 0,
  serviceFee: 0,
  deliveryFee: 0,
  maintenanceMode: false,
  contactEmail: 'support@yummy.local',
  contactPhone: '+232 00 000 000',
  updatedAt: new Date().toISOString(),
};

export function useSettings() {
  const loader = useCallback(() => settingsRepository.getPlatformSettings(), []);
  const state = useFirestoreData<PlatformSettingsModel>('admin-platform-settings', initialSettings, loader);
  const retry = state.retry;

  const saveSettings = useCallback(async (input: Omit<PlatformSettingsModel, 'id' | 'updatedAt'>) => {
    await settingsRepository.savePlatformSettings(input);
    await retry();
  }, [retry]);

  return { ...state, saveSettings };
}
