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

export interface LoginResponseProps {
  token: string;
  name: string;
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
