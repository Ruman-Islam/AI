"use client";
import Spinner from "@/components/common/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

export default function Home() {
  const { toast } = useToast();
  const router = useRouter();
  const session = useSession();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.status === "authenticated") {
      router.push("chat");
    }
  }, [router, session?.status]);

  const handleShowPassword = () => setIsShowPassword(!isShowPassword);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    signIn("credentials", {
      email,
      password,
      redirect: false,
    }).then(({ ok, error }) => {
      if (ok) {
        setLoading(false);
        router.push("/chat");
      } else {
        setLoading(false);
        const parsedError = JSON.parse(error);
        const trimmedError = parsedError.errors;
        const splitError = trimmedError.split("/")[1];
        toast({
          title: <h1 className="text-lg">{splitError}</h1>,
          variant: "destructive",
          className: "bg-text__error text-white",
        });
      }
    });
  };

  if (session?.status === "loading") {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <Spinner styles="w-10 h-10 text-primary" />
      </div>
    );
  }

  return (
    <section className="flex flex-col justify-center items-center h-full p-2">
      <div className="max-w-[450px] w-full border p-5 bg-white rounded-xl text-text__primary">
        <div className="flex justify-center items-center py-6">
          <h1>Logo</h1>
        </div>
        <div className="pb-2">
          <h2 className="text-brand__font__size__lg">Login</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3">
            <div>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                className="bg-brand__gray py-5"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <Input
                id="password"
                name="password"
                type={isShowPassword ? "text" : "password"}
                placeholder="Password"
                className="bg-brand__gray py-5"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                onClick={handleShowPassword}
                type="button"
                className="bg-none outline-none border-none absolute right-3 top-3 text-brand__font__size__md"
              >
                {isShowPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </button>
            </div>
          </div>

          <small>
            <Link
              href="/"
              className="underline text-text__link my-2 inline-block"
            >
              Forget password?
            </Link>
          </small>

          <Button
            disabled={loading}
            className="w-full text-white"
            type="submit"
          >
            {loading ? <Spinner styles="w-5 h-5 text-white" /> : "Login"}
          </Button>
        </form>
        <div className="flex items-center pt-5 justify-center">
          <small>
            Don&rsquo;t have an account?{" "}
            <Link
              href="/register"
              className="hover:underline duration-200 text-text__link"
            >
              Sign Up
            </Link>
          </small>
        </div>
      </div>
    </section>
  );
}
