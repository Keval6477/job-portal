import { Company } from "../models/company.model.js";
export const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;
    if (!companyName) {
      return res.status(400).json({
        success: false,
        message: "CompanyName is required.",
      });
    }
    let company = await Company.find({ name: companyName });
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }
    company = await Company.create({
      name: companyName,
      userId: req.id,
    });

    return res.status(201).json({
      success: true,
      message: "Company created successfully.",
      company,
    });
  } catch (error) {
    console.log("registerCompany error=>", error);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};

export const getCompany = async (req, res) => {
  try {
    const userId = req.id; //logged in user
    const companies = await Company.find({ userId });
    if (!companies) {
      return res.status(404).json({
        success: false,
        message: "comapnies not found.",
      });
    }
    return res.status(200).json({
      success: true,
      companies,
    });
  } catch (error) {
    console.log("getCompany error=>", error);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};

//get company by id
export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "company not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "company found successfully",
      company,
    });
  } catch (error) {
    console.log("getCompanyById error=>", error);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};

//update company

export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const file = req.file;
    //update cloudinary

    const updateData = {
      name,
      description,
      website,
      location,
    };
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      updateCompany,
      { new: true }
    );

    if (!company) {
      return res.status(400).json({
        success: false,
        message: "company not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "company updated successfully updated.",
      company,
    });
  } catch (error) {
    console.log("UpdateCompany controller error=>", error);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};
