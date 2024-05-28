import axios from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatContext } from "@/context";
import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../app/firebase";
import avatar from "../../assets/avatar-.png";
import logo from "../../assets/zpunkt.png";
import { toast } from "../ui/use-toast";

const mainTabs = [
  { id: 1, title: "Chat" },
  { id: 2, title: "Upload" },
  { id: 3, title: "Docs" },
];

export default function Sidebar() {
  const router = useRouter();
  const [user, authLoading] = useAuthState(auth);
  const { state } = useContext(ChatContext);
  const pathname = usePathname();
  const [selectedTab, setSelectedTab] = useState("Chat");
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      if (selectedTab === "Docs") {
        const docs = await getDocs(collection(db, "ingestedDocs"));
        const docsData = docs?.docs.map((doc) => ({
          id: doc?.id,
          ...doc?.data(),
        }));

        setDocs(docsData);
      }
    };
    fetchFiles();
  }, [selectedTab]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        await axios.post(
          "/api/ingest/upload-file?data_dir=/tmp/tmps7fzz1aa&use_llama_parse=true",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const docRef = await addDoc(collection(db, "ingestedDocs"), {
          filename: file.name,
          filetype: `.${file.name.split(".")[file.name.split(".").length - 1]}`,
          createdAt: serverTimestamp(),
        });

        toast({
          title: <h1 className="text-lg">Uploaded successfully</h1>,
          className: "bg-text__success text-white",
        });
      } catch (error) {
        toast({
          title: <h1 className="text-lg">Something went wrong!</h1>,
          variant: "destructive",
          className: "bg-text__error text-white",
        });
      } finally {
        e.target.value = "";
      }
    }
  };

  if (authLoading) {
    return (
      <Skeleton className="h-full w-[250px] rounded-xl border bg-text__gray" />
    );
  }

  return (
    <aside className="max-w-[0px] md:max-w-[270px] w-full flex flex-col drop-shadow-lg m-0 md:m-3 md:mr-0 border rounded-xl bg-white  duration-300 opacity-0 md:opacity-100">
      <div className="border-b border-text__gray p-6 hidden md:flex">
        <Image
          src={logo}
          width={200}
          height={50}
          className="w-full h-[120px]"
          alt="zpunkt"
        />
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
          {selectedTab === "Chat" && (
            <div className="h-full flex flex-col gap-y-3">
              <div className="flex justify-between gap-2 text-white">
                <Link
                  href="/chat"
                  className={`w-full rounded-xl hover:bg-text__primary duration-200 inline-block border text-center text-brand__font__size__sm py-1 ${
                    pathname === "/chat" ? "bg-text__primary" : "bg-primary"
                  }`}
                >
                  New Chat
                </Link>
                <Link
                  href="/archive"
                  className={`w-full rounded-xl hover:bg-text__primary duration-200 inline-block border text-center text-brand__font__size__sm py-1 ${
                    pathname === "/archive" ? "bg-text__primary" : "bg-primary"
                  }`}
                >
                  Archive
                </Link>
              </div>
              <ul className="max-h-[510px] h-full inline-block overflow-y-auto">
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
          )}

          {selectedTab === "Upload" && (
            <div className="h-full flex flex-col justify-end">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="upload">File upload</Label>
                <Input id="upload" type="file" onChange={handleFileUpload} />
              </div>
            </div>
          )}

          {selectedTab === "Docs" && (
            <div className="h-full">
              <ul className="h-full px-5 text-brand__font__size__xs">
                {docs.map((doc) => (
                  <li className="list-disc break-words" key={doc?.id}>
                    {doc?.filename}
                  </li>
                ))}
              </ul>
            </div>
          )}
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
