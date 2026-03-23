import { useToast } from "./useToast";

export const useShare = () => {
  const { toast } = useToast();

  const share = async (data: { title: string; text?: string; url: string }) => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(data);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Error sharing:", error);
          copyToClipboard(data.url);
        }
      }
    } else {
      copyToClipboard(data.url);
    }
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy link.");
    }
  };

  return { share };
};
