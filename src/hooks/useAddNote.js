import { auth, db } from "@/app/firebase";
import { useToast } from "@/components/ui/use-toast";
import { ChatContext } from "@/context";
import {
  addDoc,
  collection,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useContext } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export default function useAddNote() {
  const { toast } = useToast();
  const [user] = useAuthState(auth);
  const { dispatch } = useContext(ChatContext);

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

  return { addNote };
}
