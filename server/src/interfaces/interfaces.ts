export interface DbQueryResult {
  rows: any[];
  rowCount: number | null;
}

export interface TranscriptQueryParams {
  videoId?: string;
}

export interface ApiRequestData {
  contents: ApiContent[];
}

export interface ApiContent {
  parts: ApiPart[];
}

export interface ApiPart {
  text: string;
}
