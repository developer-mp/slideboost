export interface FormData {
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

export interface LoginResponse {
  token: string;
  name: string;
}

export interface PPTTemplate {
  id: string;
  imgPath: string;
  title: string;
  category: string;
}

export interface TemplateCarouselProps {
  templates: PPTTemplate[];
}

export interface ContentCardProps {
  tooltipText: string;
  iconName: React.ReactElement;
  fileName: string;
  onClickMethod: () => void;
}

export interface FileUploaderProps {
  onUpload: (
    files: {
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
    }[]
  ) => void;
}

export interface FileUploaderRef {
  getFileDetails: () => {
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
  }[];
}

export interface FileDetail {
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

export interface Template {
  id: string;
  thumbnail?: string;
  title?: string;
  category?: string;
}

export interface TemplatesDisplayProps {
  templates: Template[];
  useCarousel?: boolean;
}
