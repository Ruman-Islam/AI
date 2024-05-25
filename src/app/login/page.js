"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Login() {
  const router = useRouter();
  const session = useSession();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  useEffect(() => {
    if (session?.status === "authenticated") {
      router.push("chat");
    }
  }, [router, session?.status]);

  const handleSubmit = (e) => {
    e.preventDefault();
    signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/chat",
    });
  };

  if (session?.status === "loading") {
    return <h1>Loading....</h1>;
  }

  return (
    <section className="flex flex-col justify-center items-center h-full p-24">
      <div className="max-w-[450px] w-full border p-4">
        <form onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6"
            >
              Email address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <br />
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6"
            >
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <br />
          <Button className="w-full" type="submit">
            {session?.status === "loading" ? "Loading" : "Login"}
          </Button>
        </form>
        <p className="mt-10 text-center text-sm text-gray-400">
          Not a member?{" "}
          <button
            onClick={() => router.push("register")}
            className="font-semibold leading-6 text-indigo-400 hover:text-indigo-300"
          >
            Sign Up
          </button>
        </p>
      </div>
    </section>
  );
}
