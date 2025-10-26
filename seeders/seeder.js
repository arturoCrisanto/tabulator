import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

// Import models
import User from "../models/userModel.js";
import Event from "../models/eventModel.js";
import Category from "../models/categoryModel.js";
import Candidate from "../models/candidateModel.js";
import Judge from "../models/judgeModel.js";
import Vote from "../models/voteModel.js";
import connectDB from "../config/db.js";

// Load environment variables
dotenv.config();

// Sample data
const users = [
  {
    name: "Admin User",
    email: "admin@tabulator.com",
    password: "admin123",
    role: "admin",
  },
  {
    name: "John Smith",
    email: "john.smith@tabulator.com",
    password: "judge123",
    role: "judge",
  },
  {
    name: "Sarah Johnson",
    email: "sarah.johnson@tabulator.com",
    password: "judge123",
    role: "judge",
  },
  {
    name: "Michael Brown",
    email: "michael.brown@tabulator.com",
    password: "judge123",
    role: "judge",
  },
  {
    name: "Emily Davis",
    email: "emily.davis@tabulator.com",
    password: "judge123",
    role: "judge",
  },
  {
    name: "David Wilson",
    email: "david.wilson@tabulator.com",
    password: "judge123",
    role: "judge",
  },
];

const events = [
  {
    name: "Annual Talent Show 2025",
    date: new Date("2025-12-15"),
  },
  {
    name: "Art Competition 2025",
    date: new Date("2025-11-20"),
  },
  {
    name: "Music Festival 2025",
    date: new Date("2025-10-30"),
  },
];

const categories = [
  // Talent Show categories
  { name: "Singing", eventIndex: 0 },
  { name: "Dancing", eventIndex: 0 },
  { name: "Comedy", eventIndex: 0 },
  { name: "Magic", eventIndex: 0 },

  // Art Competition categories
  { name: "Painting", eventIndex: 1 },
  { name: "Sculpture", eventIndex: 1 },
  { name: "Digital Art", eventIndex: 1 },

  // Music Festival categories
  { name: "Rock Band", eventIndex: 2 },
  { name: "Solo Performance", eventIndex: 2 },
  { name: "Jazz Ensemble", eventIndex: 2 },
];

const candidates = [
  // Talent Show candidates
  { name: "Alice Cooper", eventIndex: 0 },
  { name: "Bob Dylan", eventIndex: 0 },
  { name: "Charlie Chaplin", eventIndex: 0 },
  { name: "Diana Ross", eventIndex: 0 },
  { name: "Elvis Presley", eventIndex: 0 },
  { name: "Frank Sinatra", eventIndex: 0 },
  { name: "Grace Kelly", eventIndex: 0 },
  { name: "Harry Houdini", eventIndex: 0 },

  // Art Competition candidates
  { name: "Leonardo DiCaprio", eventIndex: 1 },
  { name: "Vincent Van Gogh", eventIndex: 1 },
  { name: "Pablo Picasso", eventIndex: 1 },
  { name: "Frida Kahlo", eventIndex: 1 },
  { name: "Georgia O'Keeffe", eventIndex: 1 },

  // Music Festival candidates
  { name: "The Beatles", eventIndex: 2 },
  { name: "Queen", eventIndex: 2 },
  { name: "Led Zeppelin", eventIndex: 2 },
  { name: "Pink Floyd", eventIndex: 2 },
  { name: "Miles Davis", eventIndex: 2 },
  { name: "John Coltrane", eventIndex: 2 },
];

// Function to hash passwords
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Function to clear all data
const clearData = async () => {
  try {
    console.log("🗑️  Clearing existing data...");
    await Vote.deleteMany({});
    await Judge.deleteMany({});
    await Candidate.deleteMany({});
    await Category.deleteMany({});
    await Event.deleteMany({});
    await User.deleteMany({});
    console.log("✅ Existing data cleared successfully");
  } catch (error) {
    console.error("❌ Error clearing data:", error.message);
    throw error;
  }
};

// Function to seed users
const seedUsers = async () => {
  try {
    console.log("👥 Seeding users...");

    // Hash passwords for all users
    const usersWithHashedPasswords = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await hashPassword(user.password),
      }))
    );

    const createdUsers = await User.insertMany(usersWithHashedPasswords);
    console.log(`✅ Created ${createdUsers.length} users`);
    return createdUsers;
  } catch (error) {
    console.error("❌ Error seeding users:", error.message);
    throw error;
  }
};

// Function to seed events
const seedEvents = async () => {
  try {
    console.log("🎪 Seeding events...");
    const createdEvents = await Event.insertMany(events);
    console.log(`✅ Created ${createdEvents.length} events`);
    return createdEvents;
  } catch (error) {
    console.error("❌ Error seeding events:", error.message);
    throw error;
  }
};

// Function to seed categories
const seedCategories = async (createdEvents) => {
  try {
    console.log("📂 Seeding categories...");

    const categoriesToCreate = categories.map((category) => ({
      name: category.name,
      event: createdEvents[category.eventIndex]._id,
    }));

    const createdCategories = await Category.insertMany(categoriesToCreate);
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Update events with category references
    for (let i = 0; i < createdEvents.length; i++) {
      const eventCategories = createdCategories.filter(
        (cat) => cat.event.toString() === createdEvents[i]._id.toString()
      );

      await Event.findByIdAndUpdate(createdEvents[i]._id, {
        categories: eventCategories.map((cat) => cat._id),
      });
    }

    console.log("✅ Updated events with category references");
    return createdCategories;
  } catch (error) {
    console.error("❌ Error seeding categories:", error.message);
    throw error;
  }
};

