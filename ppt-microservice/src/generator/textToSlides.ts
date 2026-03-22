import { BuildPptxInput, PresentationModel, SlideModel } from "../types";

function normalizeWhitespace(value: string): string {
  return value
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function splitIntoSentences(input: string): string[] {
  const normalized = normalizeWhitespace(input);
  if (!normalized) {
    return [];
  }

  return normalized
    .split(/(?<=[.!?])\s+|\n+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitSentenceByWordLimit(
  sentence: string,
  maxWordsPerBullet: number,
): string[] {
  const words = sentence.split(/\s+/).filter(Boolean);
  if (words.length <= maxWordsPerBullet) {
    return [sentence.trim()];
  }

  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += maxWordsPerBullet) {
    chunks.push(words.slice(i, i + maxWordsPerBullet).join(" "));
  }

  return chunks;
}

function buildBulletList(text: string, maxWordsPerBullet: number): string[] {
  const sentences = splitIntoSentences(text);
  const bullets: string[] = [];

  for (const sentence of sentences) {
    const parts = splitSentenceByWordLimit(sentence, maxWordsPerBullet);
    for (const part of parts) {
      bullets.push(part);
    }
  }

  return bullets.filter(Boolean);
}

function groupBulletsBySlide(
  bullets: string[],
  maxBulletsPerSlide: number,
): SlideModel[] {
  if (bullets.length === 0) {
    return [
      {
        title: "Overview",
        bullets: ["No content was provided."],
      },
    ];
  }

  const slides: SlideModel[] = [];

  for (let i = 0; i < bullets.length; i += maxBulletsPerSlide) {
    const page = Math.floor(i / maxBulletsPerSlide) + 1;
    slides.push({
      title: page === 1 ? "Overview" : `Topic ${page}`,
      bullets: bullets.slice(i, i + maxBulletsPerSlide),
    });
  }

  return slides;
}

export function textToPresentationModel(
  input: BuildPptxInput,
): PresentationModel {
  const bullets = buildBulletList(input.bodyText, input.maxWordsPerBullet);
  const slides = groupBulletsBySlide(bullets, input.maxBulletsPerSlide);

  return {
    title: input.title,
    slides,
  };
}
