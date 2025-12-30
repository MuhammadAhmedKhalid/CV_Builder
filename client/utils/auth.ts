export const TOKEN_KEY = "token";
export const USER_KEY = "user"; // store user info after login

// Check if user is logged in
export function isLoggedIn(): boolean {
  return !!localStorage.getItem(TOKEN_KEY);
}

// Logout user
export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// Get logged in user info
export function getUser(): { name: string; picture: string } | null {
  const userJson = localStorage.getItem(USER_KEY);
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
}

// Store user info after login
export function setUser(user: { name: string; picture: string }): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}