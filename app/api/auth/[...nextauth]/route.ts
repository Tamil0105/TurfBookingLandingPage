import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { AppDataSource } from "@/lib/data-source";
import { Manage } from "@/lib/entities/Manage";

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt", // Use JWT-based sessions
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const { email, password } = credentials;

        if (!AppDataSource.isInitialized) await AppDataSource.initialize();

        const userRepo = AppDataSource.getRepository(Manage);
        const user = await userRepo.findOne({ where: { email } });
        if (user && user.password) {
          const isValidPassword = (user.password===password);
          if (isValidPassword) {
            console.log("Authorize - user:", user); // Log the user object
            return { id: user.id, email: user.email, name: user.name };
          }
        }

        console.log("Authorize - failed");
        return null; // Return null if authentication fails
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log("JWT Callback - token before:", token, "user:", user); // Debug log
      if (user) {
        token.id = user.id; // Set token.id only if user is defined
      }
      console.log("JWT Callback - token after:", token); // Debug log
      return token;
    },
    async session({ session, token }) {
      console.log("Session Callback - session before:", session, "token:", token); // Debug log
      session.user = session.user || {}; // Ensure session.user exists
      if (token?.id) {
        session.user.id = token.id; // Correctly set `id` on `session.user`
      }
      console.log("Session Callback - session after:", session); // Debug log
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin", // Custom sign-in page
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
