import { create } from 'zustand';

interface ConfirmOptions {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'primary';
}

interface ConfirmState {
    isOpen: boolean;
    options: ConfirmOptions;
    resolve: ((value: boolean) => void) | null;
    confirm: (options: ConfirmOptions) => Promise<boolean>;
    onConfirm: () => void;
    onCancel: () => void;
}

export const useConfirmStore = create<ConfirmState>((set, get) => ({
    isOpen: false,
    options: {
        title: '',
        message: '',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        variant: 'primary',
    },
    resolve: null,
    confirm: (options) => {
        return new Promise((resolve) => {
            set({
                isOpen: true,
                options: {
                    ...get().options,
                    ...options,
                },
                resolve,
            });
        });
    },
    onConfirm: () => {
        const { resolve } = get();
        if (resolve) resolve(true);
        set({ isOpen: false, resolve: null });
    },
    onCancel: () => {
        const { resolve } = get();
        if (resolve) resolve(false);
        set({ isOpen: false, resolve: null });
    },
}));
