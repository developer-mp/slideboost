export interface DbQueryResultProps {
  rows: any[];
  rowCount: number | null;
}

export interface AuthorizeResponse {
  authorizationToken: string;
}

export interface UploadUrlResponse {
  uploadUrl: string;
  authorizationToken: string;
}

export interface UploadFileResponse {
  fileId: string;
  fileName: string;
}

export interface SlideText {
  id: number;
  statement: string;
}

export interface Slide {
  slide: number;
  header: string;
  text: SlideText[];
}

export interface Content {
  slides: Slide[];
}
