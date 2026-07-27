export type Flashcard = { front: string; back: string };
export type QuizQuestion = {
  question: string;
  options: string[];
  answerIndex: number;
};

export const flashcards: Flashcard[] = [
  { front: "What is photosynthesis?", back: "The process plants use to convert light energy into chemical energy (glucose)." },
  { front: "Mitochondria function", back: "Powerhouse of the cell — produces ATP through cellular respiration." },
  { front: "Define osmosis", back: "Diffusion of water across a semi-permeable membrane toward higher solute concentration." },
  { front: "What is DNA?", back: "Deoxyribonucleic acid — the molecule carrying genetic instructions." },
  { front: "Enzyme", back: "A protein catalyst that speeds up biochemical reactions without being consumed." },
  { front: "Homeostasis", back: "Maintenance of a stable internal environment despite external changes." },
  { front: "Ribosome role", back: "Site of protein synthesis, translating mRNA into polypeptide chains." },
  { front: "Diffusion", back: "Net movement of particles from high to low concentration." },
  { front: "Cell membrane", back: "A phospholipid bilayer controlling what enters and leaves the cell." },
  { front: "ATP", back: "Adenosine triphosphate — the main energy currency of the cell." },
];

export const quizQuestions: QuizQuestion[] = [
  {
    question: "Where does photosynthesis mainly take place?",
    options: ["Mitochondria", "Chloroplast", "Nucleus", "Ribosome"],
    answerIndex: 1,
  },
  {
    question: "Which molecule carries genetic information?",
    options: ["ATP", "Lipid", "DNA", "Glucose"],
    answerIndex: 2,
  },
  {
    question: "What do enzymes do?",
    options: ["Store energy", "Catalyze reactions", "Carry oxygen", "Build membranes"],
    answerIndex: 1,
  },
  {
    question: "Osmosis moves which substance?",
    options: ["Water", "Oxygen", "Protein", "Salt crystals"],
    answerIndex: 0,
  },
  {
    question: "ATP is produced primarily in the…",
    options: ["Golgi body", "Cell wall", "Mitochondria", "Vacuole"],
    answerIndex: 2,
  },
];
