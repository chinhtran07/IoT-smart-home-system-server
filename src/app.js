import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import {swaggerSpec} from "./config/swaggerConfig.js";
import * as authMiddleware from "./middlewares/auth.middleware.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import apiRoutes from "./routes/index.js";
// import { admin, adminRouter, sessionMiddleware } from "./admin/admin.js";

const app = express();

// Secure
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// app.use(sessionMiddleware);
// app.use(admin.options.rootPath, adminRouter);

// Auth routes
app.use("/api/auth", authRoutes);

// Middleware for authentication
app.use(authMiddleware.authenticate);

// API routes
app.use("/api", apiRoutes);

// Error handler middleware
app.use(errorMiddleware);

export default app;
