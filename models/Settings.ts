import { UserRole } from '@/models/User';

export interface PlatformSettingsModel {
  id: 'platform';
  platformName: string;
  taxPercentage: number;
  serviceFee: number;
  deliveryFee: number;
  maintenanceMode: boolean;
  contactEmail: string;
  contactPhone: string;
  updatedAt: string;
}

export interface SettingsModel {
  id: string;
  userId?: string;
  role?: UserRole;
  notificationSettings?: {
    orderUpdates: boolean;
    promotions: boolean;
    accountAlerts: boolean;
  };
  themePreference?: 'light' | 'dark' | 'system';
  language?: string;
  platformName?: string;
  taxPercentage?: number;
  serviceFee?: number;
  deliveryFee?: number;
  maintenanceMode?: boolean;
  contactEmail?: string;
  contactPhone?: string;
  updatedAt: string;
}
