"use client";
import { auth } from "@/app/firebase";
import Spinner from "@/components/common/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  useAuthState,
  useCreateUserWithEmailAndPassword,
  useUpdateProfile,
} from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { toast } = useToast();
  const session = useSession();
  const router = useRouter();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [
    createUserWithEmailAndPassword,
    createdUser,
    createUserLoading,
    createUserError,
  ] = useCreateUserWithEmailAndPassword(auth);
  const [updateProfile, updating] = useUpdateProfile(auth);
  const [authUser, authLoading] = useAuthState(auth);

  useLayoutEffect(() => {
    if (authUser) {
      return router.push("/chat");
    }
  }, [authUser, router]);

  useEffect(() => {
    if (createUserError) {
      const error = createUserError?.code.split("/")[1];
      toast({
        title: <h1 className="text-lg">{error}</h1>,
        variant: "destructive",
        className: "bg-text__error text-white",
      });
    }
  }, [createUserError, toast]);

  const handleShowPassword = () => setIsShowPassword(!isShowPassword);

  const onSubmit = async (data) => {
    const { email, password, displayName } = data;
    await createUserWithEmailAndPassword(email, password);
    await updateProfile({ displayName });
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
            <h2 className="text-brand__font__size__lg">Register</h2>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-3">
              <div>
                <Input
                  {...register("displayName", {
                    required: true,
                  })}
                  placeholder="Full name"
                  className="bg-brand__gray py-5"
                />
                {errors?.displayName?.type === "required" && (
                  <small className="text-text__error">
                    This field is required
                  </small>
                )}
              </div>

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
                    pattern: /^.{6,}$/,
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
                {errors?.password?.type === "pattern" && (
                  <small className="text-text__error">
                    Minimum six characters
                  </small>
                )}
              </div>

              <Button
                disabled={createUserLoading}
                type="submit"
                className="w-full mt-2 text-white"
              >
                {createUserLoading ? (
                  <Spinner styles="w-5 h-5 text-white" />
                ) : (
                  "Register"
                )}
              </Button>
            </div>
          </form>

          <div className="flex items-center pt-5 justify-center">
            <small>
              Don&rsquo;t have an account?{" "}
              <Link
                href="/"
                className="hover:underline duration-200 text-text__link"
              >
                Sign In
              </Link>
            </small>
          </div>
        </div>
      </section>
    );
  }
}
