import AdminJS from "adminjs";
import AdminJsExpress from "@adminjs/express";
import session from "express-session";
import * as AdminJsSequelize from "@adminjs/sequelize";
import MongoStore from "connect-mongo";
import db from "../models/mysql/index.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import properties from "./properties.json" assert { type: "json" };

dotenv.config();

// Register Sequelize adapter
AdminJS.registerAdapter({
  Resource: AdminJsSequelize.Resource,
  Database: AdminJsSequelize.Database,
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
        properties: properties['User'],
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
    {
      resource: db.Actuator,
      options: {
        navigation: devicesNavigation,
      },
    },
    {
      resource: db.Sensor,
      options: {
        navigation: devicesNavigation,
      },
    },
    {
      resource: db.Group,
      options: {
        navigation: automationsNavigation,
      },
    },
    {
      resource: db.Scenario,
      options: {
        navigation: automationsNavigation,
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
    mongoUrl: "mongodb://localhost:27017/smarthome",
  }),
});

// Authenticated router with role-based authentication
const router = AdminJsExpress.buildAuthenticatedRouter(adminJs, {
  authenticate: async (email, password) => {
    const adminUser = await db.User.findOne({ where: { email } });

    if (!adminUser || !(await bcrypt.compare(password, adminUser.password))) {
      return null;
    }

    if (adminUser.role !== "admin") return null;

    return { email: adminUser.email, role: adminUser.role };
  },
  cookiePassword: process.env.COOKIE_SECRET,
},null, sessionMiddleware);

export { adminJs, router, sessionMiddleware };
