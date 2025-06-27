export const customLogger = {
  logCustomMessage: (message: string, logLevel: "info" | "debug" = "info") => {
    if (logLevel === "info" || logLevel === "debug") {
      console.log(message);
    }
  },
};
