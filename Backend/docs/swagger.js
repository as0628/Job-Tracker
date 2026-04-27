const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Job Application Tracker API",
      version: "1.0.0",
      description: "Backend APIs for Job Application Tracker"
    },
    servers: [
      {
        url: "https://job-tracker-2-ut8u.onrender.com"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ["./routes/*.js"]
};

module.exports = swaggerJsdoc(options);

// const swaggerJsdoc = require("swagger-jsdoc");

// const options = {
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "Job Application Tracker API",
//       version: "1.0.0",
//       description: "Backend APIs for Job Application Tracker"
//     },
//     servers: [
//       {
//         url: "http://localhost:3000"
//       }
//     ],
//     components: {
//       securitySchemes: {
//         bearerAuth: {
//           type: "http",
//           scheme: "bearer",
//           bearerFormat: "JWT"
//         }
//       }
//     },
//     security: [
//       {
//         bearerAuth: []
//       }
//     ]
//   },
//   apis: ["./routes/*.js"]
// };

// module.exports = swaggerJsdoc(options);
