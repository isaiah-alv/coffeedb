import CredentialsProvider from "next-auth/providers/credentials";
import connectMongoDB from "@/libs/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "demo@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase();
        const password = credentials?.password || "";

        const demoEmail = process.env.AUTH_DEMO_EMAIL || "demo@example.com";
        const demoPassword = process.env.AUTH_DEMO_PASSWORD || "demo1234";
        if (email === demoEmail && password === demoPassword) {
          return { id: "demo-user", name: "Demo User", email: demoEmail };
        }

        await connectMongoDB();
        const user = await User.findOne({ email });
        if (!user) return null;
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;
        return { id: String(user._id), name: user.name || user.email, email: user.email };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      if (session?.user && token?.sub) session.user.id = token.sub;
      return session;
    },
  },
  pages: { signIn: "/signin" },
  secret: process.env.NEXTAUTH_SECRET,
};

