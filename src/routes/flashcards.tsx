import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { loadStudySet, sampleStudySet, type Flashcard } from "@/lib/study-data";

export const Route = createFileRoute("/flashcards")({
  head: () => ({
    meta: [
      { title: "Flashcards — Notecraft" },
      {
        name: "description",
        content: "Flip through study flashcards generated from your notes, one card at a time.",
      },
      { property: "og:title", content: "Flashcards — Notecraft" },
      {
        property: "og:description",
        content: "Tap a card to flip it and review key concepts from your notes.",
      },
    ],
  }),
  component: FlashcardsPage,
});

function FlashcardsPage() {
  const [cards, setCards] = useState<Flashcard[]>(sampleStudySet.flashcards);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setCards(loadStudySet().flashcards);
    setIndex(0);
    setFlipped(false);
  }, []);

  const card = cards[Math.min(index, cards.length - 1)];
  const progress = ((index + 1) / cards.length) * 100;

  const go = (delta: number) => {
    setFlipped(false);
    setIndex((i) => Math.min(cards.length - 1, Math.max(0, i + delta)));
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-5 pb-10 pt-10">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <Link to="/" className="transition hover:text-foreground">
          ← Notes
        </Link>
        <span>
          Card {index + 1} of {cards.length}
        </span>
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <h1 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Flashcards</h1>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className="mt-6 min-h-[320px] w-full [perspective:1200px]"
        aria-label="Flip card"
      >
        <div
          className={`relative h-[320px] w-full transition-transform duration-500 [transform-style:preserve-3d] ${
            flipped ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-6 text-center [backface-visibility:hidden]">
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Question
            </span>
            <p className="mt-4 text-xl font-medium leading-snug text-card-foreground">
              {card.question}
            </p>
            <span className="mt-6 text-xs text-muted-foreground">Tap to flip</span>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-border bg-secondary p-6 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Answer
            </span>
            <p className="mt-4 text-base leading-relaxed text-secondary-foreground">{card.answer}</p>
            <span className="mt-6 text-xs text-muted-foreground">Tap to flip back</span>
          </div>
        </div>
      </button>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={index === 0}
          className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-card-foreground transition hover:border-ring disabled:opacity-40"
        >
          Previous
        </button>
        {index === cards.length - 1 ? (
          <Link
            to="/quiz"
            className="flex-1 rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Start quiz
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => go(1)}
            className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Next
          </button>
        )}
      </div>
    </main>
  );
}
