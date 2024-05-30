import { auth, db } from "@/app/firebase";
import { useToast } from "@/components/ui/use-toast";
import { ChatContext } from "@/context";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import { FaCirclePlus } from "react-icons/fa6";
import { TiDeleteOutline } from "react-icons/ti";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Textarea } from "../ui/textarea";
import Spinner from "./Spinner";

export default function NoteBar() {
  const { toast } = useToast();
  const pathname = usePathname();
  const [authUser] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const { state, dispatch } = useContext(ChatContext);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchNotes = async () => {
      const notes = await getDocs(collection(db, "notes"));
      const notesData = notes?.docs.map((doc) => ({
        id: doc?.id,
        ...doc?.data(),
      }));

      const filtered = notesData.filter(
        (note) => note.userId === authUser?.uid
      );
      dispatch({
        type: "LOAD_NOTES",
        payload: filtered,
      });
    };

    fetchNotes();
  }, [dispatch, authUser?.uid]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "notes"), {
        note: data.note,
        userId: authUser.uid,
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
    } finally {
      reset();
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const filteredNotes = state?.notes.filter((item) => item.id !== id);
    try {
      await deleteDoc(doc(db, "notes", id));
      dispatch({
        type: "LOAD_NOTES",
        payload: filteredNotes,
      });
      return toast({
        title: <h1 className="text-lg">Deleted successfully</h1>,
        className: "bg-text__success text-white",
      });
    } catch (error) {
      console.log(error);
      return toast({
        title: <h1 className="text-lg">Something went wrong!</h1>,
        variant: "destructive",
        className: "bg-text__error text-white",
      });
    }
  };

  return (
    <Sheet>
      {pathname.includes("chat") && (
        <SheetTrigger>
          <FaCirclePlus
            size={40}
            className="absolute right-5 top-5 text-primary cursor-pointer"
          />
        </SheetTrigger>
      )}

      <SheetContent
        className="bg-white flex flex-col justify-between h-full"
        side="right"
      >
        <SheetHeader>
          <SheetTitle>
            <span className="text-brand__font__size__lg">Notes</span>
          </SheetTitle>
        </SheetHeader>
        <div className="py-4 flex-1 h-full overflow-y-auto">
          {state.notes.map((note) => (
            <div
              key={note?.id}
              className="border shadow mb-2 p-4 rounded-xl flex flex-col items-start justify-center relative mx-1.5"
            >
              <div>
                <span className="text-brand__font__size__xs font-brand__font__500">
                  Date: {new Date(note?.createdAt?.seconds).toDateString()}
                </span>
                <p className="text-brand__font__size__sm">{note?.note}</p>
              </div>
              <div
                className="hover:text-text__error duration-200 cursor-pointer absolute right-2 top-2"
                onClick={() => handleDelete(note?.id)}
              >
                <TiDeleteOutline size={20} />
              </div>
            </div>
          ))}
        </div>
        <SheetFooter>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="flex flex-col gap-3">
              <Textarea
                {...register("note", {
                  required: true,
                })}
                placeholder="Enter your personal note here"
                className="col-span-3"
              />
              {errors?.note?.type === "required" && (
                <small className="text-text__error">
                  This field is required
                </small>
              )}
              <Button
                type="submit"
                className="text-white max-w-[250px] w-full mx-auto"
              >
                {loading ? (
                  <Spinner styles="w-5 h-5 text-white" />
                ) : (
                  "Save changes"
                )}
              </Button>
            </div>
          </form>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
