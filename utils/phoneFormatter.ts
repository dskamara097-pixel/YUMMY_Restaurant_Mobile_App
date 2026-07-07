export function normalizePhoneNumber(phoneNumber: string) {
  return phoneNumber.replace(/[^\d+]/g, '');
}

export function formatPhoneNumber(phoneNumber: string) {
  const normalized = normalizePhoneNumber(phoneNumber);

  if (normalized.startsWith('+')) {
    return normalized;
  }

  return normalized;
}
