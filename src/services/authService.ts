// Auth abstraction layer. Ready to plug real Google OAuth later.
// For now Google login is mocked; structure mirrors a real OAuth flow.

import { isValidCccEmail } from '@/lib/emailValidation';

export const ALLOWED_GOOGLE_DOMAIN = '@cursosccc.com';

export interface GoogleProfile {
  email: string;
  name: string;
  picture?: string;
}

export type GoogleLoginResult =
  | { ok: true; profile: GoogleProfile }
  | { ok: false; error: 'unauthorized_domain' | 'cancelled' | 'unknown'; message: string };

export const UNAUTHORIZED_DOMAIN_MESSAGE =
  'No tienes permiso para acceder a esta intranet con este correo.';

/**
 * Mocked Google login. Replace internals with real OAuth (e.g. @react-oauth/google
 * or supabase.auth.signInWithOAuth) when backend is connected.
 */
export async function loginWithGoogle(): Promise<GoogleLoginResult> {
  // TODO: integrate real Google OAuth here.
  // Mocked profile for development — return null/cancelled to simulate failure.
  const mockProfile: GoogleProfile = {
    email: 'usuariobase@cursosccc.com',
    name: 'Usuario Base',
  };
  return validateGoogleProfile(mockProfile);
}

export function validateGoogleProfile(profile: GoogleProfile): GoogleLoginResult {
  const email = profile.email.trim().toLowerCase();
  if (!isValidCccEmail(email) && !email.endsWith(ALLOWED_GOOGLE_DOMAIN)) {
    return { ok: false, error: 'unauthorized_domain', message: UNAUTHORIZED_DOMAIN_MESSAGE };
  }
  return { ok: true, profile: { ...profile, email } };
}
