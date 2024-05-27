import { addDoc, getDocs ,collection } from "firebase/firestore";
import { db } from "./firebase";

async function addData(collectionName, data) {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

// async function getData(collectionName, data) {
//   try {
//     const docRef = await addDoc(collection(db, collectionName), data);
//     console.log("Document written with ID: ", docRef.id);
//   } catch (e) {
//     console.error("Error adding document: ", e);
//   }
// }

export { addData };
