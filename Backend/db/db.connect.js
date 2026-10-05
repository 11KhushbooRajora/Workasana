const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]); 
require("dotenv").config();

const mongoose = require("mongoose");

const uri = process.env.MONGODB;

const initializeDb = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Database connected successfully");
  } catch (err) {
    console.log("Error loading connection:", err);
  }
};

module.exports = { initializeDb }