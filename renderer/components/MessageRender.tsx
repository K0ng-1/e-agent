import React from "react";
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

interface Props {
  msgId: number;
  content: string;
  isStreaming: boolean;
}
export default function MessageRender(props: Props) {
  const { msgId, content, isStreaming } = props;
  const { t } = useTranslation();

  return (
    <div className="prose dark:prose-invert prose-slate prose-pre:p-0 prose-headings:pt-3 text-inherit">
      {content.trim().length ? (
        <Markdown rehypePlugins={[rehypeHighlight, remarkGfm]}>
          {content}
        </Markdown>
      ) : (
        <span className="_cursor">{t("main.message.rendering")}</span>
      )}
    </div>
  );
}
