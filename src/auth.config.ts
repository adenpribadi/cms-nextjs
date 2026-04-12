import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authConfig = {
  providers: [
    Credentials({
      // We'll leave the authorize function for auth.ts
      // because it needs the database
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminPage = nextUrl.pathname.startsWith("/admin");
      
      if (isAdminPage) {
        if (isLoggedIn) return true;
        return false; // Redirect to sign-in
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
