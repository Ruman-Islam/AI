import { auth } from "@/app/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  // Configure one or more authentication providers
  pages: {
    signIn: "/",
  },
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
              console.log(userCredential)

              return userCredential.user;
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
};

export default NextAuth(authOptions);
