const Organization = require('../models/Organization');

// Create a new organization
exports.createOrg = async (req, res) => {
  try {
    const { name, address } = req.body;

    if (!name || !address) {
      return res.status(400).json({ message: 'Organization name and address are required' });
    }

    // Create the organization record
    const org = new Organization({ name, address });
    await org.save();

    res.status(201).json(org);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Retrieve all organizations
exports.getOrgs = async (req, res) => {
  try {
    const orgs = await Organization.find({});
    res.json(orgs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
