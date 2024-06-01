import { memo } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

const programmingLanguages = {
  javascript: ".js",
  python: ".py",
  java: ".java",
  c: ".c",
  cpp: ".cpp",
  "c++": ".cpp",
  "c#": ".cs",
  ruby: ".rb",
  php: ".php",
  swift: ".swift",
  "objective-c": ".m",
  kotlin: ".kt",
  typescript: ".ts",
  go: ".go",
  perl: ".pl",
  rust: ".rs",
  scala: ".scala",
  haskell: ".hs",
  lua: ".lua",
  shell: ".sh",
  sql: ".sql",
  html: ".html",
  css: ".css",
  // add more file extensions here, make sure the key is same as language prop in CodeBlock.tsx component
};

const CodeBlock = memo(({ language, value }) => {
  return (
    <div className="max-w-[300px] sm:max-w-[430px] md:max-w-[450px] lg:max-w-[550px] xl:max-w-[650px] bg-zinc-950">
      <div className="flex w-full items-center justify-between bg-zinc-800 px-6 py-2 pr-4 text-white">
        <span className="text-xs lowercase">{language}</span>
      </div>
      <SyntaxHighlighter
        language={language}
        style={coldarkDark}
        PreTag="div"
        showLineNumbers
        customStyle={{
          background: "transparent",
          padding: "1.5rem 1rem",
          borderRadius: "0.5rem",
        }}
        codeTagProps={{
          style: {
            fontSize: "0.9rem",
          },
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
});
CodeBlock.displayName = "CodeBlock";

export { CodeBlock };
