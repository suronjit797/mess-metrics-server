import mongoose from "mongoose";
import { Server } from "http";

import config from "./config";
import app from "./app";
let server: Server;

process.on("uncaughtException", (error) => {
  errorLogger(`uncaughtException: ${error.message}`);
  process.exit(1);
});

import { errorLogger, successLogger } from "./shared/logger";

const bootFunctions = async () => {
  try {
    if (!config.PORT) {
      return errorLogger("Port is not found");
    }

    successLogger(config.DB_URI as string);
    await mongoose.connect(config.DB_URI as string);
    successLogger("🛢 Database connected...");
    server = app.listen(config.PORT, () => {
      successLogger(`App listening on port ${config.PORT}...`);
    });
  } catch (error) {
    errorLogger("Database connection failed");
  }

  process.on("unhandledRejection", (error) => {
    if (server) {
      server.close(() => {
        errorLogger(`Unhandled rejection: ${error}`);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
};

bootFunctions();

// process.on("SIGTERM", () => {
//   successLogger("SIGTERM is received");
//   if (server) {
//     server.close();
//   }
// });
