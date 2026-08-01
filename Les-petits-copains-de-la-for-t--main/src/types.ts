/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Mission {
  id: number;
  num: number; // e.g. 1, 2, 3...
  typeFr: string; // e.g. "Lecture · les lettres"
  typeEn: string;
  consigneFr: string;
  consigneEn: string;
  bubbleFr: string;
  bubbleEn: string;
  character: "leo" | "nina" | "tom" | "zaza"; // which character speaks in the bubble
  exerciseType: "qcm" | "grid-find" | "matching" | "tracing-letter" | "drawing" | "input-text" | "order-numbers" | "symmetry" | "color-by-number";
  choices?: {
    id: string;
    textFr: string;
    textEn: string;
    isCorrect?: boolean;
  }[];
  // For matching type (e.g. relation line drawing)
  matches?: {
    leftFr: string;
    leftEn: string;
    rightFr: string;
    rightEn: string;
    rightIcon?: string; // symbol ID
    correctPairIndex: number;
  }[];
  // For grid-find type (e.g. circle target letters or objects)
  gridItems?: {
    id: string;
    text: string;
    isTarget: boolean;
  }[];
  // For other specialized types
  solutionFr?: string;
  solutionEn?: string;
  solFr?: string;
  solEn?: string;
  inputPlaceholderFr?: string;
  inputPlaceholderEn?: string;
  difficulty?: 1 | 2 | 3;
}

export interface Chapter {
  id: number; // 1, 2, 3, 4, 5
  titleFr: string;
  titleEn: string;
  coverSceneId: string; // references specific scene rendering structure
  storyFr: string[];
  storyEn: string[];
  storySceneId: string;
  missions: Mission[];
  badgeNameFr: string;
  badgeNameEn: string;
  badgeColor: string; // hex or css class
  badgeIconId: string; // references SVG symbol
  badgeDescFr: string;
  badgeDescEn: string;
}

export interface BookData {
  id: number; // 1 or 2
  titleFr: string;
  titleEn: string;
  descriptionFr?: string;
  descriptionEn?: string;
  themeEmojis?: string[];
  coverImageBase64?: string; // Optional cover art or we can render beautiful SVG Cover
  chapters: Chapter[];
}

export interface UserProgress {
  childName: string;
  completionDate: string;
  currentBookId: number; // 1 or 2
  currentLanguage: "fr" | "en";
  currentPage: number; // 1 to 40
  completedAnswers: Record<string, boolean | string | string[]>; // tracks solved state for each page's elements
  isPremium?: boolean;
  orderId?: string;
}
