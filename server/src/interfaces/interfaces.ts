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
