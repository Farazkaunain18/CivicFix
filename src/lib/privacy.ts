/**
 * Privacy preservation utilities for public civic transparency.
 * Anonymizes citizen names and strips personal contact identifiers from public feeds.
 */

export function anonymizeCitizenName(fullName: string): string {
  if (!fullName || fullName.trim().length === 0) {
    return 'Anonymous Resident';
  }

  const clean = fullName.trim();

  // If it's already an anonymous or generic label
  if (/^(anonymous|resident|neighbor|citizen|local resident)/i.test(clean)) {
    return 'Local Resident';
  }

  const parts = clean.split(/\s+/);
  if (parts.length === 1) {
    return `${parts[0].charAt(0).toUpperCase()}${parts[0].slice(1, 3)}... (Resident)`;
  }

  const firstName = parts[0];
  const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();

  return `${firstName} ${lastInitial}. (Resident)`;
}

/**
 * Strips phone numbers, emails, and sensitive patterns from public civic descriptions.
 */
export function sanitizePublicDescription(text: string): string {
  if (!text) return '';

  return text
    // Replace emails
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED EMAIL]')
    // Replace US/international phone numbers
    .replace(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, '[REDACTED PHONE]');
}
