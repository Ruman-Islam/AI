"use client";

import DashboardLayout from "@/components/common/DashboardLayout";
import Spinner from "@/components/common/Spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { ChatContext } from "@/context";
import { sortDocumentsByTimestampDesc } from "@/utils/sort";
import { deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useContext, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import { FaDownload, FaEdit, FaFilePdf, FaRegTrashAlt } from "react-icons/fa";
import { GrNotes } from "react-icons/gr";
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
  const [chats, setChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [updateSelectedData, setUpdateSelectedData] = useState({});
  const [updateLoading, setUpdateLoading] = useState(false);
  const descendingSortedChats = sortDocumentsByTimestampDesc(state?.chats);
  const filteredChats = descendingSortedChats.filter((item) =>
    item?.chatTitle?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

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
      reset();
      setUpdateSelectedData({});
      setUpdateLoading(false);
      setOpenModal(false);
    }
  };

  return (
    <>
      <DashboardLayout>
        <div className="p-3 w-full flex flex-col gap-5 container">
          <div className="flex flex-col md:flex-row w-full gap-x-5 gap-y-2 md:justify-between md:items-center">
            <div className="mt-2">
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

          <div>
            <div>
              {(state?.chatIsLoading
                ? Array.from(new Array(state.chats?.length))
                : filteredChats
              ).map((item, i) =>
                item ? (
                  <div key={i}>
                    <div className="bg-white flex flex-col sm:flex-row justify-between items-center rounded-xl gap-5 p-4 my-2">
                      <div className="flex items-center justify-between gap-x-4">
                        <div>
                          <GrNotes />
                        </div>
                        <div className="font-brand__font__500">
                          <span>{item?.chatTitle}</span>
                          <div></div>
                        </div>
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