// Function to seed candidates
const seedCandidates = async (createdEvents) => {
  try {
    console.log("🏆 Seeding candidates...");

    const candidatesToCreate = candidates.map((candidate) => ({
      name: candidate.name,
      event: createdEvents[candidate.eventIndex]._id,
    }));

    const createdCandidates = await Candidate.insertMany(candidatesToCreate);
    console.log(`✅ Created ${createdCandidates.length} candidates`);
    return createdCandidates;
  } catch (error) {
    console.error("❌ Error seeding candidates:", error.message);
    throw error;
  }
};

// Function to seed judges
const seedJudges = async (createdUsers, createdEvents, createdCategories) => {
  try {
    console.log("👨‍⚖️ Seeding judges...");

    // Get judge users (exclude admin)
    const judgeUsers = createdUsers.filter((user) => user.role === "judge");
    const judgesToCreate = [];

    // Assign judges to events
    for (let i = 0; i < createdEvents.length; i++) {
      const event = createdEvents[i];
      const eventCategories = createdCategories.filter(
        (cat) => cat.event.toString() === event._id.toString()
      );

      // Assign 2-3 judges per event
      const judgesForEvent = judgeUsers.slice(i * 2, i * 2 + 3);

      for (const judgeUser of judgesForEvent) {
        judgesToCreate.push({
          user: judgeUser._id,
          event: event._id,
          assignedCategories: eventCategories.map((cat) => cat._id),
          active: true,
        });
      }
    }

    const createdJudges = await Judge.insertMany(judgesToCreate);
    console.log(`✅ Created ${createdJudges.length} judge assignments`);

    // Update events with judge references
    for (const event of createdEvents) {
      const eventJudges = createdJudges.filter(
        (judge) => judge.event.toString() === event._id.toString()
      );

      await Event.findByIdAndUpdate(event._id, {
        judges: eventJudges.map((judge) => judge.user),
      });
    }

    console.log("✅ Updated events with judge references");
    return createdJudges;
  } catch (error) {
    console.error("❌ Error seeding judges:", error.message);
    throw error;
  }
};

// Function to seed votes
const seedVotes = async (
  createdEvents,
  createdCategories,
  createdCandidates,
  createdJudges
) => {
  try {
    console.log("🗳️  Seeding votes...");

    const votesToCreate = [];

    for (const event of createdEvents) {
      const eventCategories = createdCategories.filter(
        (cat) => cat.event.toString() === event._id.toString()
      );

      const eventCandidates = createdCandidates.filter(
        (candidate) => candidate.event.toString() === event._id.toString()
      );

      const eventJudges = createdJudges.filter(
        (judge) => judge.event.toString() === event._id.toString()
      );

      // Create votes for each judge, category, and candidate combination
      for (const judge of eventJudges) {
        for (const category of eventCategories) {
          for (const candidate of eventCandidates) {
            // Generate random score between 1 and 10
            const score = Math.floor(Math.random() * 10) + 1;

            votesToCreate.push({
              event: event._id,
              category: category._id,
              judge: judge.user,
              candidate: candidate._id,
              score: score,
            });
          }
        }
      }
    }

    const createdVotes = await Vote.insertMany(votesToCreate);
    console.log(`✅ Created ${createdVotes.length} votes`);
    return createdVotes;
  } catch (error) {
    console.error("❌ Error seeding votes:", error.message);
    throw error;
  }
};

// Main seeder function
const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...");
    console.log("=".repeat(50));

    // Connect to database
    await connectDB();

    // Clear existing data
    await clearData();

    // Seed data in order
    const createdUsers = await seedUsers();
    const createdEvents = await seedEvents();
    const createdCategories = await seedCategories(createdEvents);
    const createdCandidates = await seedCandidates(createdEvents);
    const createdJudges = await seedJudges(
      createdUsers,
      createdEvents,
      createdCategories
    );
    const createdVotes = await seedVotes(
      createdEvents,
      createdCategories,
      createdCandidates,
      createdJudges
    );

    console.log("=".repeat(50));
    console.log("🎉 Database seeding completed successfully!");
    console.log("📊 Summary:");
    console.log(`   👥 Users: ${createdUsers.length}`);
    console.log(`   🎪 Events: ${createdEvents.length}`);
    console.log(`   📂 Categories: ${createdCategories.length}`);
    console.log(`   🏆 Candidates: ${createdCandidates.length}`);
    console.log(`   👨‍⚖️ Judge Assignments: ${createdJudges.length}`);
    console.log(`   🗳️  Votes: ${createdVotes.length}`);
    console.log("=".repeat(50));

    console.log("🔑 Admin Credentials:");
    console.log("   Email: admin@tabulator.com");
    console.log("   Password: admin123");
    console.log("");
    console.log("🔑 Judge Credentials (all have password 'judge123'):");
    createdUsers
      .filter((user) => user.role === "judge")
      .forEach((judge) => {
        console.log(`   Email: ${judge.email}`);
      });
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    if (process.env.NODE_ENV === "development") {
      console.error("🔍 Error Details:", error);
    }
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
    process.exit(0);
  }
};

// Function to clear database only
const clearDatabase = async () => {
  try {
    console.log("🗑️  Clearing database...");

    // Connect to database
    await connectDB();

    // Clear all data
    await clearData();

    console.log("✅ Database cleared successfully!");
  } catch (error) {
    console.error("❌ Error clearing database:", error.message);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
    process.exit(0);
  }
};

// Check command line arguments
const args = process.argv.slice(2);

if (args.includes("--clear")) {
  clearDatabase();
} else {
  seedDatabase();
}

export { seedDatabase, clearDatabase };
