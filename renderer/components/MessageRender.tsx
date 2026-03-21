import React from "react";
import { useTranslation } from "react-i18next";
interface Props {
  msgId: number;
  content: string;
  isStreaming: boolean;
}
export default function MessageRender(props: Props) {
  const { msgId, content, isStreaming } = props;
  const { t } = useTranslation();

  return (
    <div>
      {content.trim().length ? (
        content
      ) : (
        <span className="_cursor">{t("main.message.rendering")}</span>
      )}
    </div>
  );
}
