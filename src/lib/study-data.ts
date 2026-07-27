export type Flashcard = { id: number; question: string; answer: string };

export type Difficulty = "easy" | "medium" | "hard";

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

export type StudySet = {
  flashcards: Flashcard[];
  quiz: Record<Difficulty, QuizQuestion[]>;
};

export const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];

export const MAX_WORDS = 4000;

const STORAGE_KEY = "notecraft:study-set";

export const sampleStudySet: StudySet = {
  flashcards: [
    { id: 1, question: "What is photosynthesis?", answer: "The process plants use to convert light energy into chemical energy (glucose)." },
    { id: 2, question: "What do mitochondria do?", answer: "They produce ATP through cellular respiration — the cell's powerhouse." },
    { id: 3, question: "Define osmosis.", answer: "Diffusion of water across a semi-permeable membrane toward higher solute concentration." },
    { id: 4, question: "What is DNA?", answer: "Deoxyribonucleic acid — the molecule carrying genetic instructions." },
    { id: 5, question: "What is an enzyme?", answer: "A protein catalyst that speeds up biochemical reactions without being consumed." },
    { id: 6, question: "What is homeostasis?", answer: "Maintenance of a stable internal environment despite external changes." },
    { id: 7, question: "What is the role of the ribosome?", answer: "Site of protein synthesis, translating mRNA into polypeptide chains." },
    { id: 8, question: "What is diffusion?", answer: "Net movement of particles from high to low concentration." },
    { id: 9, question: "What is the cell membrane made of?", answer: "A phospholipid bilayer controlling what enters and leaves the cell." },
    { id: 10, question: "What is ATP?", answer: "Adenosine triphosphate — the main energy currency of the cell." },
  ],
  quiz: {
    easy: [
      { id: "e1", question: "Where does photosynthesis mainly take place?", options: ["Mitochondria", "Chloroplast", "Nucleus", "Ribosome"], correctAnswer: "Chloroplast", explanation: "Chloroplasts contain chlorophyll, which captures light energy." },
      { id: "e2", question: "Which molecule carries genetic information?", options: ["ATP", "Lipid", "DNA", "Glucose"], correctAnswer: "DNA", explanation: "DNA stores the genetic instructions for the cell." },
      { id: "e3", question: "What do enzymes do?", options: ["Store energy", "Catalyze reactions", "Carry oxygen", "Build membranes"], correctAnswer: "Catalyze reactions", explanation: "Enzymes lower activation energy to speed reactions." },
      { id: "e4", question: "Osmosis moves which substance?", options: ["Water", "Oxygen", "Protein", "Salt crystals"], correctAnswer: "Water", explanation: "Osmosis is specifically the diffusion of water." },
      { id: "e5", question: "ATP is produced primarily in the…", options: ["Golgi body", "Cell wall", "Mitochondria", "Vacuole"], correctAnswer: "Mitochondria", explanation: "Mitochondria carry out cellular respiration to make ATP." },
    ],
    medium: [
      { id: "m1", question: "Why can't animal cells photosynthesise?", options: ["No chloroplasts", "No mitochondria", "No ribosomes", "No nucleus"], correctAnswer: "No chloroplasts", explanation: "Photosynthesis requires chloroplasts, which animal cells lack." },
      { id: "m2", question: "A cell in pure water will…", options: ["Shrink", "Take in water", "Lose ATP", "Stop respiring"], correctAnswer: "Take in water", explanation: "Water moves toward the higher solute concentration inside the cell." },
      { id: "m3", question: "Enzyme activity drops at high temperature because…", options: ["Substrate vanishes", "Enzymes denature", "ATP is used up", "Diffusion stops"], correctAnswer: "Enzymes denature", explanation: "Heat disrupts the enzyme's active-site shape." },
      { id: "m4", question: "Which pair are both energy-related?", options: ["ATP & mitochondria", "DNA & osmosis", "Ribosome & water", "Membrane & glucose"], correctAnswer: "ATP & mitochondria", explanation: "Mitochondria produce ATP, the cell's energy currency." },
      { id: "m5", question: "Protein synthesis depends most directly on…", options: ["Ribosomes reading mRNA", "Osmosis", "Chloroplasts", "Cell walls"], correctAnswer: "Ribosomes reading mRNA", explanation: "Ribosomes translate mRNA into polypeptides." },
    ],
    hard: [
      { id: "h1", question: "Diffusion differs from osmosis mainly because osmosis…", options: ["Needs energy", "Only moves water", "Moves against gradients", "Requires enzymes"], correctAnswer: "Only moves water", explanation: "Osmosis is water-specific diffusion across a membrane." },
      { id: "h2", question: "Blocking ATP synthesis would most immediately impair…", options: ["Active transport", "Simple diffusion", "Osmosis", "Gravity settling"], correctAnswer: "Active transport", explanation: "Active transport is the process that consumes ATP." },
      { id: "h3", question: "Homeostasis failure is best shown by…", options: ["Stable body temperature", "Uncontrolled internal pH swings", "Steady glucose levels", "Constant water balance"], correctAnswer: "Uncontrolled internal pH swings", explanation: "Homeostasis means keeping internal conditions stable." },
      { id: "h4", question: "A mutation in DNA affects proteins because DNA…", options: ["Is a protein", "Encodes mRNA sequences", "Catalyses reactions", "Stores ATP"], correctAnswer: "Encodes mRNA sequences", explanation: "DNA sequence determines mRNA, which determines the protein." },
      { id: "h5", question: "Which best distinguishes enzymes from ATP?", options: ["Enzymes are reused; ATP is consumed", "Both are consumed", "Enzymes store energy", "ATP is a catalyst"], correctAnswer: "Enzymes are reused; ATP is consumed", explanation: "Catalysts are not used up, while ATP is spent as energy." },
    ],
  },
};

export function saveStudySet(set: StudySet) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(set));
  } catch {
    /* storage unavailable — fall back to sample data */
  }
}

export function loadStudySet(): StudySet {
  if (typeof window === "undefined") return sampleStudySet;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return sampleStudySet;
    const parsed = JSON.parse(raw) as StudySet;
    if (!parsed?.flashcards?.length || !parsed?.quiz?.easy?.length) return sampleStudySet;
    return parsed;
  } catch {
    return sampleStudySet;
  }
}

export function allQuizQuestions(set: StudySet) {
  return DIFFICULTIES.flatMap((difficulty) =>
    (set.quiz[difficulty] ?? []).map((q) => ({ ...q, difficulty })),
  );
}
