/**
 * Get initials from a name
 * @param name The full name to get initials from
 * @returns Up to 2 uppercase letters representing the first letters of first and last names
 */
export function getInitials(name: string): string {
  if (!name) return "??";
  
  const parts = name.split(" ");
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Slugify a string
 * @param text Text to convert to slug
 * @returns Lowercase string with spaces replaced by dashes and accents removed
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}