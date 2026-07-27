import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { quizQuestions } from "@/lib/study-data";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Quiz — Notecraft" },
      {
        name: "description",
        content:
          "Test yourself with multiple-choice questions, get instant feedback, and see your final score.",
      },
      { property: "og:title", content: "Quiz — Notecraft" },
      {
        property: "og:description",
        content: "Instant right/wrong feedback on every question, plus a score summary at the end.",
      },
    ],
  }),
  component: QuizPage,
});

function QuizPage() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = quizQuestions[index];
  const progress = ((index + (selected !== null ? 1 : 0)) / quizQuestions.length) * 100;

  const restart = () => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  const choose = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.answerIndex) setScore((s) => s + 1);
  };

  const next = () => {
    if (index === quizQuestions.length - 1) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  };

  if (finished) {
    const pct = Math.round((score / quizQuestions.length) * 100);
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center px-5 text-center">
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Your score</span>
        <p className="mt-4 text-6xl font-semibold tracking-tight text-foreground">
          {score}
          <span className="text-2xl text-muted-foreground">/{quizQuestions.length}</span>
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          {pct >= 80 ? "Excellent recall." : pct >= 50 ? "Solid — review and retry." : "Worth another pass through the cards."}
        </p>
        <div className="mt-8 flex w-full gap-3">
          <button
            type="button"
            onClick={restart}
            className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-card-foreground transition hover:border-ring"
          >
            Retry quiz
          </button>
          <Link
            to="/"
            className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            New notes
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-5 pb-10 pt-10">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <Link to="/flashcards" className="transition hover:text-foreground">
          ← Flashcards
        </Link>
        <span>
          Question {index + 1} of {quizQuestions.length}
        </span>
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <h1 className="mt-8 text-xl font-semibold leading-snug tracking-tight text-foreground">
        {q.question}
      </h1>

      <div className="mt-6 flex flex-col gap-3">
        {q.options.map((opt, i) => {
          const isAnswer = i === q.answerIndex;
          const isPicked = selected === i;
          let cls = "border-border bg-card text-card-foreground";
          if (selected !== null && isAnswer) cls = "border-primary bg-primary/15 text-foreground";
          else if (isPicked) cls = "border-destructive bg-destructive/15 text-foreground";
          else if (selected !== null) cls = "border-border bg-card text-muted-foreground";

          return (
            <button
              key={opt}
              type="button"
              onClick={() => choose(i)}
              className={`flex items-center justify-between rounded-xl border px-4 py-4 text-left text-sm transition ${cls}`}
            >
              <span>{opt}</span>
              {selected !== null && isAnswer && <span className="text-xs font-semibold">Correct</span>}
              {selected !== null && isPicked && !isAnswer && (
                <span className="text-xs font-semibold">Incorrect</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-8">
        <button
          type="button"
          onClick={next}
          disabled={selected === null}
          className="w-full rounded-xl bg-primary px-5 py-4 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-40"
        >
          {index === quizQuestions.length - 1 ? "See score" : "Next question"}
        </button>
      </div>
    </main>
  );
}
