"use client";

import DashboardLayout from "@/components/common/DashboardLayout";
import Spinner from "@/components/common/Spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { ChatContext } from "@/context";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import { FaDownload, FaEdit, FaFilePdf, FaRegTrashAlt } from "react-icons/fa";
import { auth, db } from "../firebase";

export default function Archive() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { toast } = useToast();
  const { state, dispatch } = useContext(ChatContext);
  const [user] = useAuthState(auth);
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [updateSelectedData, setUpdateSelectedData] = useState({});
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const chatIdsLength = state.chatIds?.length;
  const filteredChats = state?.chats.filter((item) =>
    item?.chatTitle?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setIsChatLoading(true);
        const q = query(
          collection(db, "chatHistory"),
          orderBy("createdAt", "desc")
        );
        const chats = await getDocs(q);
        const chatsData = chats?.docs.map((doc) => ({
          id: doc?.id,
          ...doc?.data(),
        }));

        dispatch({
          type: "LOAD_CHAT",
          payload: chatsData.filter((item) => item.userId === user?.uid),
        });
      } catch (error) {
        toast({
          title: <h1 className="text-lg">Something went wrong!</h1>,
          variant: "destructive",
          className: "bg-text__error text-white",
        });
      } finally {
        setIsChatLoading(false);
      }
    };

    fetchChats();
  }, [dispatch, toast, user?.uid]);

  const handleSearch = (search) => {
    setSearchTerm(search);
  };

  const handleDelete = async (id) => {
    const filteredChats = state?.chats.filter((item) => item.id !== id);
    const filteredChatIds = state?.chatIds.filter((item) => item.id !== id);
    try {
      await deleteDoc(doc(db, "chatHistory", id));
      dispatch({
        type: "LOAD_CHAT",
        payload: filteredChats,
      });
      dispatch({
        type: "LOAD_CHAT_ID",
        payload: filteredChatIds,
      });
      return toast({
        title: <h1 className="text-lg">Deleted successfully</h1>,
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

  const handleUpdate = (data) => {
    setUpdateSelectedData(data);
    setOpenModal(true);
  };

  const onUpdate = async (data) => {
    const { chatTitle } = data;
    setUpdateLoading(true);

    try {
      const docRef = doc(db, "chatHistory", updateSelectedData.id);
      await updateDoc(docRef, {
        chatTitle: chatTitle,
        createdAt: serverTimestamp(),
      });

      const filteredChats = state?.chats.map((item) => {
        if (item?.id === updateSelectedData.id) {
          return {
            ...item,
            chatTitle,
          };
        } else {
          return item;
        }
      });

      const filteredChatIds = state?.chatIds.map((item) => {
        if (item?.id === updateSelectedData.id) {
          return {
            ...item,
            chatTitle,
          };
        } else {
          return item;
        }
      });

      dispatch({
        type: "LOAD_CHAT",
        payload: filteredChats,
      });
      dispatch({
        type: "LOAD_CHAT_ID",
        payload: filteredChatIds,
      });

      return toast({
        title: <h1 className="text-lg">Updated successfully</h1>,
        className: "bg-text__success text-white",
      });
    } catch (error) {
      return toast({
        title: <h1 className="text-lg">Something went wrong!</h1>,
        variant: "destructive",
        className: "bg-text__error text-white",
      });
    } finally {
      // reset();
      setUpdateSelectedData({});
      setUpdateLoading(false);
      setOpenModal(false);
    }
  };

  return (
    <>
      <DashboardLayout>
        <div className="p-3 w-full h-full flex flex-col gap-5 container">
          <div className="flex flex-col md:flex-row w-full gap-x-5 gap-y-2 md:justify-between md:items-center">
            <div className="mt-2.5">
              <h1 className="text-brand__font__size__lg leading-[20px]">
                Chat Archive
              </h1>
              <small className="font-brand__font__500">
                Manage previous chat histories
              </small>
            </div>
            <div className="flex-1 w-full max-w-[700px]">
              <Input
                className="focus-outline-none border-none focus-visible:ring-0 py-4"
                placeholder="Type..."
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
          <Separator className="border-b border-primary" />

          <div className="h-full overflow-y-auto">
            <div className="px-4">
              {(isChatLoading
                ? Array.from(new Array(chatIdsLength > 0 ? chatIdsLength : 10))
                : filteredChats
              ).map((item, i) =>
                item ? (
                  <div key={i}>
                    <div className="bg-white flex flex-col sm:flex-row justify-between items-center rounded-xl gap-5 p-4 my-2 text-primary">
                      <div className="flex flex-col">
                        {item?.chatTitle?.length > 50 ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link
                                href={`/chat?chatId=${item?.id}`}
                                className="mb-1 text-brand__font__size__sm pl-1 font-brand__font__500 hover:text-text__link duration-200"
                              >
                                {item?.chatTitle.slice(0, 47) + "..."}
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent className="bg-white">
                              <p>{item?.chatTitle}</p>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <Link
                            href={`/chat?chatId=${item?.id}`}
                            className="mb-1 text-brand__font__size__sm pl-1 font-brand__font__500 hover:text-text__link duration-200"
                          >
                            {item?.chatTitle}
                          </Link>
                        )}
                        <Badge variant="outline" className="w-fit">
                          {new Date(item?.createdAt?.seconds).toDateString()}
                        </Badge>
                      </div>
                      <div className="flex justify-between gap-x-3 text-brand__font__size__md">
                        <Button
                          onClick={() => handleDelete(item?.id)}
                          variant="outline"
                          className="hover:text-text__error hover:border-text__error duration-200"
                        >
                          <FaRegTrashAlt />
                        </Button>
                        <Button
                          onClick={() => handleUpdate(item)}
                          variant="outline"
                          className="hover:text-text__link hover:border-text__link duration-200"
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="outline"
                          className="hover:text-primary hover:border-primary duration-200"
                        >
                          <FaDownload />
                        </Button>
                        <Button
                          variant="outline"
                          className="hover:text-primary hover:border-primary duration-200"
                        >
                          <FaFilePdf />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Skeleton
                    key={i}
                    className="h-[60px] mb-2 rounded-xl bg-text__gray"
                  />
                )
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>
              <p className="text-brand__font__size__lg mb-2">
                Edit display name
              </p>
            </DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <form
              onSubmit={handleSubmit(onUpdate)}
              className="w-full flex gap-2"
            >
              <div className="w-full">
                <Input
                  {...register("chatTitle", {
                    required: true,
                  })}
                  defaultValue={updateSelectedData?.chatTitle}
                />
                {errors?.chatTitle?.type === "required" && (
                  <small className="text-text__error">
                    This field is required
                  </small>
                )}
              </div>

              <Button
                disabled={updateLoading}
                className="text-white"
                type="submit"
              >
                {updateLoading ? (
                  <Spinner styles="w-5 h-5 text-white" />
                ) : (
                  "Save changes"
                )}
              </Button>
            </form>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
