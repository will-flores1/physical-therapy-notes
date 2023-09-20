const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const PTCheckUpEntry = require("./models/PTCheckUpEntrySchema");

const APP = express();
const PORT = process.env.PORT || 80;
const CONNECT_DATABASE = (async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI);
		console.info(
			`MongoDB connected:`,
			`${conn.connection.host}`,
			`\nMongo Atlas:`,
			`https://cloud.mongodb.com/`
		);
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
})();
APP.listen(PORT, () => {
	console.log(`Server running on:`, `http://localhost:${PORT}`);
});

APP.use(express.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded

// Serve static files from client directory
const path = require("path");
const clientDir = path.join(__dirname, "..", "client");
APP.use(express.static(clientDir));

APP.get("/api/entries", async (req, res) => {
	try {
		const entries = await PTCheckUpEntry.find({});
		res.status(200).json(entries);
	} catch (error) {
		console.log(error);
	}
});

APP.post("/api/entries", async (req, res) => {
	try {
		const newEntry = await PTCheckUpEntry.create(req.body);
		res.status(201).json(newEntry);
	} catch (error) {
		console.log(error);
	}
});
