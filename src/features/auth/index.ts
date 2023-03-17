import { type GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";

import { prisma } from "@/server/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";

const emailProvider = EmailProvider({
  server: {
    host: process.env.EMAIL_SERVER_HOST,
    port: process.env.EMAIL_SERVER_PORT
      ? parseInt(process.env.EMAIL_SERVER_PORT)
      : undefined,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
    secure: true,
  },
  from: process.env.EMAIL_FROM,

  normalizeIdentifier(identifier: string): string {
    // Get the first two elements only,
    // separated by `@` from user input.
    // eslint-disable-next-line prefer-const
    let [local, domain] = identifier.toLowerCase().trim().split("@");
    // The part before "@" can contain a ","
    // but we remove it on the domain part
    domain = domain?.split(",")[0];
    if (!domain || !local) {
      throw new Error("Invalid email");
    }

    // You can also throw an error, which will redirect the user
    // to the error page with error=EmailSignin in the URL
    if (identifier.split("@").length > 2) {
      throw new Error("Only one email allowed");
    }

    return `${local}@${domain}`;
  },
});

const credentialsProvider = CredentialsProvider({
  // The name to display on the sign in form (e.g. "Sign in with...")
  id: "credentials",
  name: "Credentials",
  // `credentials` is used to generate a form on the sign in page.
  // You can specify which fields should be submitted, by adding keys to the `credentials` object.
  // e.g. domain, username, password, 2FA token, etc.
  // You can pass any HTML attribute to the <input> tag through the object.
  credentials: {
    username: { label: "Username", type: "text" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials, req) {
    // Add logic here to look up the user from the credentials supplied
    console.log(
      credentials,
      process.env.ADMIN_EMAIL === credentials?.username,
      process.env.ADMIN_PASSWORD === credentials?.password
    );
    if (
      credentials?.username === process.env.ADMIN_EMAIL &&
      credentials?.password === process.env.ADMIN_PASSWORD
    ) {
      console.log("JDDDDDDDIIIIDDD");
      let user = await prisma.user.findUnique({
        where: { email: process.env.ADMIN_EMAIL },
      });

      // Create the user if first login
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: process.env.ADMIN_EMAIL,
          },
        });
      }

      return user;
    } else {
      return null;
    }
  },
});

export const authOptions: AuthOptions = {
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const accounts = await prisma.user.findMany({
        select: { email: true },
      });

      const isAllowedToSignIn =
        accounts.some((a) => a.email === user.email) ||
        user.email === process.env.ADMIN_EMAIL;

      if (isAllowedToSignIn) {
        return true;
      } else {
        // Return false to display a default error message
        return false;
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }
    },
    async session({ session, user }) {
      if (session.user?.email) {
        const user = await prisma.user.findUniqueOrThrow({
          where: {
            email: session.user.email,
          },
        });

        session.user.id = user.id;
        session.user.role =
          user.email === process.env.ADMIN_EMAIL ? "admin" : "user";
      }

      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error", // Error code passed in query string as ?error=
    verifyRequest: "/auth/verify", // (used for check email message)
    newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  adapter: PrismaAdapter(prisma),

  // Configure one or more authentication providers
  providers: process.env.NEXT_PUBLIC_MULTI_USER
    ? [emailProvider]
    : [credentialsProvider],
};

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
