import { auth } from "@/app/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  // Configure one or more authentication providers
  pages: {
    signIn: "/",
  },
  secret: "super",
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials) {
        return await signInWithEmailAndPassword(
          auth,
          credentials.email || "",
          credentials.password || ""
        )
          .then((userCredential) => {
            if (userCredential.user) {
              const {
                uid,
                email,
                displayName,
                emailVerified,
                phoneNumber,
                photoURL,
              } = userCredential.user;

              // Return custom user object
              return {
                uid,
                email,
                displayName,
                emailVerified,
                phoneNumber,
                photoURL,
              };
            }
            return null;
          })
          .catch((error) => {
            throw new Error(
              JSON.stringify({ errors: error.code, status: false })
            );
          });
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add user information to the token
      if (user) {
        token.uid = user.uid;
        token.email = user.email;
        token.displayName = user.displayName;
        token.emailVerified = user.emailVerified;
        token.phoneNumber = user.phoneNumber;
        token.photoURL = user.photoURL;
      }
      return token;
    },
    async session({ session, token }) {
      // Add token information to the session
      session.user.uid = token.uid;
      session.user.email = token.email;
      session.user.displayName = token.displayName;
      session.user.emailVerified = token.emailVerified;
      session.user.phoneNumber = token.phoneNumber;
      session.user.photoURL = token.photoURL;
      return session;
    },
  },
};

export default NextAuth(authOptions);