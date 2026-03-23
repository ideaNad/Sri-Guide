import { useToastStore, ToastType } from "@/store/useToastStore";

export const useToast = () => {
    const addToast = useToastStore((state) => state.addToast);

    const toast = {
        success: (message: string, title: string = "Success") => 
            addToast({ type: 'success', title, message }),
        error: (message: string, title: string = "Error") => 
            addToast({ type: 'error', title, message }),
        info: (message: string, title: string = "Note") => 
            addToast({ type: 'info', title, message }),
        warning: (message: string, title: string = "Warning") => 
            addToast({ type: 'warning', title, message }),
    };

    return { toast };
};
