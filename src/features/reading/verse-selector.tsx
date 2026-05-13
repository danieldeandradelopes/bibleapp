"use client";

import { useMemo, useRef, useState } from "react";
import { updateVerseSelectionAction } from "@/features/highlights/actions";

export type Verse = {
  id: number;
  verseNumber: number;
  text: string;
};

export type VerseSelectorProps = {
  bookName: string;
  chapterNumber: number;
  redirectPath: string;
  verses: Verse[];
  canShare: boolean;
  isAuthenticated: boolean;
  highlightedVerseIds: number[];
  favoriteVerseIds: number[];
};

function formatVerseNumbers(verseNumbers: number[]): string {
  if (verseNumbers.length === 0) return "";

  const sorted = [...verseNumbers].sort((a, b) => a - b);
  const first = sorted[0];
  if (typeof first !== "number") return "";

  const ranges: string[] = [];
  let rangeStart = first;
  let previous = first;

  for (let index = 1; index < sorted.length; index += 1) {
    const current = sorted[index];
    if (typeof current !== "number") continue;

    if (current === previous + 1) {
      previous = current;
      continue;
    }

    ranges.push(rangeStart === previous ? `${rangeStart}` : `${rangeStart}-${previous}`);
    rangeStart = current;
    previous = current;
  }

  ranges.push(rangeStart === previous ? `${rangeStart}` : `${rangeStart}-${previous}`);

  return ranges.join(", ");
}

