import { Tooltip, TooltipProps } from "@heroui/tooltip";

export default function TooltipTheme(props: TooltipProps) {
  return (
    <Tooltip
      classNames={{
        content: ["text-tx-secondary bg-input"],
      }}
      {...props}
    >
      {props.children}
    </Tooltip>
  );
}
