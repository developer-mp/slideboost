export interface SlideModel {
  title: string;
  bullets: string[];
}

export interface PresentationModel {
  title: string;
  slides: SlideModel[];
}

export interface BuildPptxInput {
  title: string;
  bodyText: string;
  maxBulletsPerSlide: number;
  maxWordsPerBullet: number;
}

export interface BuildPptxResult {
  fileBuffer: Buffer;
  slideCount: number;
}