export function VerseSelector({
  bookName,
  chapterNumber,
  redirectPath,
  verses,
  canShare,
  isAuthenticated,
  highlightedVerseIds,
  favoriteVerseIds,
}: VerseSelectorProps) {
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);
  const pressTimerRef = useRef<number | null>(null);
  const longPressVerseIdRef = useRef<number | null>(null);

  const selectedVerses = useMemo(
    () => verses.filter((verse) => selectedIds.includes(verse.id)),
    [selectedIds, verses],
  );
  const highlightedVerseIdSet = useMemo(() => new Set(highlightedVerseIds), [highlightedVerseIds]);
  const favoriteVerseIdSet = useMemo(() => new Set(favoriteVerseIds), [favoriteVerseIds]);

  const selectedReference = useMemo(() => {
    if (selectedVerses.length === 0) return "";

    return `${bookName} ${chapterNumber}:${formatVerseNumbers(
      selectedVerses.map((verse) => verse.verseNumber),
    )}`;
  }, [bookName, chapterNumber, selectedVerses]);

  const selectionText = useMemo(() => {
    if (selectedVerses.length === 0) return "";

    const versesText = selectedVerses
      .map((verse) => `${verse.verseNumber}. ${verse.text}`)
      .join("\n");

    return `${selectedReference}\n\n${versesText}`;
  }, [selectedReference, selectedVerses]);

  const whatsappHref = selectionText
    ? `https://wa.me/?text=${encodeURIComponent(selectionText)}`
    : "#";
  const serializedSelectedIds = selectedIds.join(",");
  const allSelectedHighlighted =
    selectedVerses.length > 0 && selectedVerses.every((verse) => highlightedVerseIdSet.has(verse.id));
  const allSelectedFavorite =
    selectedVerses.length > 0 && selectedVerses.every((verse) => favoriteVerseIdSet.has(verse.id));

  function toggleSelection(verseId: number): void {
    setCopied(false);
    setSelectedIds((current) =>
      current.includes(verseId) ? current.filter((id) => id !== verseId) : [...current, verseId],
    );
  }

  function startSelection(verseId?: number): void {
    setSelectionMode(true);
    if (verseId) {
      setSelectedIds((current) => (current.includes(verseId) ? current : [...current, verseId]));
    }
  }

  function clearSelection(): void {
    setSelectionMode(false);
    setSelectedIds([]);
    setCopied(false);
  }

  function clearPressTimer(): void {
    if (pressTimerRef.current) {
      window.clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  }

  function handlePointerDown(verseId: number): void {
    clearPressTimer();
    pressTimerRef.current = window.setTimeout(() => {
      longPressVerseIdRef.current = verseId;
      startSelection(verseId);
    }, 380);
  }

  function handlePointerEnd(): void {
    clearPressTimer();
  }

  function handleVerseClick(verseId: number): void {
    if (longPressVerseIdRef.current === verseId) {
      longPressVerseIdRef.current = null;
      return;
    }

    if (selectionMode) {
      toggleSelection(verseId);
    }
  }

  async function copySelection(): Promise<void> {
    if (!selectionText) return;
    await navigator.clipboard.writeText(selectionText);
    setCopied(true);
  }

  return (
    <div className="grid-gap">
      <div className="card-muted">
        <p className="muted" style={{ marginBottom: 0 }}>
          Pressione e segure um versículo para entrar no modo de seleção. Depois disso, toque para
          marcar ou desmarcar outros versículos. O envio pelo WhatsApp continua restrito ao admin.
        </p>
      </div>

      <div className="grid-gap">
        {verses.map((verse) => {
          const checked = selectedIds.includes(verse.id);
          const isHighlighted = highlightedVerseIdSet.has(verse.id);
          const isFavorite = favoriteVerseIdSet.has(verse.id);
          return (
            <button
              key={verse.id}
              className="verse-item"
              data-selected={checked}
              data-highlighted={isHighlighted}
              data-favorite={isFavorite}
              data-selection-mode={selectionMode}
              type="button"
              onPointerDown={() => handlePointerDown(verse.id)}
              onPointerUp={handlePointerEnd}
              onPointerLeave={handlePointerEnd}
              onPointerCancel={handlePointerEnd}
              onClick={() => handleVerseClick(verse.id)}
              aria-pressed={selectionMode ? checked : undefined}
              aria-label={
                selectionMode
                  ? `${checked ? "Desmarcar" : "Selecionar"} versículo ${verse.verseNumber}`
                  : `Versículo ${verse.verseNumber}`
              }
            >
              <p className="reading-text verse-item__text">
                <strong>{verse.verseNumber}.</strong> {verse.text}
              </p>
              {(isHighlighted || isFavorite) && (
                <div className="verse-item__meta" aria-hidden="true">
                  {isHighlighted && <span className="chip chip-soft">Destacado</span>}
                  {isFavorite && <span className="chip chip-accent">Favorito</span>}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selectedVerses.length > 0 && (
        <>
          <div className="card" style={{ display: "grid", gap: "0.75rem" }}>
            <strong>{selectedVerses.length} versículo(s) selecionado(s)</strong>
            <span className="chip chip-accent" style={{ width: "fit-content" }}>
              {selectedReference}
            </span>
            <pre
              style={{
                margin: 0,
                whiteSpace: "pre-wrap",
                fontFamily: "inherit",
              }}
            >
              {selectionText}
            </pre>
          </div>

          <div className="selection-bar" role="region" aria-label="Ações da seleção">
            <div className="selection-bar__content">
              <div className="selection-bar__summary">
                <strong>{selectedVerses.length} selecionado(s)</strong>
                <span className="selection-bar__reference">{selectedReference}</span>
              </div>
              <div className="selection-bar__actions">
                <button className="button-secondary" type="button" onClick={copySelection}>
                  {copied ? "Copiado" : `Copiar ${selectedReference}`}
                </button>
                {isAuthenticated ? (
                  <>
                    <form action={updateVerseSelectionAction}>
                      <input type="hidden" name="redirectPath" value={redirectPath} />
                      <input type="hidden" name="verseIds" value={serializedSelectedIds} />
                      <input type="hidden" name="intent" value="highlight" />
                      <input type="hidden" name="activate" value={allSelectedHighlighted ? "false" : "true"} />
                      <button className="button-secondary" type="submit">
                        {allSelectedHighlighted ? "Remover destaque" : "Destacar"}
                      </button>
                    </form>
                    <form action={updateVerseSelectionAction}>
                      <input type="hidden" name="redirectPath" value={redirectPath} />
                      <input type="hidden" name="verseIds" value={serializedSelectedIds} />
                      <input type="hidden" name="intent" value="favorite" />
                      <input type="hidden" name="activate" value={allSelectedFavorite ? "false" : "true"} />
                      <button className="button-secondary" type="submit">
                        {allSelectedFavorite ? "Remover favorito" : "Favoritar"}
                      </button>
                    </form>
                  </>
                ) : (
                  <span className="muted">Faça login para salvar destaques e favoritos</span>
                )}
                {canShare ? (
                  <a className="button-primary" href={whatsappHref} target="_blank" rel="noreferrer">
                    Compartilhar
                  </a>
                ) : (
                  <span className="muted">WhatsApp só para admin</span>
                )}
                <button className="button-danger" type="button" onClick={clearSelection}>
                  Limpar
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
