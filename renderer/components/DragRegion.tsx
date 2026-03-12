interface DragRegionProps {
  className?: string;
  children?: React.ReactNode;
}
export default function DragRegion({ className, children }: DragRegionProps) {
  return <div className={clsx("drag-region", className)}>{children}</div>;
}
