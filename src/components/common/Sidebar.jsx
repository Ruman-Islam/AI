import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../app/firebase";
import avatar from "../../assets/avatar-.png";

const mainTabs = [
  { id: 1, title: "Tab 1" },
  { id: 2, title: "Tab 2" },
  { id: 3, title: "Tab 3" },
];

export default function Sidebar() {
  const router = useRouter();
  const [user, ,] = useAuthState(auth);
  const [selectedTab, setSelectedTab] = useState("Tab 1");

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [router, user]);

  return (
    <aside className="max-w-[0px] md:max-w-[270px] w-full flex flex-col drop-shadow-lg m-0 md:m-3 md:mr-0 border rounded-xl bg-[#F1F4F8]  duration-300 opacity-0 md:opacity-100">
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
      <div>
        <Link
          href="/profile"
          className="px-2 py-4 border-t border-text__gray text-primary hidden md:flex justify-between items-center gap-2"
        >
          {/* <button onClick={() => signOut()}>Logout</button> */}
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
