const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const authMiddleware = require("./middlewares/auth.middleware");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swaggerConfig");

const app = express();

//secure
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/auth", require("./routes/auth.routes"));

//middleware
app.use(authMiddleware.authenticate);

//routes
app.use("/api/gateways", require("./routes/gateway.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/devices", require("./routes/device.routes"));
app.use("/api/access-control", require("./routes/accessControl.routes"));
app.use("/api/schedules", require("./routes/schedule.routes"));
app.use("/api/scenarios", require('./routes/automationScenario.routes'));
app.use("/api/control", require('./routes/control.routes'));

//error handler middleware
app.use(require("./middlewares/error.middleware"));

module.exports = app;
