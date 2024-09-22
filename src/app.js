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
import { adminJs, router, sessionMiddleware } from './admin/admin.js'; // Import AdminJS

const app = express();

app.use(sessionMiddleware);
app.use(adminJs.options.rootPath, router);

// Secure
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Swagger documentation
app.use(express.static('public'));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Auth routes
app.use("/api/auth", authRoutes);

// API routes
app.use("/api", authMiddleware.authenticate ,apiRoutes);

app.use(errorMiddleware);


export { app };
