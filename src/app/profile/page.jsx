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
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  useAuthState,
  useSignOut,
  useUpdatePassword,
  useUpdateProfile,
} from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import { FaCloudUploadAlt } from "react-icons/fa";
import avatar from "../../assets/avatar-.png";
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
  const router = useRouter();
  const [authUser, authUserLoading] = useAuthState(auth);
  const [openDisplayNameModal, setOpenDisplayNameModal] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [signOut, signOutLoading] = useSignOut(auth);
  const [updateProfile, updating] = useUpdateProfile(auth);
  const [updatePassword, updatingPassword, error] = useUpdatePassword(auth);
  const [imagePreview, setImagePreview] = useState(
    authUser?.photoURL || avatar
  );
  const [selectedTab, setSelectedTab] = useState("Profile");

  useEffect(() => {
    setImagePreview(authUser?.photoURL);
  }, [authUser]);

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

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await fetch(
          `https://api.imgbb.com/1/upload?key=${process.env.IMG_BB_API_KEY}`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();

        if (data.success) {
          await updateProfile({ photoURL: data.data.url });
          setImagePreview(data.data.url);
          return toast({
            title: <h1 className="text-lg">Profile image updated</h1>,
            className: "bg-text__success text-white",
          });
        } else {
          throw new Error("Image upload failed");
        }
      } catch (error) {
        toast({
          title: <h1 className="text-lg">Image upload failed</h1>,
          className: "bg-text__error text-white",
        });
      }
    }
  };

  const handleSignOut = () => {
    signOut();
  };

  if (authUserLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <Spinner styles="w-10 h-10 text-primary" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col items-center p-10 container w-full">
        <div className="flex gap-3 w-full px-3 mb-5">
          <Button
            onClick={() => setSelectedTab("Profile")}
            variant="secondary"
            className={`border border-primary text-white hover:bg-primary duration-200 ${
              selectedTab === "Profile" ? "bg-primary" : ""
            }`}
          >
            Profile
          </Button>
          <Button
            onClick={() => setSelectedTab("Pro Plan")}
            variant="secondary"
            className={`border border-primary text-white hover:bg-primary duration-200 ${
              selectedTab === "Pro Plan" ? "bg-primary" : ""
            }`}
          >
            Pro Plan
          </Button>
        </div>

        <div className="w-full">
          {selectedTab === "Profile" && (
            <div className="text-white p-6 rounded-xl max-w-[700px] w-full m-2">
              <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center mb-4">
                <h1 className="text-brand__font__size__lg font-brand__font__600">
                  {authUser?.displayName}
                </h1>
                <p className="text-brand__font__size__sm font-brand__font__500">
                  Email: {authUser?.email}
                </p>
              </div>

              <div className="my-2 w-fit">
                <label htmlFor="file-input">
                  <div className="relative w-fit cursor-pointer group">
                    <Image
                      className="rounded-xl"
                      width={80}
                      height={80}
                      src={imagePreview ? imagePreview : avatar}
                      alt="Profile"
                    />
                    <div className="bg-black absolute top-0 opacity-0 group-hover:opacity-50 w-full h-full duration-200 rounded-xl flex justify-center items-center">
                      <FaCloudUploadAlt size={30} className="text-white" />
                    </div>
                  </div>
                </label>
                <input
                  id="file-input"
                  type="file"
                  name="image"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <small className="text-brand__font__size__xs">
                  Edit Profile Image
                </small>
              </div>
              <div className="flex flex-col gap-2">
                <Dialog
                  open={openDisplayNameModal}
                  onOpenChange={setOpenDisplayNameModal}
                >
                  <DialogTrigger className="w-full">
                    <Button variant="outline" className="w-full py-6">
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
                    <Button variant="outline" className="w-full py-6">
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
              <div className="my-2 flex justify-center">
                <Button
                  onClick={() => handleSignOut()}
                  className="w-fit text-white bg-primary"
                >
                  Logout
                </Button>
              </div>
            </div>
          )}

          {selectedTab === "Pro Plan" && (
            <div className="text-white p-6 m-2">
              <h1>Coming Soon...</h1>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
