/**
 * Formats a number into a currency string (e.g., $1,234.56).
 * @param price - The number to format.
 * @param currency - The currency code (e.g., 'USD').
 * @returns A formatted currency string.
 */
export const formatPrice = (price: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price);
};

/**
 * Formats a Date object or a date string into a long-form date string (e.g., 'January 1, 2024').
 * @param dateString - The date to format.
 * @returns A formatted date string, or 'N/A' if the input is invalid.
 */
export const formatDate = (dateString?: Date | string): string => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Formats a UUID string into its last segment for a shorter, more readable ID.
 * @param id - The full UUID string.
 * @returns The last segment of the UUID in uppercase, or the original string if not a valid UUID format.
 */
export const formatShortId = (id: string): string => {
  if (!id || typeof id !== 'string') return id;
  const parts = id.split('-');
  return parts[parts.length - 1].toUpperCase();
};
