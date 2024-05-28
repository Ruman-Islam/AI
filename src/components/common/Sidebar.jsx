import axios from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { toast } from "../ui/use-toast";

export default function Sidebar() {
  const router = useRouter();
  const [user, authLoading] = useAuthState(auth);
  const { state, dispatch } = useContext(ChatContext);
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

  const handleOpenNewChat = () => {
    dispatch({
      type: "LOAD_CHAT",
      payload: [],
    });

    router.push("/chat");
  };

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
            <TabsContent value="Chat" className="h-full">
              <div className="h-full flex flex-col gap-y-3">
                <div className="flex justify-between gap-2 text-primary">
                  <Button
                    onClick={handleOpenNewChat}
                    variant="outline"
                    className={`w-full ${
                      pathname === "/chat" && "border-primary"
                    }`}
                  >
                    New Chat
                  </Button>
                  <Button
                    onClick={() => router.push("/archive")}
                    variant="outline"
                    className={`w-full ${
                      pathname === "/archive" && "border-primary"
                    }`}
                  >
                    Archive
                  </Button>
                </div>
                <ul className="max-h-[510px] h-full inline-block overflow-y-auto">
                  {state?.chatIds?.map((item) => (
                    <li
                      key={item?.id}
                      className="text-primary inline-block max-w-[250px] w-full text-brand__font__size__sm font-brand__font__500 hover:text-text__link mb-1.5 pl-1 duration-200"
                    >
                      <Link
                        href={`/chat?chatId=${item?.id}`}
                        className="inline-block w-full"
                      >
                        {item?.chatTitle?.length > 24 ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span>
                                {item?.chatTitle.slice(0, 24) + "..."}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className="bg-white">
                              <span>{item?.chatTitle}</span>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <span>{item?.chatTitle}</span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="Upload" className="h-full">
              <div className="h-full flex flex-col justify-end">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="upload">File upload</Label>
                  <Input id="upload" type="file" onChange={handleFileUpload} />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="Docs" className="h-full">
              <ul className="max-h-[560px] h-full inline-block overflow-y-auto px-5 text-brand__font__size__sm w-full">
                {docs.map((doc) => (
                  <li className="list-disc break-words" key={doc?.id}>
                    {doc?.filename}
                  </li>
                ))}
              </ul>
            </TabsContent>
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
