import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Notecraft — Turn notes into flashcards & quizzes" },
      {
        name: "description",
        content:
          "Paste your notes and instantly generate study flashcards and multiple-choice quizzes.",
      },
      { property: "og:title", content: "Notecraft — Study smarter from your notes" },
      {
        property: "og:description",
        content: "Paste notes, generate flashcards and quizzes, and track your score.",
      },
    ],
  }),
  component: Index,
});

const SAMPLE = `Photosynthesis converts light energy into glucose inside chloroplasts.
Mitochondria produce ATP, the cell's energy currency.
Osmosis is the diffusion of water across a semi-permeable membrane.`;

function Index() {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const generate = () => {
    setLoading(true);
    setTimeout(() => navigate({ to: "/flashcards" }), 600);
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-5 pb-10 pt-14">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
        Notecraft
      </p>
      <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-foreground">
        Paste your notes.
        <br />
        Get flashcards &amp; a quiz.
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Drop in anything you're studying — lecture notes, a chapter summary, your own scribbles.
      </p>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Paste your notes here…"
        className="mt-6 min-h-[240px] w-full resize-y rounded-xl border border-border bg-card p-4 text-sm leading-relaxed text-card-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
      />

      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>{notes.trim() ? `${notes.trim().split(/\s+/).length} words` : "No notes yet"}</span>
        <button
          type="button"
          onClick={() => setNotes(SAMPLE)}
          className="underline underline-offset-4 transition hover:text-foreground"
        >
          Use sample notes
        </button>
      </div>

      <button
        type="button"
        onClick={generate}
        disabled={loading}
        className="mt-6 w-full rounded-xl bg-primary px-5 py-4 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Generating…" : "Generate"}
      </button>

      <div className="mt-6 flex gap-3 text-sm">
        <Link
          to="/flashcards"
          className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-center text-card-foreground transition hover:border-ring"
        >
          Flashcards
        </Link>
        <Link
          to="/quiz"
          className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-center text-card-foreground transition hover:border-ring"
        >
          Quiz
        </Link>
      </div>
    </main>
  );
}
