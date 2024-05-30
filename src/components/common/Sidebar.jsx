import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../app/firebase";
import avatar from "../../assets/avatar-.png";
import logo from "../../assets/zpunkt.png";
import ChatSidebarTab from "../SideBarTabs/ChatSidebarTab";
import DocsSidebarTab from "../SideBarTabs/DocsSidebarTab";
import UploadSidebarTab from "../SideBarTabs/UploadSidebarTab";

export default function Sidebar() {
  const [user, authLoading] = useAuthState(auth);
  const [selectedTab, setSelectedTab] = useState("Chat");

  if (authLoading) {
    return (
      <Skeleton className="h-full w-[250px] rounded-xl border bg-text__gray" />
    );
  }

  return (
    <aside className="max-w-[0px] md:max-w-[270px] w-full flex flex-col drop-shadow-lg m-0 md:m-3 md:mr-0 border rounded-xl bg-white  duration-300 opacity-0 md:opacity-100">
      <div className=" border-text__gray p-6 hidden md:flex">
        <Image
          src={logo}
          width={200}
          height={50}
          className="w-full h-[120px]"
          alt="zpunkt"
        />
      </div>
      <nav className="h-full">
        {/* Tabs */}
        <Tabs defaultValue="Chat" className="hidden md:flex flex-col h-full">
          <TabsList className="w-full px-4 flex gap-x-2 justify-evenly">
            <TabsTrigger
              onClick={() => setSelectedTab("Chat")}
              className={`border rounded-xl w-full duration-200 ${
                selectedTab === "Chat" && "bg-primary text-white"
              }`}
              value="Chat"
            >
              Chat
            </TabsTrigger>
            <TabsTrigger
              onClick={() => setSelectedTab("Upload")}
              className={`border rounded-xl w-full duration-200 ${
                selectedTab === "Upload" && "bg-primary text-white"
              }`}
              value="Upload"
            >
              Upload
            </TabsTrigger>
            <TabsTrigger
              onClick={() => setSelectedTab("Docs")}
              className={`border rounded-xl w-full duration-200 ${
                selectedTab === "Docs" && "bg-primary text-white"
              }`}
              value="Docs"
            >
              Docs
            </TabsTrigger>
          </TabsList>

          {/* Dynamic contents */}
          <div
            className={`px-4 py-2 h-full flex flex-col border-b border-t mt-3 ${
              selectedTab === "Upload" ? "justify-end" : "justify-start"
            }`}
          >
            <ChatSidebarTab />
            <UploadSidebarTab />
            <DocsSidebarTab selectedTab={selectedTab} />
          </div>
        </Tabs>
      </nav>

      {/* Profile menu */}
      <div>
        <Link
          href="/profile"
          className="px-2 py-4 text-primary hidden md:flex justify-between items-center gap-2"
        >
          <div>
            <Image
              className="rounded-xl"
              width={50}
              height={50}
              src={user?.photoURL ? user?.photoURL : avatar}
              alt=""
            />
          </div>
          <div className="flex-1 overflow-hidden leading-[20px] text-text__primary">
            <p>{user?.displayName}</p>
            <small className="text-brand__font__size__xs">{user?.email}</small>
          </div>
        </Link>
      </div>
    </aside>
  );
}
