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
        <div className="flex justify-between gap-2 text-primary">
          <Button
            onClick={handleOpenNewChat}
            variant="outline"
            className={`w-full ${pathname === "/chat" && "border-primary"}`}
          >
            New Chat
          </Button>
          <Button
            onClick={() => router.push("/archive")}
            variant="outline"
            className={`w-full ${pathname === "/archive" && "border-primary"}`}
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
