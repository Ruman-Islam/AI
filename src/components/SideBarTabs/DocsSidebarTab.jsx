import { db } from "@/app/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { TabsContent } from "../ui/tabs";

export default function DocsSidebarTab({ selectedTab }) {
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

  return (
    <TabsContent value="Docs" className="h-full">
      <ul className="max-h-[560px] h-full inline-block overflow-y-auto px-5 text-brand__font__size__sm w-full">
        {docs.map((doc) => (
          <li className="list-disc break-words" key={doc?.id}>
            {doc?.filename}
          </li>
        ))}
      </ul>
    </TabsContent>
  );
}
