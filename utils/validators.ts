import { APP_CONSTANTS } from '@/utils/constants';

export function isRequired(value: string) {
  return value.trim().length > 0;
}

export function isValidPasswordLength(password: string) {
  return password.length >= APP_CONSTANTS.minimumPasswordLength;
}

export function isValidEmail(email: string) {
  if (!email.trim()) {
    return true;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhoneNumber(phoneNumber: string) {
  return /^\+?\d{7,15}$/.test(phoneNumber.replace(/\s/g, ''));
}
