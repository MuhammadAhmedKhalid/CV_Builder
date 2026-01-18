// Cookie utility functions for secure token storage

export const TOKEN_KEY = "token";
export const USER_KEY = "user";

// Cookie options for security
const COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  // Set expiration to 7 days from now
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
};

// Set a cookie with security options
export function setCookie(name: string, value: string, options: Partial<typeof COOKIE_OPTIONS> = {}): void {
  const mergedOptions = { ...COOKIE_OPTIONS, ...options };
  
  let cookieString = `${name}=${encodeURIComponent(value)}`;
  
  if (mergedOptions.expires) {
    cookieString += `; expires=${mergedOptions.expires.toUTCString()}`;
  }
  
  if (mergedOptions.path) {
    cookieString += `; path=${mergedOptions.path}`;
  }
  
  if (mergedOptions.secure) {
    cookieString += '; secure';
  }
  
  if (mergedOptions.sameSite) {
    cookieString += `; samesite=${mergedOptions.sameSite}`;
  }
  
  document.cookie = cookieString;
}

// Get a cookie value by name
export function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }
  
  return null;
}

// Delete a cookie by name
export function deleteCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

// Token-specific functions
export function setToken(token: string): void {
  setCookie(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return getCookie(TOKEN_KEY);
}

export function removeToken(): void {
  deleteCookie(TOKEN_KEY);
}

// User info functions
export function setUser(user: { name: string; picture: string }): void {
  setCookie(USER_KEY, JSON.stringify(user));
}

export function getUser(): { name: string; picture: string } | null {
  const userJson = getCookie(USER_KEY);
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
}

export function removeUser(): void {
  deleteCookie(USER_KEY);
}