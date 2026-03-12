import logger from "./logger";

export const errorHandler = () => {
  window.onerror = (msg, url, line, col, error) => {
    logger.error("window onerror:", msg, url, line, col, error);
  };
  window.addEventListener("unhandledrejection", (event) => {
    logger.error("window unhandledrejection:", event);
  });
};
