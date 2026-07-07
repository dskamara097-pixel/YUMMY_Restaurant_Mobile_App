import { PlatformSettingsModel, SettingsModel } from '@/models/Settings';
import { FirestoreRepository } from '@/repositories/Repository';
import { FIRESTORE_COLLECTIONS } from '@/utils/constants';

const defaultPlatformSettings: PlatformSettingsModel = {
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

export class SettingsRepository extends FirestoreRepository<SettingsModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.settings);
  }

  getByUser(userId: string) {
    return this.getById(userId);
  }

  async getPlatformSettings(): Promise<PlatformSettingsModel> {
    const settings = await this.getById('platform');
    return { ...defaultPlatformSettings, ...settings, id: 'platform' };
  }

  async savePlatformSettings(input: Omit<PlatformSettingsModel, 'id' | 'updatedAt'>) {
    const updatedAt = new Date().toISOString();
    await this.create({ id: 'platform', ...input, updatedAt });
    return this.getPlatformSettings();
  }
}

export const settingsRepository = new SettingsRepository();
