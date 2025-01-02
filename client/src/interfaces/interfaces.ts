import { MenuItem } from "./types";

export interface FormDataProps {
  name: string;
  email: string;
  message: string;
}
export interface NewsItemProps {
  date: string;
  text: string;
}

export interface PricingPlanProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  titleColor: string;
}

export interface ProtectedRouteProps {
  element: React.ReactElement;
}

export interface PPTTemplateProps {
  id: string;
  imgPath: string;
  title: string;
  category: string;
}

export interface TemplateCarouselProps {
  templates: PPTTemplateProps[];
}

export interface ContentCardProps {
  tooltipText: string;
  iconName: React.ReactElement;
  fileName: string;
  onClickMethod: () => void;
}

export interface FileDetailProps {
  name: string;
  type: string;
  size: number;
  thumbnail?: string;
  title?: string;
  category?: string;
}

export interface FileUploaderProps {
  onUpload: (files: File[]) => void;
}

export interface FileUploaderRef {
  getFileDetails: () => File[];
  uploadFiles: () => void;
}

export interface TemplateProps {
  id: string;
  thumbnail?: string;
  title?: string;
  category?: string;
}

export interface TemplatesDisplayProps {
  templates: TemplateProps[];
  useCarousel?: boolean;
}

export interface SideBarProps {
  selectedItem: MenuItem | null;
  onItemClick: (item: MenuItem) => void;
}

export interface CustomDropdownProps {
  options: { id: string; label: string }[];
  selectedOption: string;
  onChange: (option: string) => void;
}

export interface CustomModalProps {
  show: boolean;
  handleClose: () => void;
  title: string;
  children: React.ReactNode;
  actionLabel?: string;
  onAction: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export interface VerificationCodeInputProps {
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
}

export interface LoginModalProps {
  show: boolean;
  handleClose: () => void;
  title?: string;
  header?: string;
  onGoogleClick: () => void;
  onEmailClick: () => void;
}

export interface GoogleLoginModalProps {
  show: boolean;
  handleClose: () => void;
}

export interface FileListDisplayProps {
  mediaFiles: FileDetailProps[];
  showSize?: boolean;
  showDate?: boolean;
  showCheckbox?: boolean;
  selectedMediaFiles?: FileDetailProps[];
  onSelect?: (selectedFiles: FileDetailProps[]) => void;
  setMediaFiles?: React.Dispatch<React.SetStateAction<FileDetailProps[]>>;
  showRemoveButton?: boolean;
  removeButtonPosition?: "margin-left";
}

export interface PrivateRouteProps {
  element: JSX.Element;
  flag: string | string[];
}

export interface PrivateRouteFlagState {
  isRegister: boolean;
  isReset: boolean;
}

export interface RegisterResponse {
  name: string;
  email: string;
  message: string;
}

export interface LoginResponse {
  name: string;
  email: string;
  createdAt: string;
  plan: string;
  message: string;
}

export interface TokenResponse {
  userId: string;
}

export interface MessageResponse {
  message: string;
}

export interface VerifyEmailResponse {
  requestCode: boolean;
  message: string;
}

export interface SendEmailResponse {
  email: string;
  message: string;
}

export interface UpdateUserNameResponse {
  name: string;
  message: string;
}
