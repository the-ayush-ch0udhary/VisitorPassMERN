const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Organization = require('./models/Organization');
const User = require('./models/User');

// Load environment variables
dotenv.config();

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // 1. Clean existing records
    await User.deleteMany();
    await Organization.deleteMany();
    console.log('Cleaned old users and organizations...');

    // 2. Create organization
    const org = new Organization({
      name: 'Acme Corporation',
      address: '123 Innovation Way, Tech District, NY'
    });
    await org.save();
    console.log(`Created Organization: ${org.name} (${org._id})`);

    // 3. Create Seed Users
    // NOTE: Passwords are automatically hashed in User schema pre-save hook.
    
    // Admin User
    const adminUser = new User({
      name: 'System Admin',
      email: 'admin@gmail.com',
      password: 'admin123',
      role: 'Admin',
      organizationId: org._id
    });
    await adminUser.save();
    console.log('Created Admin User: admin@gmail.com / admin123');

    // Security User
    const securityUser = new User({
      name: 'Front Desk Security',
      email: 'security@agmail.com',
      password: 'security123',
      role: 'Security',
      organizationId: org._id
    });
    await securityUser.save();
    console.log('Created Security User: security@gmail.com / security123');

    // Host User (Employee)
    const hostUser = new User({
      name: 'Dr. Jane Host',
      email: 'host@gmail.com',
      password: 'host123',
      role: 'Host',
      organizationId: org._id
    });
    await hostUser.save();
    console.log('Created Host User: host@gmail.com / host123');

    const VisitorUser = new User({
      name: 'Moon',
      email: 'moon@gmail.com',
      password: 'moon123',
      role: 'Visitor',
      organizationId: org._id
    });
    await VisitorUser.save();
    console.log('Created Visitor User: moon@gmail.com / moon123');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
