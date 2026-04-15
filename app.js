require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const { sequelize } = require("./models");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");
const path = require("path");
//const testEmailRoute = require("./routes/testEmail.route");
//app.use("/api", testEmailRoute);

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));



app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

require("./cron/reminder.cron");
app.use("/uploads", express.static("uploads"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));



app.use("/api/reminders", require("./routes/reminder.routes"));


app.use("/uploads", express.static("uploads"));
app.use("/api", require("./routes/attachment.routes"));
app.use("/api/dashboard", require("./routes/dashboard.routes"));


app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api", require("./routes/user.routes"));
app.use("/api/companies", require("./routes/company.routes"));
app.use("/api/applications", require("./routes/jobApplication.routes"));
app.use("/api", require("./routes/attachment.routes"));

// app.use("/api", testEmailRoute);

console.log("EMAIL_USER =", process.env.EMAIL_USER);
console.log("EMAIL_PASS =", process.env.EMAIL_PASS ? "LOADED" : "MISSING");

console.log("APP.JS PATH =", __filename);


sequelize.sync();



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
