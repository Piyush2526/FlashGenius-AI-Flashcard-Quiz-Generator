import type { Difficulty, Flashcard, QuizQuestion, StudySet } from "./study-data";

export const DIFFICULTY_KEYS: Difficulty[] = ["easy", "medium", "hard"];

export function buildPrompt(notes: string) {
  return `You are an expert educational content creator. Read the study notes below and generate learning material from them.

STUDY NOTES:
"""
${notes}
"""

Generate the following, based ONLY on the content in the notes above:

1. Exactly 10 flashcards (question + answer pairs) covering the most important concepts, facts, and definitions in the notes. Vary question types (definitions, "why" questions, comparisons, examples).

2. Exactly 15 multiple-choice questions split into three difficulty levels (5 easy, 5 medium, 5 hard):
   - Easy: direct recall of a fact or definition stated explicitly in the notes.
   - Medium: requires connecting two ideas from the notes or applying a concept.
   - Hard: requires inference, analysis, or distinguishing between closely related concepts from the notes.

Each MCQ must have exactly 4 options with exactly 1 correct answer, plausible distractors (not obviously wrong), and a one-sentence explanation of why the correct answer is right.

Respond with ONLY valid JSON matching the exact schema below. Do not include markdown formatting, code fences, or any text outside the JSON object.

{
  "flashcards": [ { "id": 1, "question": "...", "answer": "..." } ],
  "quiz": {
    "easy": [ { "id": "e1", "question": "...", "options": ["...","...","...","..."], "correctAnswer": "...", "explanation": "..." } ],
    "medium": [ 5 items with ids m1..m5 ],
    "hard": [ 5 items with ids h1..h5 ]
  }
}`;
}

// Models sometimes wrap JSON in prose or code fences — recover the object span.
export function parseLooseJson(text: string): unknown {
  const trimmed = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "");
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start === -1 || end <= start) throw new Error("No JSON object found in model response");
    return JSON.parse(trimmed.slice(start, end + 1));
  }
}

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeFlashcards(raw: unknown): Flashcard[] {
  const list = Array.isArray(raw) ? raw : [];
  const cards: Flashcard[] = [];
  for (const item of list) {
    const record = (item ?? {}) as Record<string, unknown>;
    const question = asString(record.question);
    const answer = asString(record.answer);
    if (!question || !answer) continue;
    cards.push({ id: cards.length + 1, question, answer });
    if (cards.length === 10) break;
  }
  if (!cards.length) throw new Error("Model returned no usable flashcards");
  return cards; // fewer than 10 is trimmed-not-crashed; UI handles any count
}

function normalizeQuestions(raw: unknown, difficulty: Difficulty): QuizQuestion[] {
  const list = Array.isArray(raw) ? raw : [];
  const questions: QuizQuestion[] = [];
  for (const item of list) {
    const record = (item ?? {}) as Record<string, unknown>;
    const question = asString(record.question);
    const options = (Array.isArray(record.options) ? record.options : [])
      .map(asString)
      .filter(Boolean)
      .slice(0, 4);
    const correctAnswer = asString(record.correctAnswer);
    if (!question || options.length !== 4) continue;
    // correctAnswer must actually be one of the four options.
    if (!options.includes(correctAnswer)) continue;
    questions.push({
      id: asString(record.id) || `${difficulty[0]}${questions.length + 1}`,
      question,
      options,
      correctAnswer,
      explanation: asString(record.explanation) || `The correct answer is "${correctAnswer}".`,
    });
    if (questions.length === 5) break;
  }
  return questions;
}

export function normalizeStudySet(raw: unknown): StudySet {
  const root = (raw ?? {}) as Record<string, unknown>;
  const quizRaw = (root.quiz ?? {}) as Record<string, unknown>;
  const quiz = {
    easy: normalizeQuestions(quizRaw.easy, "easy"),
    medium: normalizeQuestions(quizRaw.medium, "medium"),
    hard: normalizeQuestions(quizRaw.hard, "hard"),
  };
  if (!quiz.easy.length && !quiz.medium.length && !quiz.hard.length) {
    throw new Error("Model returned no valid quiz questions");
  }
  return { flashcards: normalizeFlashcards(root.flashcards), quiz };
}
