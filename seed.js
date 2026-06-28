const { MongoClient } = require("mongodb");
const path = require("path");

// 🚀 Load variables straight from your Next.js configuration file
require("dotenv").config({ path: path.resolve(__dirname, ".env.local") });

// Use your actual cluster link, fallback to local only if it doesn't exist
const MONGODB_URI = process.env.MONGODB_URI; 

if (!MONGODB_URI) {
  console.error("❌ Error: MONGODB_URI is missing from your .env.local file!");
  process.exit(1);
}

const mockApplications = [
  {
    userId: "mock-valid-id",
    companyName: "Microsoft",
    jobTitle: "Cloud Solutions Architect",
    jobType: "Full-time",
    status: "Interviewing",
    salary: 140000,
    notes: "Technical round scheduled for next Tuesday.",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: "mock-valid-id",
    companyName: "Meta",
    jobTitle: "Product Designer",
    jobType: "Contract",
    status: "Offered",
    salary: 165000,
    notes: "Offer letter received via email. Reviewing equity options.",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: "mock-valid-id",
    companyName: "Netflix",
    jobTitle: "Senior Backend Engineer",
    jobType: "Full-time",
    status: "Applied",
    salary: 210000,
    notes: "Applied via internal referral.",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: "mock-valid-id",
    companyName: "Amazon",
    jobTitle: "Software Engineer Intern",
    jobType: "Internship",
    status: "Rejected",
    salary: 45000,
    notes: "Resumé screening filter block.",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("Connected to MongoDB cluster successfully...");
    
    const db = client.db();
    const collection = db.collection("jobapplications"); 
    
    console.log("Inserting mock data records...");
    await collection.insertMany(mockApplications);
    
    console.log("Database seeded successfully! 🎉");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.close();
  }
}

seedDatabase();