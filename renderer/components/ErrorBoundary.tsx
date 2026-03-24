import { logger } from "@renderer/utils";
import React, { ErrorInfo } from "react";
import TitleBar from "./Layout/TitleBar";
import DragRegion from "./DragRegion";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  { hasError: boolean }
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error(
      "React Error Boundary caught an error:",
      error,
      errorInfo.componentStack,
      React.captureOwnerStack(),
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
          <TitleBar>
            <DragRegion className="h-full"></DragRegion>
          </TitleBar>
          <div>Something went wrong.</div>
        </>
      );
    }

    return this.props.children;
  }
}
