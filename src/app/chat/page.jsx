"use client";

import DashboardLayout from "@/components/common/DashboardLayout";
import Spinner from "@/components/common/Spinner";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

export default function Chat() {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <Spinner styles="w-10 h-10 text-primary" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div>
        <h1>This is Chat</h1>
        {/* <h1>{session?.data?.user?.displayName}</h1>
        <h1>{session?.data?.user?.email}</h1> */}
      </div>
    </DashboardLayout>
  );
}
