import {
  accent,
  createLogger,
  redact,
} from "../src/index";

console.log(accent.red("Red message"));
console.log(accent.green.bold("Green and bold"));
console.log(accent.yellow.italic("Yellow and italic"));
console.log(accent.blue.underline("Blue and underlined"));
console.log(
  accent.bgRed.white.bold(" Fatal error "),
);
console.log(
  accent.hex("#7C3AED").bold("Custom purple"),
);

const logger = createLogger({
  level: "trace",
});

logger.fatal("Application cannot start");
logger.error("Database connection failed");
logger.warn("Memory usage is high");
logger.success("Deployment completed");
logger.info("Server started on port 3000");
logger.debug("Request payload", {
  userId: 42,
});
logger.trace("Entered payment service");

const authLogger = logger.scope("AUTH");

authLogger.info("Authentication started");
authLogger.success("User authenticated");

const requestLogger = logger.withContext({
  requestId: "req_123",
  userId: "user_42",
});

requestLogger.info("Request received");

logger.info(
  "Safe payload",
  redact({
    email: "developer@example.com",
    password: "secret",
    accessToken: "abc123",
  }),
);

const timer = logger.time("Fake operation");

setTimeout(() => {
  timer.end({
    records: 25,
  });
}, 300);