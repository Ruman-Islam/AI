import { useToast } from "@/components/ui/use-toast";

export default function useCopyToClipboard() {
  const { toast } = useToast();

  const copyToClipboard = async (text) => {
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

  return { copyToClipboard };
}
