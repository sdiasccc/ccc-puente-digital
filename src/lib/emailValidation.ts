export const ALLOWED_EMAIL_DOMAINS = ['@cursosccc.com', '@formacionprofesionalccc.com'];

export function isValidCccEmail(email: string): boolean {
  const e = email.trim().toLowerCase();
  return ALLOWED_EMAIL_DOMAINS.some((d) => e.endsWith(d) && e.length > d.length);
}

export const EMAIL_VALIDATION_MESSAGE =
  'Solo se permiten correos @cursosccc.com o @formacionprofesionalccc.com';
