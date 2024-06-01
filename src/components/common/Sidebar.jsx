"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { GoSidebarCollapse } from "react-icons/go";
import { auth } from "../../app/firebase";
import avatar from "../../assets/avatar-.png";
// import logo from "../../assets/zpunkt.png";
import ChatSidebarTab from "../SideBarTabs/ChatSidebarTab";
import DocsSidebarTab from "../SideBarTabs/DocsSidebarTab";
import UploadSidebarTab from "../SideBarTabs/UploadSidebarTab";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

export default function Sidebar() {
  const [user, authLoading] = useAuthState(auth);
  const [selectedTab, setSelectedTab] = useState("Chat");
  const [isCollapse, setIsCollapse] = useState(false);

  if (authLoading) {
    return (
      <Skeleton className="h-full w-[250px] rounded-xl border bg-text__gray" />
    );
  }

  return (
    <>
      <aside
        className={`hidden ${
          isCollapse ? "max-w-[0px]" : "md:max-w-[270px]"
        } w-full md:flex flex-col drop-shadow-lg bg-primary duration-300 opacity-0 md:opacity-100 text-white`}
      >
        <div className="px-4 flex items-center justify-between p-2">
          <div className={`${isCollapse ? "hidden" : "block"}`}>
            {/* <Image
          src={logo}
          width={200}
          height={50}
          className="w-[150px]"
          alt="zpunkt"
        /> */}
            LOGO
          </div>
          <Button
            onClick={() => setIsCollapse(!isCollapse)}
            variant="secondary"
          >
            <GoSidebarCollapse size={25} />
          </Button>
        </div>
        <nav className={`h-full pt-4 ${isCollapse ? "hidden" : "block"}`}>
          {/* Tabs */}
          <Tabs defaultValue="Chat" className="hidden md:flex flex-col h-full">
            <TabsList className="w-full px-4 flex gap-x-2 justify-evenly">
              <TabsTrigger
                onClick={() => setSelectedTab("Chat")}
                className={`rounded-xl w-full duration-200 hover:bg-secondary border border-secondary ${
                  selectedTab === "Chat" &&
                  "bg-secondary text-white border-secondary"
                }`}
                value="Chat"
              >
                Chat
              </TabsTrigger>
              <TabsTrigger
                onClick={() => setSelectedTab("Upload")}
                className={`rounded-xl w-full duration-200 hover:bg-secondary border border-secondary ${
                  selectedTab === "Upload" &&
                  "bg-secondary text-white border-secondary"
                }`}
                value="Upload"
              >
                Upload
              </TabsTrigger>
              <TabsTrigger
                onClick={() => setSelectedTab("Docs")}
                className={`rounded-xl w-full duration-200 hover:bg-secondary border border-secondary ${
                  selectedTab === "Docs" &&
                  "bg-secondary text-white border-secondary"
                }`}
                value="Docs"
              >
                Docs
              </TabsTrigger>
            </TabsList>

            {/* Dynamic contents */}
            <div
              className={`px-4 py-2 h-full flex flex-col mt-3 ${
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
        <div
          className={`bg-secondary m-1 rounded-xl ${
            isCollapse ? "hidden" : "block"
          }`}
        >
          <Link
            href="/profile"
            className="px-2 py-4 hidden md:flex justify-between items-center gap-2"
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
            <div className="flex-1 overflow-hidden leading-[20px] text-white">
              <p>{user?.displayName}</p>
              <small className="text-brand__font__size__xs">
                {user?.email}
              </small>
            </div>
          </Link>
        </div>
      </aside>

      <Sheet className="block md:hidden">
        <SheetTrigger>
          <Button
            variant="secondary"
            className="absolute top-0 right-0 text-white block md:hidden"
          >
            <GoSidebarCollapse size={25} />
          </Button>
        </SheetTrigger>

        <SheetContent
          className="bg-primary flex md:hidden flex-col justify-between h-full border-none"
          side="left"
        >
          <aside
            className={`w-full flex flex-col h-full bg-primary duration-300 text-white`}
          >
            <div className="px-4 flex items-center justify-between p-2">
              <div>LOGO</div>
            </div>
            <nav className="h-full pt-4">
              <Tabs defaultValue="Chat" className="flex flex-col h-full">
                <TabsList className="w-full px-4 flex gap-x-2 justify-evenly">
                  <TabsTrigger
                    onClick={() => setSelectedTab("Chat")}
                    className={`rounded-xl w-full duration-200 hover:bg-secondary border border-secondary ${
                      selectedTab === "Chat" &&
                      "bg-secondary text-white border-secondary"
                    }`}
                    value="Chat"
                  >
                    Chat
                  </TabsTrigger>
                  <TabsTrigger
                    onClick={() => setSelectedTab("Upload")}
                    className={`rounded-xl w-full duration-200 hover:bg-secondary border border-secondary ${
                      selectedTab === "Upload" &&
                      "bg-secondary text-white border-secondary"
                    }`}
                    value="Upload"
                  >
                    Upload
                  </TabsTrigger>
                  <TabsTrigger
                    onClick={() => setSelectedTab("Docs")}
                    className={`rounded-xl w-full duration-200 hover:bg-secondary border border-secondary ${
                      selectedTab === "Docs" &&
                      "bg-secondary text-white border-secondary"
                    }`}
                    value="Docs"
                  >
                    Docs
                  </TabsTrigger>
                </TabsList>

                <div
                  className={`px-4 py-2 h-full flex flex-col mt-3 ${
                    selectedTab === "Upload" ? "justify-end" : "justify-start"
                  }`}
                >
                  <ChatSidebarTab />
                  <UploadSidebarTab />
                  <DocsSidebarTab selectedTab={selectedTab} />
                </div>
              </Tabs>
            </nav>

            <div>
              <Link
                href="/profile"
                className="px-2 py-4 flex justify-between items-center gap-2"
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
                <div className="flex-1 overflow-hidden leading-[20px] text-white">
                  <p>{user?.displayName}</p>
                  <small className="text-brand__font__size__xs">
                    {user?.email}
                  </small>
                </div>
              </Link>
            </div>
          </aside>
        </SheetContent>
      </Sheet>
    </>
  );
}
