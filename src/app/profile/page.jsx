"use client";

import DashboardLayout from "@/components/common/DashboardLayout";
import Spinner from "@/components/common/Spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import {
  useAuthState,
  useSignOut,
  useUpdatePassword,
  useUpdateProfile,
} from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import { auth } from "../firebase";

export default function Profile() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const {
    register: passwordRegister,
    handleSubmit: passwordSubmit,
    reset: passwordReset,
    formState: { errors: passwordErrors },
  } = useForm();
  const { toast } = useToast();
  const [authUser, authUserLoading] = useAuthState(auth);
  const [openDisplayNameModal, setOpenDisplayNameModal] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [signOut, signOutLoading] = useSignOut(auth);
  const [updateProfile, updating] = useUpdateProfile(auth);
  const [updatePassword, updatingPassword, error] = useUpdatePassword(auth);

  const onDisplayNameSubmit = async (data) => {
    const { displayName } = data;
    await updateProfile({ displayName });
    setOpenDisplayNameModal(false);
    reset();
    return toast({
      title: <h1 className="text-lg">Display name changed</h1>,
      className: "bg-text__success text-white",
    });
  };

  const onPasswordSubmit = async (data) => {
    const { password } = data;
    await updatePassword(password);
    setOpenPasswordModal(false);
    passwordReset();
    return toast({
      title: <h1 className="text-lg">Password updated</h1>,
      className: "bg-text__success text-white",
    });
  };

  if (authUserLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <Spinner styles="w-10 h-10 text-primary" />
      </div>
    );
  }

  if (signOutLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <Spinner styles="w-10 h-10 text-primary" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="h-full flex justify-center items-center">
        <div className="bg-white p-5 rounded-xl max-w-[700px] w-full">
          <div className="flex flex-col sm:flex-row justify-center sm:justify-between mb-4">
            <h1 className="text-brand__font__size__md font-brand__font__600">
              {authUser?.displayName}
            </h1>
            <p className="text-brand__font__size__sm font-brand__font__500">
              Email: {authUser?.email}
            </p>
          </div>
          {/* <div className="my-2">Image</div> */}
          <div className="flex flex-col gap-2">
            <Dialog
              open={openDisplayNameModal}
              onOpenChange={setOpenDisplayNameModal}
            >
              <DialogTrigger className="w-full">
                <Button variant="outline" className="w-full">
                  Display name change
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle>
                    <p className="text-brand__font__size__lg mb-2">
                      Edit display name
                    </p>
                  </DialogTitle>
                </DialogHeader>
                <DialogFooter>
                  <form
                    onSubmit={handleSubmit(onDisplayNameSubmit)}
                    className="w-full flex gap-2"
                  >
                    <div className="w-full">
                      <Input
                        {...register("displayName", {
                          required: true,
                        })}
                        placeholder="Your name"
                      />
                      {errors?.displayName?.type === "required" && (
                        <small className="text-text__error">
                          This field is required
                        </small>
                      )}
                    </div>

                    <Button
                      disabled={updating}
                      className="text-white"
                      type="submit"
                    >
                      {updating ? (
                        <Spinner styles="w-5 h-5 text-white" />
                      ) : (
                        "Save changes"
                      )}
                    </Button>
                  </form>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog
              open={openPasswordModal}
              onOpenChange={setOpenPasswordModal}
            >
              <DialogTrigger className="w-full">
                <Button variant="outline" className="w-full">
                  Change password
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle>
                    <p className="text-brand__font__size__lg mb-2">
                      Change you password
                    </p>
                  </DialogTitle>
                </DialogHeader>
                <DialogFooter>
                  <form
                    onSubmit={passwordSubmit(onPasswordSubmit)}
                    className="w-full flex gap-2"
                  >
                    <div className="w-full">
                      <Input
                        {...passwordRegister("password", {
                          required: true,
                        })}
                        type="password"
                        placeholder="New password"
                      />
                      {passwordErrors?.password?.type === "required" && (
                        <small className="text-text__error">
                          This field is required
                        </small>
                      )}
                    </div>

                    <Button
                      disabled={updatingPassword}
                      className="text-white"
                      type="submit"
                    >
                      {updatingPassword ? (
                        <Spinner styles="w-5 h-5 text-white" />
                      ) : (
                        "Save changes"
                      )}
                    </Button>
                  </form>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="my-2">
            <Button
              onClick={() => signOut()}
              variant="outline"
              className="w-full"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
