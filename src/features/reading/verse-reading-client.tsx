"use client";

import { useEffect, useState, type ComponentType } from "react";
import type { VerseSelectorProps } from "@/features/reading/verse-selector";

function StaticVersePreview({ verses }: Pick<VerseSelectorProps, "verses">) {
  return (
    <div className="grid-gap">
      <div className="card-muted">
        <p className="muted" style={{ marginBottom: 0 }}>
          Pressione e segure um versículo para entrar no modo de seleção. Depois disso, toque para
          marcar ou desmarcar outros versículos. O envio pelo WhatsApp continua restrito ao admin.
        </p>
      </div>
      <div className="grid-gap">
        {verses.map((verse) => (
          <p key={verse.id} className="reading-text" style={{ margin: 0 }}>
            <strong>{verse.verseNumber}.</strong> {verse.text}
          </p>
        ))}
      </div>
    </div>
  );
}

export function VerseReadingClient(props: VerseSelectorProps) {
  const [Interactive, setInteractive] = useState<ComponentType<VerseSelectorProps> | null>(null);

  useEffect(() => {
    let cancelled = false;
    void import("@/features/reading/verse-selector").then((mod) => {
      if (!cancelled) {
        setInteractive(() => mod.VerseSelector);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (Interactive) {
    return <Interactive {...props} />;
  }

  return <StaticVersePreview verses={props.verses} />;
}
