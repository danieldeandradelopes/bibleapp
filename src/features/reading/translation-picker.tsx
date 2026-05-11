"use client";

import { useRef } from "react";

type TranslationOption = {
  code: string;
  name: string;
};

type TranslationPickerProps = {
  currentCode: string;
  redirectPath: string;
  translations: TranslationOption[];
  action: (formData: FormData) => Promise<void>;
};

export function TranslationPicker({
  currentCode,
  redirectPath,
  translations,
  action,
}: TranslationPickerProps) {
  const formRef = useRef<HTMLFormElement | null>(null);

  if (translations.length === 0) {
    return null;
  }

  return (
    <form ref={formRef} action={action} className="translation-picker">
      <input type="hidden" name="redirectPath" value={redirectPath} />
      <label className="translation-picker__label">
        <span className="muted">Versao</span>
        <select
          name="translationCode"
          defaultValue={currentCode}
          className="chip"
          onChange={() => formRef.current?.requestSubmit()}
        >
          {translations.map((translation) => (
            <option key={translation.code} value={translation.code}>
              {translation.name}
            </option>
          ))}
        </select>
      </label>
    </form>
  );
}
