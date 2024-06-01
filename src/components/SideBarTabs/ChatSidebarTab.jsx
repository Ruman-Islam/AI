import { auth, db } from "@/app/firebase";
import { ChatContext } from "@/context";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Button } from "../ui/button";
import { TabsContent } from "../ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useToast } from "../ui/use-toast";

export default function ChatSidebarTab() {
  const { toast } = useToast();
  const [user, authLoading] = useAuthState(auth);
  const router = useRouter();
  const pathname = usePathname();
  const { state, dispatch } = useContext(ChatContext);

  useEffect(() => {
    const fetchChatTitles = async () => {
      try {
        const q = query(
          collection(db, "chatHistory"),
          orderBy("createdAt", "desc")
        );
        const chatTitles = await getDocs(q);
        const chatTitlesData = chatTitles?.docs.map((doc) => ({
          id: doc?.id,
          ...doc?.data(),
        }));

        dispatch({
          type: "LOAD_CHAT_ID",
          payload: chatTitlesData.filter((item) => item.userId === user?.uid),
        });
      } catch (error) {
        toast({
          title: <h1 className="text-lg">Something went wrong!</h1>,
          variant: "destructive",
          className: "bg-text__error text-white",
        });
      }
    };

    fetchChatTitles();
  }, [dispatch, toast, user?.uid]);

  const handleOpenNewChat = () => {
    dispatch({
      type: "LOAD_CHAT",
      payload: [],
    });

    router.push("/chat");
  };

  return (
    <TabsContent value="Chat" className="h-full">
      <div className="h-full flex flex-col gap-y-3">
        <div className="flex justify-between gap-2 text-white">
          <Button
            onClick={handleOpenNewChat}
            className={`w-full bg-transparent border border-secondary ${
              pathname === "/chat" && "bg-secondary"
            }`}
          >
            New Chat
          </Button>
          <Button
            onClick={() => router.push("/archive")}
            className={`w-full bg-transparent border border-secondary ${
              pathname === "/archive" && "bg-secondary"
            }`}
          >
            Archive
          </Button>
        </div>
        <ul className="max-h-[510px] h-full inline-block overflow-y-auto mt-2">
          {state?.chatIds?.map((item) => (
            <li
              key={item?.id}
              className="inline-block max-w-[250px] w-full text-brand__font__size__sm font-brand__font__500 duration-200"
            >
              <Link
                href={`/chat?chatId=${item?.id}`}
                className="inline-block w-full hover:bg-secondary duration-200 px-3 py-2 rounded-xl"
              >
                {item?.chatTitle?.length > 24 ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>{item?.chatTitle.slice(0, 24) + "..."}</span>
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
  );
}
