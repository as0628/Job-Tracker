const express = require("express");
const router = express.Router();
const companyController = require("../controllers/company.controller");
const authMiddleware = require("../middleware/auth.middleware");

// All routes are protected
router.post("/", authMiddleware, companyController.createCompany);
router.get("/", authMiddleware, companyController.getCompanies);
router.get("/:id", authMiddleware, companyController.getCompanyById);
router.put("/:id", authMiddleware, companyController.updateCompany);
router.delete("/:id", authMiddleware, companyController.deleteCompany);
router.get("/search", authMiddleware, companyController.searchApplications);

module.exports = router;
