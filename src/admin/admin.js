import AdminJS from "adminjs";
import AdminJsExpress from "@adminjs/express";
import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import * as AdminJsMongoose from "@adminjs/mongoose";
import db from "../models/index.js";
import config from "../config/index.js";
// import properties from "./properties.js";

dotenv.config();

// Register Sequelize adapter
AdminJS.registerAdapter({
  Resource: AdminJsMongoose.Resource,
  Database: AdminJsMongoose.Database,
});

// Define custom navigation categories
const usersNavigation = { name: "Users", icon: "User" };
const devicesNavigation = { name: "Devices", icon: "Devices" };
const automationsNavigation = { name: "Automation", icon: "Settings" };

// Create AdminJS instance
const adminJs = new AdminJS({
  resources: [
    {
      resource: db.User,
      options: {
        navigation: usersNavigation,
        properties: {
          email: {
            isVisible: {
              list: true,
              show: true,
              filter: true,
              edit: false
            }
          },
        }
      },
    },
    {
      resource: db.Gateway,
      options: {
        navigation: devicesNavigation,
      },
    },
    {
      resource: db.Device,
      options: {
        navigation: devicesNavigation,
      },
    },
  ],
  rootPath: "/admin",
  branding: {
    companyName: "ChinChin",
    softwareBrothers: false,
  },
});

// Setup session middleware
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: config.mongo_url,
  }),
});

// Authenticated router with role-based authentication
const router = AdminJsExpress.buildAuthenticatedRouter(
  adminJs,
  {
    authenticate: async (email, password) => {
      const adminUser = await db.User.findOne({ email }).exec();

      if (!adminUser || !(await bcrypt.compare(password, adminUser.password))) {
        return null;
      }

      if (adminUser.role !== "admin") return null;

      return { email: adminUser.email, role: adminUser.role };
    },
    cookiePassword: process.env.COOKIE_SECRET,
  },
  null,
  {
    resave: true,
    saveUninitialized: true
  },
  sessionMiddleware
);

export { adminJs, router, sessionMiddleware };
