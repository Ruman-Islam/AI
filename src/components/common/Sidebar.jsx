import { Button } from "@/components/ui/button";
import { ChatContext } from "@/context";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../app/firebase";
import avatar from "../../assets/avatar-.png";

const mainTabs = [
  { id: 1, title: "Chat" },
  { id: 2, title: "Upload" },
  { id: 3, title: "Docs" },
];

export default function Sidebar() {
  const router = useRouter();
  const [user, authLoading] = useAuthState(auth);
  const [selectedTab, setSelectedTab] = useState("Chat");
  const { state } = useContext(ChatContext);

  // useEffect(() => {
  //   if (!user) {
  //     router.push("/");
  //   }
  // }, [router, user]);

  if (authLoading) {
    return "";
  }

  return (
    <aside className="max-w-[0px] md:max-w-[270px] w-full flex flex-col drop-shadow-lg m-0 md:m-3 md:mr-0 border rounded-xl bg-[#F1F4F8]  duration-300 opacity-0 md:opacity-100">
      <div className="border-b border-text__gray p-6 hidden md:flex">
        <h1>LOGO</h1>
      </div>
      <nav className="hidden md:flex flex-col h-full">
        {/* Tabs */}
        <div className="w-full flex justify-between gap-2 p-4 text-white">
          {mainTabs.map((item) => (
            <Button
              onClick={() => setSelectedTab(item?.title)}
              className={`w-full h-8 rounded-xl hover:bg-text__primary duration-200 ${
                selectedTab.includes(item?.title) ? "bg-text__primary" : ""
              }`}
              key={item?.id}
            >
              <small>{item?.title}</small>
            </Button>
          ))}
        </div>

        {/* Dynamic contents */}
        <div className="p-4 border-t border-b border-text__gray h-full">
          <div className="h-full flex flex-col">
            <div className="flex justify-between gap-2 text-white">
              <Link
                href="/chat"
                className="w-full rounded-xl hover:bg-text__primary duration-200 inline-block border text-center text-brand__font__size__sm py-1 bg-primary"
              >
                New Chat
              </Link>
              <Link
                href="/chat"
                className="w-full rounded-xl hover:bg-text__primary duration-200 inline-block border text-center text-brand__font__size__sm py-1 bg-primary"
              >
                Archive
              </Link>
            </div>
            <ul className="h-full py-4">
              {state?.chatIds?.map((item) => (
                <li
                  key={item?.id}
                  className="text-primary inline-block max-w-[250px] w-full text-brand__font__size__sm font-brand__font__600 hover:text-text__link"
                >
                  <Link
                    href={`/chat?chatId=${item?.id}`}
                    className="p-1 inline-block max-w-[250px] w-full"
                  >
                    {item?.chatTitle?.length > 24
                      ? item?.chatTitle.slice(0, 20) + "..."
                      : item?.chatTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {/* Profile menu */}
      <div>
        <Link
          href="/profile"
          className="px-2 py-4 text-primary hidden md:flex justify-between items-center gap-2"
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
