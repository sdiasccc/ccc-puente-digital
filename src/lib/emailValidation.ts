export const ALLOWED_EMAIL_DOMAINS = ['@cursoccc', '@formacionprofesionalccc'];

export function isValidCccEmail(email: string): boolean {
  const e = email.trim().toLowerCase();
  return ALLOWED_EMAIL_DOMAINS.some((d) => {
    // Match domain segment (e.g. @cursoccc.com or @cursoccc)
    const idx = e.indexOf(d);
    if (idx === -1) return false;
    // Must come after local part
    const after = e.slice(idx + d.length);
    return after === '' || after.startsWith('.');
  });
}

export const EMAIL_VALIDATION_MESSAGE =
  'Solo se permiten correos @cursoccc o @formacionprofesionalccc';
