import axios from "@/api/axios";
import { db } from "@/app/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { TabsContent } from "../ui/tabs";
import { useToast } from "../ui/use-toast";

export default function UploadSidebarTab() {
  const { toast } = useToast();

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await axios.post(
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

  return (
    <TabsContent value="Upload" className="h-full">
      <div className="h-full flex flex-col justify-end">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="upload">File upload</Label>
          <Input
            className="text-white"
            id="upload"
            type="file"
            onChange={handleFileUpload}
          />
        </div>
      </div>
    </TabsContent>
  );
}
