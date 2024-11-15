import { toast } from "react-toastify";

export const showSuccessToast = (message: string | undefined) => {
  toast.success(message);
};

export const showErrorToast = (message: string | undefined) => {
  toast.error(message);
};

export const showInfoToast = (message: string | undefined) => {
  toast.info(message);
};

export const showWarningToast = (message: string | undefined) => {
  toast.warn(message);
};
