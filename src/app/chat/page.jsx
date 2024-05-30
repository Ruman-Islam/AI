"use client";
import axios, { BASE_URL } from "@/api/axios";
import DashboardLayout from "@/components/common/DashboardLayout";
import Spinner from "@/components/common/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { ChatContext } from "@/context";
import { formatText } from "@/utils/formattedText";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import { FaFileAlt, FaRegCopy } from "react-icons/fa";
import { IoSendSharp } from "react-icons/io5";
import { v4 as uuid } from "uuid";
import Typewriter from "../../components/Typewriter";
import { auth, db } from "../firebase";

export default function Chat() {
  const [user, loading, error] = useAuthState(auth);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { toast } = useToast();
  const pathname = usePathname();
  const router = useRouter();
  const messageEl = useRef(null);
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chatId");
  const [userMessage, setUserMessage] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [createdChatId, setCreatedChatId] = useState("");
  const { state, dispatch } = useContext(ChatContext);
  const chatLength = state?.chats?.length;

  // Auto scroll subscribing
  useEffect(() => {
    if (messageEl.current) {
      messageEl.current.addEventListener("DOMNodeInserted", (event) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: "smooth" });
      });
    }
  }, []);

  // Chat in current conversation
  useEffect(() => {
    const handleFetch = async () => {
      if (userMessage.content) {
        setIsLoading(true);
        const payload = {
          messages: [
            {
              content: userMessage.content,
              role: "user",
            },
          ],
        };

        try {
          const res = await axios.post("/api/chat/request", payload);
          const role = res?.data?.result?.role;
          const nodes = res?.data?.nodes;
          const content = res?.data?.result?.content;
          const newConversation = {
            type: "new",
            role: role,
            content: content,
            nodes: nodes,
          };

          if (chatId) {
            // update existing chat
            const filtered = state?.chats.map((chat) => {
              if (chat.type) {
                return {
                  ...chat,
                  type: "",
                };
              } else {
                return chat;
              }
            });
            const docRef = doc(db, "chatHistory", chatId);
            await updateDoc(docRef, {
              history: [
                ...filtered,
                {
                  role: role,
                  content: content,
                  nodes: nodes,
                },
              ],
              createdAt: serverTimestamp(),
            });

            dispatch({
              type: "ADD_NEW_CHAT",
              payload: newConversation,
            });
          } else {
            // create new chat
            const chatBody = {
              userId: user?.uid,
              chatId: uuid(),
              chatTitle: userMessage.content,
              history: [
                userMessage,
                { role: role, nodes: nodes, content: content },
              ],
            };

            const docRef = await addDoc(collection(db, "chatHistory"), {
              ...chatBody,
              createdAt: serverTimestamp(),
            });

            const docSnap = await getDoc(docRef);
            const doc = docSnap.data();

            dispatch({
              type: "ADD_NEW_CHAT",
              payload: newConversation,
            });

            dispatch({
              type: "ADD_CHAT_ID",
              payload: {
                id: docSnap?.id,
                chatTitle: doc?.chatTitle,
                createdAt: doc?.createdAt,
              },
            });

            setCreatedChatId(docSnap?.id);
          }
        } catch (error) {
          return toast({
            title: <h1 className="text-lg">Something went wrong!</h1>,
            variant: "destructive",
            className: "bg-text__error text-white",
          });
        } finally {
          setUserMessage({});
          setIsLoading(false);
        }
      }
    };

    handleFetch();
  }, [chatId, dispatch, router, state?.chats, toast, user?.uid, userMessage]);

  // Fetch chat based on chatId and chat titles;
  useEffect(() => {
    const fetchChats = async () => {
      try {
        if (pathname.includes("/chat") && chatId) {
          // Get one chat by ID
          setIsChatLoading(true);
          const chats = await getDocs(collection(db, "chatHistory"));
          const chatsData = chats?.docs.map((doc) => ({
            id: doc?.id,
            ...doc?.data(),
          }));

          const getOneChat = chatsData?.find((chat) => chat?.id === chatId);
          dispatch({
            type: "LOAD_CHAT",
            payload: getOneChat?.history?.length ? getOneChat?.history : [],
          });
        }
      } catch (error) {
        return toast({
          title: <h1 className="text-lg">Something went wrong!</h1>,
          variant: "destructive",
          className: "bg-text__error text-white",
        });
      } finally {
        setIsChatLoading(false);
      }
    };

    fetchChats();
  }, [chatId, dispatch, pathname, toast]);

  // Submitting for chat request
  async function onSubmit(data) {
    const { message } = data;
    const msgBody = {
      role: "user",
      content: message,
      nodes: [],
    };

    dispatch({
      type: "ADD_NEW_CHAT",
      payload: msgBody,
    });
    setUserMessage(msgBody);
    reset();
  }

  const handleCopyToClipBoard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return toast({
        title: <h1 className="text-lg">Copied</h1>,
        className: "bg-text__success text-white",
      });
    } catch (err) {
      return toast({
        title: <h1 className="text-lg">Try again</h1>,
        variant: "destructive",
        className: "bg-text__error text-white",
      });
    }
  };

  const addNote = async (note) => {
    try {
      const docRef = await addDoc(collection(db, "notes"), {
        note: note,
        userId: user?.uid,
        createdAt: serverTimestamp(),
      });

      const docSnap = await getDoc(docRef);
      const doc = docSnap.data();

      dispatch({
        type: "ADD_NOTE",
        payload: {
          note: doc.note,
          id: docSnap?.id,
          userId: doc.userId,
          createdAt: doc?.createdAt,
        },
      });

      return toast({
        title: <h1 className="text-lg">Note added</h1>,
        className: "bg-text__success text-white",
      });
    } catch (error) {
      return toast({
        title: <h1 className="text-lg">Something went wrong!</h1>,
        variant: "destructive",
        className: "bg-text__error text-white",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col justify-between px-3 pb-3 container">
        <div
          className="overflow-y-auto flex-1 h-full px-0 md:px-20"
          ref={messageEl}
        >
          {chatId || chatLength ? (
            (isChatLoading
              ? Array.from(new Array(chatLength > 0 ? chatLength : 4))
              : state.chats
            ).map((item, i) => {
              if (item) {
                const isUser = item?.role?.includes("user");
                const isNew = item?.type?.includes("new");
                const nodes = item?.nodes?.length ? item?.nodes : [];
                return (
                  <div
                    key={i}
                    className={`w-full flex mb-2 pt-3 ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div>
                      <div className="bg-white max-w-[600px] px-4 text-brand__font__size__sm border rounded-xl shadow flex justify-start text-primary">
                        {isUser ? (
                          <span className="py-3 inline-block">
                            {item?.content}
                          </span>
                        ) : isNew ? (
                          <Typewriter
                            text={item?.content}
                            speed={50}
                            createdChatId={createdChatId}
                          />
                        ) : (
                          <span className="py-4 inline-block">
                            {formatText(item?.content ? item?.content : "")}
                          </span>
                        )}
                      </div>
                      {nodes.length > 0 && !isUser ? (
                        <div className="flex flex-col gap-1 mt-1 text-text__link font-brand__font__500 max-w-[600px] w-full">
                          <small className="px-2">Quellen</small>
                          <ul className="flex flex-col">
                            {nodes.map((nodeItem) => {
                              const slicedFileName =
                                nodeItem?.metadata?.file_name?.split("/");
                              const fileName =
                                slicedFileName[slicedFileName.length - 1];
                              const filePath = nodeItem?.metadata?.file_path;
                              return (
                                <li
                                  key={nodeItem?.id}
                                  className="inline-block bg-white px-2 py-1.5 mb-1 text-brand__font__size__xs shadow w-full"
                                >
                                  <a
                                    className="w-fit inline-block"
                                    target="_blank"
                                    href={`${BASE_URL}/files${filePath}`}
                                  >
                                    <small>{fileName}</small>
                                  </a>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ) : null}
                      {!isUser ? (
                        <div className="px-2 flex items-center gap-x-4 text-brand__font__size__xs mt-1 font-brand__font__600 text-primary">
                          <button
                            onClick={() => handleCopyToClipBoard(item?.content)}
                            className="flex items-center justify-between gap-x-1 hover:text-text__link duration-200"
                          >
                            <FaRegCopy size={10} />
                            <small>Copy</small>
                          </button>
                          <button
                            onClick={() => addNote(item?.content)}
                            className="flex items-center justify-between gap-x-1 hover:text-text__link duration-200"
                          >
                            <FaFileAlt size={10} />
                            <small>Note</small>
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              } else {
                return (
                  <div
                    key={i}
                    className="flex justify-between w-full mb-2 pt-3 gap-x-5"
                  >
                    <div className="h-[100px] max-w-[600px] w-full rounded-xl mt-10 mb-10 border">
                      <Skeleton className="bg-text__gray mb-2 w-full h-[100px]" />
                      <Skeleton className="bg-text__gray mb-2 w-full h-[20px]" />
                      <Skeleton className="bg-text__gray mb-2 w-full h-[20px]" />
                    </div>
                    <Skeleton className="h-[50px] max-w-[200px] w-full rounded-xl bg-text__gray" />
                  </div>
                );
              }
            })
          ) : !chatId && !chatLength ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <div className="bg-gradient-to-tr from-primary to-[#119D8E] text-white text-center max-w-[700px] w-full mx-auto p-5 font-brand__font__600 border border-text__primary rounded-xl">
                <h1 className="text-brand__font__size__xl mb-10">z-Punkt</h1>

                <p className="mb-5">
                  Hallo ich bin ihr AI-Zukunftsassistent, Ihr künstlicher
                  Intelligenzassistent für Zukunftsfragen
                </p>
                <p className="mb-5">
                  Dieses hochmoderne KI-Werkzeug ist sorgfältig konzipiert, um
                  professionelle Beratung mit bemerkenswerter Genauigkeit und
                  Einsicht zu bieten. Der AI-Zukunftsassistent ist darauf
                  ausgerichtet, maßgeschneiderte Expertenunterstützung für Ihre
                  einzigartigen Herausforderungen zu liefern.
                </p>
                <p>Bitte zögern Sie nicht, Ihre Fragen zu stellen...</p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Input */}
        <div className="px-0 md:px-20">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="relative border">
              <Input
                {...register("message", {
                  required: true,
                })}
                type="text"
                placeholder="Message AI"
                className="focus-outline-none border-none focus-visible:ring-0 py-6"
              />
              <div className="absolute top-1 right-0 text-primary">
                <Button
                  disabled={isLoading}
                  className="bg-transparent hover:bg-transparent"
                >
                  {isLoading ? (
                    <Spinner styles="w-5 h-5" />
                  ) : (
                    <IoSendSharp size={25} />
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
