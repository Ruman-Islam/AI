"use client";

import Spinner from "@/components/common/Spinner";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Chat() {
  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/");
    },
  });

  if (session?.status === "loading") {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <Spinner styles="w-10 h-10 text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div>{session?.data?.user?.email}</div>
      <button onClick={() => signOut()}>Logout</button>
    </div>
  );
}
