"use client";

import Spinner from "@/components/common/Spinner";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { RiAccountCircleLine } from "react-icons/ri";

const mainTabs = [
  { id: 1, title: "Tab 1" },
  { id: 2, title: "Tab 2" },
  { id: 3, title: "Tab 3" },
];

export default function Chat() {
  const [selectedTab, setSelectedTab] = useState("Tab 1");
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
    <div className="h-screen w-full bg-[#EEEEEE]">
      <div className="h-full w-full flex justify-between">
        <aside className="max-w-[0px] md:max-w-[270px] w-full flex flex-col drop-shadow-lg md-0 md:m-3 border rounded-xl bg-[#F1F4F8]  duration-300 opacity-0 md:opacity-100">
          <div className="border-b border-text__gray p-6 hidden md:flex">
            <h1>LOGO</h1>
          </div>
          <nav className="hidden md:flex flex-col h-full">
            {/* Tabs */}
            <div className="w-full flex justify-between gap-2 p-4">
              {mainTabs.map((item) => (
                <Button
                  onClick={() => setSelectedTab(item?.title)}
                  className={`${
                    selectedTab.includes(item?.title) && "bg-text__primary"
                  } text-white w-full h-7 rounded-xl hover:bg-text__primary duration-200`}
                  key={item?.id}
                >
                  <small>{item?.title}</small>
                </Button>
              ))}
            </div>

            {/* Dynamic contents */}
            <div className="p-4 border h-full bg-primary text-white">
              DYNAMIC CONTENT
            </div>
          </nav>

          {/* Profile menu */}
          <div className="px-2 py-4 border-t border-text__gray text-primary hidden md:flex justify-between items-center gap-2">
            {/* <button onClick={() => signOut()}>Logout</button> */}
            <div>
              <RiAccountCircleLine size={55} />
            </div>
            <div className="flex-1 overflow-hidden leading-[20px] text-text__primary">
              <p>{session?.data?.user?.displayName}</p>
              <small className="text-brand__font__size__xs">
                {session?.data?.user?.email}
              </small>
            </div>
          </div>
        </aside>
        <div className="flex-1 m-3 border border-text__gray rounded-xl p-5">
          <h1>{session?.data?.user?.displayName}</h1>
          <h1>{session?.data?.user?.email}</h1>
        </div>
      </div>
    </div>
  );
}
