import { APP_CONSTANTS } from '@/utils/constants';

export function formatAppCurrency(amount: number) {
  return `${APP_CONSTANTS.displayCurrencyPrefix} ${amount.toLocaleString(APP_CONSTANTS.defaultLocale)}`;
}
