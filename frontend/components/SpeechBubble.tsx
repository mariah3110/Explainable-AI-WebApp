// SpeechBubble.tsx
// Sprechblase des Begleiter-Charakters.
// Akzeptiert eine einzelne Nachricht oder ein Array — bei mehreren
// erscheinen kleine Pfeile zum Durchklicken.

"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type SpeechBubbleProps = {
  /** Eine einzelne Nachricht oder ein Array zum Durchblättern. */
  text: React.ReactNode | React.ReactNode[];
  /** Seite, auf der die Sprechblasen-Spitze sitzt (zeigt zum Charakter). */
  tail: "left" | "right";
  className?: string;
};

export default function SpeechBubble({
  text,
  tail,
  className = "",
}: SpeechBubbleProps) {
  const messages = Array.isArray(text) ? text : [text];
  const hasMultiple = messages.length > 1;

  const [page, setPage] = useState(0);

  // Wenn sich die Nachrichten ändern (z.B. Plot-Wechsel), zurück auf Seite 0
  useEffect(() => {
    setPage(0);
  }, [text]);

  const prev = () => setPage((p) => Math.max(0, p - 1));
  const next = () => setPage((p) => Math.min(messages.length - 1, p + 1));

  return (
    <div
      className={`relative rounded-md bg-gray-200 px-3 py-2 text-black shadow-xl ${className}`}
    >
      {/* Nachricht */}
      <div className={hasMultiple ? "mb-2" : ""}>{messages[page]}</div>

      {/* Navigation — nur bei mehreren Nachrichten */}
      {hasMultiple && (
        <div className="flex items-center justify-between border-t border-gray-300 pt-1.5">
          <button
            type="button"
            onClick={prev}
            disabled={page === 0}
            aria-label="Vorherige Nachricht"
            className="rounded p-0.5 text-gray-500 transition hover:text-black disabled:opacity-30"
          >
            <ChevronLeft size={14} />
          </button>

          <span className="text-[10px] tabular-nums text-gray-400">
            {page + 1} / {messages.length}
          </span>

          <button
            type="button"
            onClick={next}
            disabled={page === messages.length - 1}
            aria-label="Nächste Nachricht"
            className="rounded p-0.5 text-gray-500 transition hover:text-black disabled:opacity-30"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* Sprechblasen-Spitze */}
      <span
        aria-hidden="true"
        className={`absolute top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 bg-gray-200 ${
          tail === "left" ? "-left-1" : "-right-1"
        }`}
      />
    </div>
  );
}