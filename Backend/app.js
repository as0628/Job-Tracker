require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

const { sequelize } = require("./models");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");
const path = require("path");

// Middleware
app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://job-tracker-2-ut8u.onrender.com",
    "https://your-vercel-site.vercel.app"
  ]
}));

// Static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Frontend static files
app.use(express.static(path.join(__dirname, "..", "Frontend", "public")));

// Home route
app.get("/", (req, res) => {
  res.sendFile(
    path.join(__dirname, "..", "Frontend", "public", "index.html")
  );
});

// Cron jobs
require("./cron/reminder.cron");

// Swagger Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/reminders", require("./routes/reminder.routes"));
app.use("/api/dashboard", require("./routes/dashboard.routes"));

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api", require("./routes/user.routes"));
app.use("/api/companies", require("./routes/company.routes"));
app.use("/api/applications", require("./routes/jobApplication.routes"));
app.use("/api", require("./routes/attachment.routes"));

// Debug logs
console.log("EMAIL_USER =", process.env.EMAIL_USER);
console.log("EMAIL_PASS =", process.env.EMAIL_PASS ? "LOADED" : "MISSING");
console.log("APP.JS PATH =", __filename);

// DB + Server start
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});


// require("dotenv").config({ path: __dirname + "/.env" });

// const express = require("express");
// const app = express();
// const PORT = process.env.PORT || 3000;
// const { sequelize } = require("./models");
// const swaggerUi = require("swagger-ui-express");
// const swaggerSpec = require("./docs/swagger");
// const path = require("path");
// //const testEmailRoute = require("./routes/testEmail.route");
// //app.use("/api", testEmailRoute);

// app.use(express.json());
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));



// app.use(express.static(path.join(__dirname,  "..", "Frontend", "public")));

// require("./cron/reminder.cron");
// app.use("/uploads", express.static("uploads"));

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));



// app.use("/api/reminders", require("./routes/reminder.routes"));


// app.use("/uploads", express.static("uploads"));
// app.use("/api", require("./routes/attachment.routes"));
// app.use("/api/dashboard", require("./routes/dashboard.routes"));


// app.use("/api/auth", require("./routes/auth.routes"));
// app.use("/api", require("./routes/user.routes"));
// app.use("/api/companies", require("./routes/company.routes"));
// app.use("/api/applications", require("./routes/jobApplication.routes"));
// app.use("/api", require("./routes/attachment.routes"));

// // app.use("/api", testEmailRoute);

// console.log("EMAIL_USER =", process.env.EMAIL_USER);
// console.log("EMAIL_PASS =", process.env.EMAIL_PASS ? "LOADED" : "MISSING");

// console.log("APP.JS PATH =", __filename);


// sequelize.sync();



// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
