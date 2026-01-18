import { getToken as getCookieToken, removeToken as removeCookieToken, getUser as getCookieUser, removeUser as removeCookieUser, setUser as setCookieUser } from "./cookies";

export const TOKEN_KEY = "token";
export const USER_KEY = "user"; // store user info after login

// Check if user is logged in
export function isLoggedIn(): boolean {
  return !!getCookieToken();
}

// Logout user
export function logout(): void {
  removeCookieToken();
  removeCookieUser();
}

// Get logged in user info
export function getUser(): { name: string; picture: string } | null {
  return getCookieUser();
}

// Store user info after login
export function setUser(user: { name: string; picture: string }): void {
  setCookieUser(user);
}