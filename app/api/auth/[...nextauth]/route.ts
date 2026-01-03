import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.name = profile.name;
        // @ts-expect-error email may be string | null
        token.email = profile.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        name: token.name as string | undefined,
        email: token.email as string | undefined,
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
