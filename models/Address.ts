export interface AddressModel {
  id: string;
  userId: string;
  label: string;
  recipientName: string;
  phone: string;
  addressLine: string;
  city: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt?: string;
}
