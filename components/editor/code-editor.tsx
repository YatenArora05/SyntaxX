"use client";

import { useEffect, useRef } from "react";
import Editor, { loader, type Monaco, type OnMount } from "@monaco-editor/react";
import { EditorSkeleton } from "./editor-skeleton";

// Monaco is served from our own origin (copied into /public by scripts/copy-monaco.mjs).
loader.config({ paths: { vs: "/monaco/vs" } });

import type { EditorTheme } from "@/lib/constants";

let themesDefined = false;
function defineThemes(monaco: Monaco) {
  if (themesDefined) return;
  themesDefined = true;
  const rules = (kw: string, str: string, num: string, com: string, fg: string) => [
    { token: "", foreground: fg },
    { token: "keyword", foreground: kw },
    { token: "keyword.control", foreground: kw },
    { token: "type", foreground: "FFFFFF" },
    { token: "string", foreground: str },
    { token: "number", foreground: num },
    { token: "comment", foreground: com, fontStyle: "italic" },
    { token: "delimiter", foreground: "A1A1AA" },
    { token: "identifier", foreground: fg },
  ];
  monaco.editor.defineTheme("devbattle", {
    base: "vs-dark",
    inherit: true,
    rules: rules("B7F700", "A1A1AA", "D0FF33", "6E6E76", "E8E8EA"),
    colors: {
      "editor.background": "#080A08",
      "editor.foreground": "#E8E8EA",
      "editor.lineHighlightBackground": "#FFFFFF08",
      "editor.lineHighlightBorder": "#00000000",
      "editorLineNumber.foreground": "#FFFFFF2E",
      "editorLineNumber.activeForeground": "#B7F700",
      "editorCursor.foreground": "#B7F700",
      "editor.selectionBackground": "#B7F70033",
      "editor.inactiveSelectionBackground": "#B7F7001A",
      "editorIndentGuide.background1": "#FFFFFF0D",
      "editorIndentGuide.activeBackground1": "#FFFFFF26",
      "editorBracketMatch.background": "#B7F7001F",
      "editorBracketMatch.border": "#B7F70066",
      "editorWidget.background": "#151915",
      "editorWidget.border": "#FFFFFF24",
      "editorSuggestWidget.background": "#151915",
      "editorSuggestWidget.selectedBackground": "#B7F70026",
      "scrollbarSlider.background": "#FFFFFF14",
      "scrollbarSlider.hoverBackground": "#FFFFFF24",
      "editorGutter.background": "#080A08",
      "editorBracketHighlight.foreground1": "#C9C9CE",
      "editorBracketHighlight.foreground2": "#C9C9CE",
      "editorBracketHighlight.foreground3": "#C9C9CE",
      "editorBracketHighlight.unexpectedBracket.foreground": "#A1A1AA",
    },
  });
  monaco.editor.defineTheme("devbattle-contrast", {
    base: "hc-black",
    inherit: true,
    rules: rules("D0FF33", "FFFFFF", "D0FF33", "A1A1AA", "FFFFFF"),
    colors: {
      "editor.background": "#000000",
      "editorCursor.foreground": "#D0FF33",
      "editorLineNumber.activeForeground": "#D0FF33",
      "contrastBorder": "#FFFFFF33",
      "contrastActiveBorder": "#B7F700",
    },
  });
  monaco.editor.defineTheme("devbattle-dim", {
    base: "vs-dark",
    inherit: true,
    rules: rules("C8E86B", "9A9AA2", "C8E86B", "5E5E66", "CFCFD4"),
    colors: {
      "editor.background": "#101310",
      "editor.lineHighlightBackground": "#FFFFFF06",
      "editorLineNumber.foreground": "#FFFFFF26",
      "editorCursor.foreground": "#B7F700",
      "editor.selectionBackground": "#FFFFFF1F",
    },
  });
}

export function CodeEditor({
  value,
  onChange,
  language,
  readOnly,
  theme = "devbattle",
  onRun,
  onSubmit,
  followTail,
  ariaLabel,
}: {
  value: string;
  onChange?: (v: string) => void;
  language: string;
  readOnly?: boolean;
  theme?: EditorTheme;
  onRun?: () => void;
  onSubmit?: () => void;
  /** keep the last line in view (used for the opponent's live editor) */
  followTail?: boolean;
  ariaLabel?: string;
}) {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const runRef = useRef(onRun);
  const submitRef = useRef(onSubmit);
  useEffect(() => {
    runRef.current = onRun;
    submitRef.current = onSubmit;
  }, [onRun, onSubmit]);

  useEffect(() => {
    if (!followTail || !editorRef.current) return;
    const ed = editorRef.current;
    const lines = ed.getModel()?.getLineCount() ?? 1;
    ed.revealLineInCenterIfOutsideViewport(lines);
    ed.setPosition({ lineNumber: lines, column: (ed.getModel()?.getLineMaxColumn(lines) ?? 1) });
  }, [value, followTail]);

  return (
    <Editor
      value={value}
      language={language}
      theme={theme}
      beforeMount={defineThemes}
      onMount={(editor, monaco) => {
        editorRef.current = editor;
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => runRef.current?.());
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter, () => submitRef.current?.());
        if (!readOnly) editor.focus();
        // web fonts may finish loading after Monaco measures glyphs
        document.fonts?.ready.then(() => monaco.editor.remeasureFonts());
      }}
      onChange={(v) => onChange?.(v ?? "")}
      loading={
        <EditorSkeleton />
      }
      options={{
        readOnly,
        domReadOnly: readOnly,
        ariaLabel,
        fontFamily: '"JetBrains Mono Variable", ui-monospace, monospace',
        fontLigatures: true,
        fontSize: 13.5,
        lineHeight: 22,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        smoothScrolling: true,
        cursorBlinking: "phase",
        cursorSmoothCaretAnimation: "on",
        renderLineHighlight: readOnly ? "none" : "all",
        padding: { top: 14, bottom: 14 },
        tabSize: 2,
        wordWrap: "on",
        automaticLayout: true,
        bracketPairColorization: { enabled: false },
        guides: { indentation: true },
        overviewRulerLanes: 0,
        hideCursorInOverviewRuler: true,
        scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
        fixedOverflowWidgets: true,
      }}
    />
  );
}

