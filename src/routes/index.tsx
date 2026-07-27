import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { MAX_WORDS, saveStudySet, type StudySet } from "@/lib/study-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Notecraft — Turn notes into flashcards & quizzes" },
      {
        name: "description",
        content:
          "Paste your notes and instantly generate study flashcards and multiple-choice quizzes.",
      },
      { property: "og:title", content: "Notecraft — Turn notes into flashcards & quizzes" },
      {
        property: "og:description",
        content: "Paste your notes and instantly generate study flashcards and multiple-choice quizzes.",
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
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const trimmed = notes.trim();
  const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;
  const tooLong = wordCount > MAX_WORDS;

  const generate = async () => {
    setError(null);
    if (!trimmed) {
      setError("Paste some notes before generating.");
      return;
    }
    if (tooLong) {
      setError(`That's ${wordCount} words — trim to ${MAX_WORDS} or fewer.`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: trimmed }),
      });
      const data = (await res.json()) as StudySet & { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Generation failed.");
      saveStudySet({ flashcards: data.flashcards, quiz: data.quiz });
      toast.success(`Made ${data.flashcards.length} flashcards and a quiz.`);
      navigate({ to: "/flashcards" });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Something went wrong.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
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

      <div className="mt-3 flex items-center justify-between text-xs">
        <span className={tooLong ? "text-destructive" : "text-muted-foreground"}>
          {wordCount ? `${wordCount} / ${MAX_WORDS} words` : "No notes yet"}
        </span>
        <button
          type="button"
          onClick={() => setNotes(SAMPLE)}
          className="text-muted-foreground underline underline-offset-4 transition hover:text-foreground"
        >
          Use sample notes
        </button>
      </div>

      {error && (
        <p className="mt-3 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-foreground">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={generate}
        disabled={loading || !trimmed || tooLong}
        className="mt-6 w-full rounded-xl bg-primary px-5 py-4 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Generating…" : "Generate"}
      </button>
      {loading && (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Writing 10 flashcards and 15 questions…
        </p>
      )}

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
