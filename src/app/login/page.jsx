"use client";
import Spinner from "@/components/common/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  useAuthState,
  useSignInWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { auth } from "../firebase";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { toast } = useToast();
  const router = useRouter();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [signInWithEmailAndPassword, signInUser, signInLoading, error] =
    useSignInWithEmailAndPassword(auth);
  const [authUser, authLoading] = useAuthState(auth);

  useLayoutEffect(() => {
    if (authUser) {
      return router.push("/chat");
    }
  }, [authUser, router]);

  useEffect(() => {
    if (error) {
      toast({
        title: <h1 className="text-lg">Invalid Credentials!</h1>,
        variant: "destructive",
        className: "bg-text__error text-white",
      });
    }
  }, [error, toast]);

  const handleShowPassword = () => setIsShowPassword(!isShowPassword);

  const onSubmit = async (data) => {
    const { email, password } = data;
    await signInWithEmailAndPassword(email, password);
  };

  if (authLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <Spinner styles="w-10 h-10 text-primary" />
      </div>
    );
  }

  if (!authUser) {
    return (
      <section className="flex flex-col justify-center items-center h-full p-2">
        <div className="max-w-[450px] w-full border p-5 bg-white rounded-xl text-text__primary">
          <div className="flex justify-center items-center py-6">
            <h1>Logo</h1>
          </div>
          <div className="pb-2">
            <h2 className="text-brand__font__size__lg">Login</h2>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-3">
              <div>
                <Input
                  {...register("email", {
                    required: true,
                    pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                  })}
                  placeholder="Email"
                  className="bg-brand__gray py-5"
                />
                {errors?.email?.type === "required" && (
                  <small className="text-text__error">
                    This field is required
                  </small>
                )}
                {errors?.email?.type === "pattern" && (
                  <small className="text-text__error">Not a valid email</small>
                )}
              </div>

              <div className="relative">
                <Input
                  type={isShowPassword ? "text" : "password"}
                  {...register("password", {
                    required: true,
                  })}
                  placeholder="Password"
                  className="bg-brand__gray py-5"
                />
                <button
                  onClick={handleShowPassword}
                  type="button"
                  className="bg-none outline-none border-none absolute right-3 top-3 text-brand__font__size__md"
                >
                  {isShowPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                </button>
                {errors?.password?.type === "required" && (
                  <small className="text-text__error">
                    This field is required
                  </small>
                )}
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
              disabled={signInLoading}
              className="w-full text-white"
              type="submit"
            >
              {signInLoading ? (
                <Spinner styles="w-5 h-5 text-white" />
              ) : (
                "Login"
              )}
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
}
