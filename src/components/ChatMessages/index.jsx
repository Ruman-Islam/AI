"use client";
import { BASE_URL } from "@/api/axios";

import useAddNote from "@/hooks/useAddNote";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import "katex/dist/katex.min.css";
import { memo } from "react";
import { FaFileAlt, FaRegCopy } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { CodeBlock } from "./Codeblock";

const MemoizedReactMarkdown = memo(
  ReactMarkdown,
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children &&
    prevProps.className === nextProps.className
);

const preprocessLaTeX = (content) => {
  const blockProcessedContent = content.replace(
    /\\\[(.*?)\\\]/gs,
    (_, equation) => `$$${equation}$$`
  );
  const inlineProcessedContent = blockProcessedContent.replace(
    /\\\((.*?)\\\)/gs,
    (_, equation) => `$${equation}$`
  );
  return inlineProcessedContent;
};

function Markdown({ content }) {
  const processedContent = preprocessLaTeX(content);
  return (
    <MemoizedReactMarkdown
      className="prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 break-words custom-markdown bg-white p-4 rounded-xl"
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        p({ children }) {
          return <p className="mb-2 last:mb-0">{children}</p>;
        },
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");

          if (inline) {
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }

          return (
            <CodeBlock
              key={Math.random()}
              language={(match && match[1]) || ""}
              value={String(children).replace(/\n$/, "")}
              {...props}
            />
          );
        },
      }}
    >
      {processedContent}
    </MemoizedReactMarkdown>
  );
}

function Annotations({ annotation }) {
  const nodes = annotation?.data?.nodes;

  return (
    <ul className="flex flex-col text-text__link">
      {nodes.map((node) => {
        const slicedFileName = node?.metadata?.file_name?.split("/");
        const fileName = slicedFileName[slicedFileName.length - 1];
        const filePath = node?.metadata?.file_path;

        return (
          <li
            key={node?.id}
            className="inline-block bg-white px-2 py-1.5 mb-1 text-brand__font__size__xs shadow w-full font-brand__font__500"
          >
            <a
              className="w-fit inline-block"
              target="_blank"
              href={`${BASE_URL}/files${filePath}`}
            >
              <small>{fileName}</small>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function ChatMessageContent({ m }) {
  return <Markdown content={m.content} />;
}

export default function ChatMessages({ messages }) {
  const { copyToClipboard } = useCopyToClipboard();
  const { addNote } = useAddNote();

  return (
    <div>
      {messages.map((m, i) => {
        const isUser = m?.role?.includes("user");
        const annotation = m?.annotations?.find((a) => a.type === "sources");

        return (
          <div
            key={i}
            className={`w-full flex mb-2 pt-3 ${
              isUser ? "justify-end" : "justify-start"
            }`}
          >
            <div className="max-w-[700px] text-brand__font__size__sm rounded-xl text-primary">
              <div className="group flex flex-col flex-1 justify-between gap-2">
                <Markdown content={m.content} />
                {annotation && <Annotations annotation={annotation} />}
                {!isUser ? (
                  <div className="px-2 flex items-center gap-x-4 text-brand__font__size__xs mt-1 font-brand__font__600 text-primary">
                    <button
                      onClick={() => copyToClipboard(m.content)}
                      className="flex items-center justify-between gap-x-1 hover:text-text__link duration-200"
                    >
                      <FaRegCopy size={10} />
                      <small>Copy</small>
                    </button>
                    <button
                      onClick={() => addNote(m.content)}
                      className="flex items-center justify-between gap-x-1 hover:text-text__link duration-200"
                    >
                      <FaFileAlt size={10} />
                      <small>Note</small>
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
