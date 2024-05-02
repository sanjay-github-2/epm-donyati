import { pool } from "@/lib/db";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { signOut } from "next-auth/react";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          const query = {
            text: 'SELECT * FROM public."user_table" WHERE email = $1',
            values: [email],
          };

          const client = await pool.connect();
          const result = await client.query(query);

          client.release();
          const user = result.rows[0];
          console.log("user from table:", user);

          if (!user) {
            return null;
          }
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (!passwordsMatch) {
            return null;
          }
          console.log("user group", user.group);
          return { ...user, id: user.id, role: user.role, group: user.group };
        } catch (error) {
          throw error;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      // callbackUrl: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      // callbackUrl: `${process.env.NEXTAUTH_URL}/api/auth/callback/github`,
    }),
  ],
  callbacks: {
    async jwt({ user, token }) {
      if (user && user.role) {
        token.role = user.role;
        token.group = user.group;
        token.id = user.id;
      }
      console.log("token", token);
      return token;
    },
    async session({ session, token }) {
      if (token && token.role) {
        session.user.role = token.role;
        session.user.group = token.group;
        session.user.id = token.id;
      }
      console.log("session", session);
      return session;
    },
  },
  pages: {
    signIn: "/",

    // Specify your sign-in page here
  },
  secret: process.env.NEXTAUTH_SECRET,
  events: {},
};

// Initialize NextAuth with the options
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
