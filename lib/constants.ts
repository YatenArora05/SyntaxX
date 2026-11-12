import type { Language } from "@/types";

export const LANGUAGES: { value: Language; label: string; monaco: string; short: string }[] = [
  { value: "javascript", label: "JavaScript", monaco: "javascript", short: "JS" },
  { value: "python", label: "Python 3", monaco: "python", short: "PY" },
  { value: "cpp", label: "C++ 20", monaco: "cpp", short: "C++" },
  { value: "java", label: "Java 21", monaco: "java", short: "JAVA" },
];

export const languageLabel = (l: Language) => LANGUAGES.find((x) => x.value === l)?.label ?? l;
export const languageShort = (l: Language) => LANGUAGES.find((x) => x.value === l)?.short ?? l;

export type EditorTheme = "devbattle" | "devbattle-contrast" | "devbattle-dim";

export const EDITOR_THEMES: { value: EditorTheme; label: string }[] = [
  { value: "devbattle", label: "Arena" },
  { value: "devbattle-contrast", label: "High contrast" },
  { value: "devbattle-dim", label: "Dim" },
];
