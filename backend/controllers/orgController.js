const Organization = require('../models/Organization');

// Creating a new organization
exports.createOrg = async (req, res) => {
  try {
    const { name, address } = req.body;

    const nameValue = name?.trim();
    const addressValue = address?.trim();

    if (!nameValue || !addressValue) {
      return res.status(400).json({
        message: 'Organization name and address are required'
      });
    }

    // Prevent duplicate organizations
    const existingOrg = await Organization.findOne({
      name: nameValue
    });

    if (existingOrg) {
      return res.status(400).json({
        message: 'Organization already exists'
      });
    }

    const org = new Organization({
      name: nameValue,
      address: addressValue
    });

    await org.save();

    res.status(201).json(org);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Retrieve all organizations
exports.getOrgs = async (req, res) => {
  try {
    const orgs = await Organization.find({});

    res.json(orgs);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};