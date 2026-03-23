import { useConfirmStore } from "@/store/useConfirmStore";

export const useConfirm = () => {
    const confirm = useConfirmStore((state) => state.confirm);

    return { confirm };
};
