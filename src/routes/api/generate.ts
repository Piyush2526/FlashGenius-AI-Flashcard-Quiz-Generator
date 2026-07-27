import { createFileRoute } from "@tanstack/react-router";
import { generateText } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { buildPrompt, normalizeStudySet, parseLooseJson } from "@/lib/generate.server";
import { MAX_WORDS } from "@/lib/study-data";

export const Route = createFileRoute("/api/generate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let notes = "";
        try {
          const body = (await request.json()) as { notes?: unknown };
          notes = typeof body.notes === "string" ? body.notes.trim() : "";
        } catch {
          return Response.json({ error: "Invalid request body." }, { status: 400 });
        }

        if (!notes) {
          return Response.json({ error: "Please paste some notes first." }, { status: 400 });
        }
        const wordCount = notes.split(/\s+/).length;
        if (wordCount > MAX_WORDS) {
          return Response.json(
            {
              error: `Your notes are ${wordCount} words — please trim to ${MAX_WORDS} words or fewer.`,
            },
            { status: 400 },
          );
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) {
          return Response.json({ error: "AI is not configured." }, { status: 500 });
        }

        try {
          const gateway = createLovableAiGatewayProvider(key);
          const { text } = await generateText({
            model: gateway("openai/gpt-5.5"),
            prompt: buildPrompt(notes),
          });
          const studySet = normalizeStudySet(parseLooseJson(text));
          return Response.json(studySet);
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          const status = /rate limit|429/i.test(message)
            ? 429
            : /credit|402/i.test(message)
              ? 402
              : 502;
          console.error("generate failed:", message);
          return Response.json(
            {
              error:
                status === 429
                  ? "Too many requests right now — try again in a moment."
                  : status === 402
                    ? "AI credits are exhausted. Add credits to keep generating."
                    : "We couldn't generate study material from those notes. Try again.",
            },
            { status },
          );
        }
      },
    },
  },
});
