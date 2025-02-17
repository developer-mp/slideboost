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

export interface TemplateCarouselProps {
  templates: FileDetailProps[];
}

export interface ContentCardProps {
  tooltipText: string;
  iconName: React.ReactElement;
  fileName: string;
  onClickMethod: () => void;
}

export interface FileDetailProps {
  name: string;
  file_name?: string;
  type: string;
  size: number;
  folder?: string;
  template_category: string;
  file_id?: string;
  png_url: string;
  uploaded_at?: string;
  source?: string;
}

export interface FileWithMetadata {
  file: File;
  category: string | null;
}

export interface FileUploaderProps {
  onUpload: (files: FileWithMetadata[]) => void;
  showCategory: boolean;
  supportedExtensions: string[];
}

export interface FileUploaderRef {
  getFileDetails: () => FileWithMetadata[];
  uploadFiles: () => void;
}

export interface FileTableProps {
  columns: Array<{
    key: string;
    label: string;
    render: (file: FileDetailProps) => JSX.Element | string;
  }>;
  files: FileDetailProps[];
  removeFile: (id: string, name: string) => void;
  downloadFile: (id: string, name: string) => void;
}

export interface TemplateProps {
  file_id: string;
  title?: string;
  file_name: string;
  name: string;
  category?: string;
  template_category: string;
}

export interface TemplatesDisplayProps {
  templates: TemplateProps[];
  useCarousel?: boolean;
}

export interface SideBarProps {
  selectedItem: MenuItem | null;
  onItemClick: (item: MenuItem) => void;
}

interface Option {
  id: string;
  label: string;
}

export interface CustomDropdownProps {
  options: Option[];
  selectedOption: string;
  onOptionChange: (newOption: string) => void;
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
  files: FileWithMetadata[];
  showCategory?: boolean;
  onCategoryChange: (category: string, index: number) => void;
  setFiles?: React.Dispatch<React.SetStateAction<FileWithMetadata[]>>;
}

export interface MediaFileDisplayProps {
  mediaFiles: FileDetailProps[];
  selectedMediaFiles?: FileDetailProps[];
  onSelect?: (selectedFiles: FileDetailProps[]) => void;
  setMediaFiles?: (files: FileDetailProps[]) => void;
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

export interface TemplateCategory {
  id: string;
  category_name: string;
}

export interface DeactivationReason {
  id: string;
  reason: string;
}

export interface SupportedFiles {
  id: string;
  extension: string;
  type: string;
  category: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
}

export interface News {
  id: string;
  date: Date;
  text: string;
}

export interface DashboardProps {
  setSelectedItem: (item: MenuItem) => void;
}

export interface GoogleAuthProps {
  onLoginStart: () => void;
}
