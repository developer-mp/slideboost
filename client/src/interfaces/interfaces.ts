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
  id: string;
  name: string;
  type: string;
  size: number;
  date: string;
  content: string | ArrayBuffer | null;
  thumbnail?: string;
  title?: string;
  category?: string;
  path: string;
}

export interface FileUploaderProps {
  onUpload: (files: FileDetailProps[]) => void;
}

export interface FileUploaderRef {
  getFileDetails: () => FileDetailProps[];
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
  onAction?: () => void;
}

export interface VerificationCodeInputProps {
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
}

export interface LoginModalProps {
  show: boolean;
  handleClose: () => void;
  onGoogleClick: () => void;
  onEmailClick: () => void;
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
  flag: "isRegister" | "isReset";
}
