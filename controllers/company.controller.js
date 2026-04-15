const { Company } = require("../models");

/**
 * CREATE COMPANY
 * POST /api/companies
 */
exports.createCompany = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, industry, size, contact_email,city,state, notes } = req.body;

    const company = await Company.create({
      user_id: userId,
      name,
      industry,
      size,
      contact_email,
      city,
      state,
      notes
    });

    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET ALL COMPANIES (of logged-in user)
 * GET /api/companies
 */
exports.getCompanies = async (req, res) => {
  try {
    const userId = req.user.id;

    const companies = await Company.findAll({
      where: { user_id: userId }
    });

    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET SINGLE COMPANY
 * GET /api/companies/:id
 */
exports.getCompanyById = async (req, res) => {
  try {
    const userId = req.user.id;
    const companyId = req.params.id;

    const company = await Company.findOne({
      where: { id: companyId, user_id: userId }
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json(company);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * UPDATE COMPANY
 * PUT /api/companies/:id
 */
exports.updateCompany = async (req, res) => {
  try {
    const userId = req.user.id;
    const companyId = req.params.id;

    const [updated] = await Company.update(req.body, {
      where: { id: companyId, user_id: userId }
    });

    if (!updated) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json({ message: "Company updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * DELETE COMPANY
 * DELETE /api/companies/:id
 */
exports.deleteCompany = async (req, res) => {
  try {
    const userId = req.user.id;
    const companyId = req.params.id;

    const deleted = await Company.destroy({
      where: { id: companyId, user_id: userId }
    });

    if (!deleted) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json({ message: "Company deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
exports.searchApplications = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      company,
      city,
      state,
      status,
      salary_min,
      salary_max
    } = req.query;

    const whereApplication = { user_id: userId };
    const whereCompany = {};

    if (status) whereApplication.status = status;
    if (salary_min) whereApplication.expected_salary = { [Op.gte]: salary_min };
    if (salary_max) whereApplication.expected_salary = { [Op.lte]: salary_max };

    if (company) whereCompany.name = { [Op.like]: `%${company}%` };
    if (city) whereCompany.city = { [Op.like]: `%${city}%` };
    if (state) whereCompany.state = { [Op.like]: `%${state}%` };

    const results = await JobApplication.findAll({
      where: whereApplication,
      include: [
        {
          model: Company,
          where: Object.keys(whereCompany).length ? whereCompany : undefined
        }
      ]
    });

    res.json(results);
  } catch (err) {
    console.error("SEARCH ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
