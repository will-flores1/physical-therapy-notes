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
APP.use(express.json()); // for parsing application/json

// Serve static files from client directory
const path = require("path");
const clientDir = path.join(__dirname, "..", "client");
APP.use(express.static(clientDir));

// API endpoints
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
		console.log(req.body);
		const newEntry = await PTCheckUpEntry.create(req.body);
		res.status(201).json(newEntry);
	} catch (error) {
		console.log(error);
	}
});

APP.delete("/api/entries/:id", async (req, res) => {
	try {
		const deletedEntry = await PTCheckUpEntry.findByIdAndDelete(
			req.params.id
		);
		res.status(200).json(deletedEntry);
	} catch (error) {
		console.log(error);
	}
});

APP.put("/api/entries/:id", async (req, res) => {
	try {
		const updatedEntry = await PTCheckUpEntry.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		);
		res.status(200).json(updatedEntry);
	} catch (error) {
		console.log(error);
	}
});

APP.get("/entry/edit/:id", async (req, res) => {
	try {
		const entry = await PTCheckUpEntry.findById(req.params.id);
		console.log(entry);

		const html = `
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>${entry._id}</title>
				<link rel="stylesheet" href="/styles.css" />
			</head>
			<body>
				<h1>My PT Journal Online</h1>
				<nav>
					<ul>
						<li><a href="/">Home</a></li>
						<li><a href="/createentry.html">Create Entry</a></li>
						<li><a href="/viewentries.html">View Entries</a></li>
					</ul>
				</nav>
				<div id="app">
					<h2>Edit Entry ${entry._id}</h2>
					<form id="entry-form" action="/api/entries/${entry._id}" method="PUT">
						<!-- Pain Section -->
						<h2>Pain</h2>
						<label for="painLevel">Pain Level (0-10):</label>
						<input
							type="number"
							id="painLevel"
							name="pain[level]"
							min="0"
							max="10"
							value="${entry.pain.level || ""}" />

						<label for="painDescription">Pain Description:</label>
						<input
							type="text"
							id="painDescription"
							name="pain[description]"
							value="${entry.pain.description || ""}" />

						<label for="painTriggers">Pain Triggers:</label>
						<input
							type="text"
							id="painTriggers"
							name="pain[triggers]"
							value="${entry.pain.triggers || ""}" />

						<!-- Range of Motion Section -->
						<h2>Range of Motion</h2>
						<label for="flexion">Flexion (degrees):</label>
						<input
							type="number"
							id="flexion"
							name="rangeOfMotion[flexion]"
							value="${entry.rangeOfMotion.flexion || ""}" />
						
						<label for="extension">Extension (degrees):</label>
						<input
							type="number"
							id="extension"
							name="rangeOfMotion[extension]"
							value="${entry.rangeOfMotion.extension || "0" || ""}" />
							
						<!-- Swelling Section -->
						<h2>Swelling</h2>
						<label for="swelling">Swelling Description:</label>
						<textarea
							id="swelling"
							name="swelling"
							rows="4">${entry.swelling || ""}</textarea>

						<!-- Medications Section -->
						<h2>Medications</h2>
						<label for="medicationName">Medication Name:</label>
						<input
							type="text"
							id="medicationName"
							name="medications[0][name]"
							value="${entry.medications[0].name || ""}" />
					
						<label for="medicationDosage">Dosage:</label>
						<input
							type="text"
							id="medicationDosage"
							name="medications[0][dosage]"
							value="${entry.medications[0].dosage || ""}" />
					
						<label for="medicationFrequency">Frequency:</label>
						<input
							type="text"
							id="medicationFrequency"
							name="medications[0][frequency]"
							value="${entry.medications[0].frequency || ""}" />

						<!-- Physical Therapy Section -->
						<h2>Physical Therapy</h2>
						<label for="exerciseName">Exercise Name:</label>
						<input
							type="text"
							id="exerciseName"
							name="physicalTherapy[0][exercise]"
							value="${entry.physicalTherapy[0].exercise || ""}" />
					
						<label for="exerciseSets">Sets:</label>
						<input
							type="number"
							id="exerciseSets"
							name="physicalTherapy[0][sets]"
							value="${entry.physicalTherapy[0].sets || ""}" />
					
						<label for="exerciseRepetitions">Repetitions:</label>
						<input
							type="number"
							id="exerciseRepetitions"
							name="physicalTherapy[0][repetitions]"
							value="${entry.physicalTherapy[0].repetitions || ""}" />
					
						<label for="exerciseModifications">Modifications:</label>
						<textarea
							id="exerciseModifications"
							name="physicalTherapy[0][modifications]"
							rows="4">${entry.physicalTherapy[0].modifications || ""}</textarea>

						<!-- Challenges and Achievements Section -->
						<h2>Challenges and Achievements</h2>
						<label for="challengesAndAchievements">Describe Challenges and Achievements:</label>
						<textarea
							id="challengesAndAchievements"
							name="challengesAndAchievements"
							rows="4">${entry.challengesAndAchievements || ""}</textarea>

						<!-- Questions and Concerns Section -->
						<h2>Questions and Concerns</h2>
						<label for="questionsAndConcerns">Questions and Concerns:</label>
						<textarea
							id="questionsAndConcerns"
							name="questionsAndConcerns"
							rows="4">${entry.questionsAndConcerns || ""}</textarea>

						<!-- Diet and Nutrition Section -->
						<h2>Diet and Nutrition</h2>
						<label for="dietAndNutrition">Diet and Nutrition Information:</label>
						<textarea
							id="dietAndNutrition"
							name="dietAndNutrition"
							rows="4">${entry.dietAndNutrition || ""}</textarea>

						<!-- Sleep and Rest Section -->
						<h2>Sleep and Rest</h2>
						<label for="sleepAndRest">Sleep and Rest Information:</label>
						<textarea
							id="sleepAndRest"
							name="sleepAndRest"
							rows="4">${entry.sleepAndRest || ""}</textarea>

						<!-- Emotional Well-being Section -->
						<h2>Emotional Well-being</h2>
						<label for="emotionalWellBeing">Emotional Well-being Information:</label>
						<textarea
							id="emotionalWellBeing"
							name="emotionalWellBeing"
							rows="4">${entry.emotionalWellBeing || ""}</textarea>

						<!-- Future Goals Section -->
						<h2>Future Goals</h2>
						<label for="futureGoals">Future Goals:</label>
						<textarea
							id="futureGoals"
							name="futureGoals"
							rows="4">${entry.futureGoals || ""}</textarea>

						<!-- Follow-Up Appointments Section -->
						<h2>Follow-Up Appointments</h2>
						<label for="followUpAppointments">Follow-Up Appointments Date:</label>
						<input
							type="date"
							id="followUpAppointments"
							name="followUpAppointments"
							value="${entry.followUpAppointments || ""}" />

						<!-- Update Button -->
						<button type="submit" id="update-button">Update</button>

						<a style="display: block; margin-top: 10px;" href="/viewentries.html">Back to View Entries</a>
					</form>
				</div>
			</body>
			<script async>
				document
					.getElementById("entry-form")
					.addEventListener("submit", handleSubmit);
				async function handleSubmit() {
					event.preventDefault();

					const formData = new FormData(event.target);
			
					// Create an object that matches the MongoDB schema structure
					const entryData = {
						pain: {
							level: formData.get("pain[level]"),
							description: formData.get("pain[description]"),
							triggers: formData.get("pain[triggers]"),
						},
						rangeOfMotion: {
							flexion: formData.get("rangeOfMotion[flexion]"),
							extension: formData.get("rangeOfMotion[extension]"),
						},
						swelling: formData.get("swelling"),
						medications: [
							{
									name: formData.get("medications[0][name]"),
									dosage: formData.get("medications[0][dosage]"),
									frequency: formData.get("medications[0][frequency]"),
							},
						],
						physicalTherapy: [
							{
									exercise: formData.get("physicalTherapy[0][exercise]"),
									sets: formData.get("physicalTherapy[0][sets]"),
									repetitions: formData.get("physicalTherapy[0][repetitions]"),
									modifications: formData.get("physicalTherapy[0][modifications]"),
							},
						],
						challengesAndAchievements: formData.get("challengesAndAchievements"),
						questionsAndConcerns: formData.get("questionsAndConcerns"),
						dietAndNutrition: formData.get("dietAndNutrition"),
						sleepAndRest: formData.get("sleepAndRest"),
						emotionalWellBeing: formData.get("emotionalWellBeing"),
						futureGoals: formData.get("futureGoals"),
						followUpAppointments: formData.get("followUpAppointments"),
					};
			
					// Log the structured data to the console
					console.log("Structured Data:", entryData);
			
					// Now you can send this structured data to your MongoDB server
					// using a PUT request to the /api/entries/:id endpoint
					try {
						const res = await fetch("/api/entries/${entry._id}", {
							method: "PUT",
							headers: {
									"Content-Type": "application/json",
							},
							body: JSON.stringify(entryData),
						});
			
						const data = await res.json();
			
						console.log("Success:", data);
					} catch (error) {
						console.error("Error:", error);
					}
				}
			</script>
		</html>
		`;

		res.send(html);
	} catch (error) {
		console.log(error);
	}
});

APP.get("/entry/:id", async (req, res) => {
	const slug = req.params.id;

	try {
		const entry = await PTCheckUpEntry.findById(req.params.id);
		console.log(entry);

		const html = `
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>${entry._id}</title>
				<link rel="stylesheet" href="/styles.css" />
			</head>
			<style>
				#app {
					padding: 0 20px;
				}

				#app h2 {
					margin-bottom: 0;
				}
				
				#app p {
					margin-top: 0;
				}
				// 3 columns on desktop, 1 column on mobile
				#app ul {
					display: grid;
					grid-template-columns: repeat(3, 1fr);
					grid-gap: 20px;
				}

				#app li {
					list-style: none;
					border: 1px solid #ccc;
					padding: 20px;
				}

				#app a {
					display: block;
					margin-top: 10px;
				}

				#app a:hover {
					text-decoration: underline;
				}

				#app a:visited {
					color: #000;
				}

				#app a:visited:hover {
					color: #000;
				}

				#app a:active {
					color: #000;
				}

				#app a:active:hover {
					color: #000;
				}

				#app a:focus {
					color: #000;
				}

				#app a:focus:hover {
					color: #000;
				}

				#app a:link {
					color: #000;
				}

				#app a:link:hover {
					color: #000;
				}

				#app a:link:active {
					color: #000;
				}

				#app a:link:active:hover {
					color: #000;
				}

				#app a:link:focus {
					color: #000;
				}

				#app a:link:focus:hover {
					color: #000;
				}

				#app a:link:visited {
					color: #000;
				}

				#app a:link:visited:hover {
					color: #000;
				}

				#app a:link:visited:active {
					color: #000;
				}

				#app a:link:visited:active:hover {
					color: #000;
				}

				@media (max-width: 768px) {
					#app ul {
						grid-template-columns: 1fr;
					}
				}

				@media (max-width: 500px) {
					#app {
						padding: 0 10px;
					}
				}
			</style>
			<body>
				<h1>My PT Journal Online</h1>
				<nav>
					<ul>
						<li><a href="/">Home</a></li>
						<li><a href="/createentry.html">Create Entry</a></li>
						<li><a href="/viewentries.html">View Entries</a></li>
					</ul>
				</nav>
				<div id="app">
					<h2>Entry ${entry._id}</h2>

					<h2>Pain</h2>
					<p>Level: ${entry.pain.level}</p>
					<p>Description: ${entry.pain.description}</p>
					<p>Triggers: ${entry.pain.triggers}</p>

					<h2>Range of Motion</h2>
					<p>Flexion: ${entry.rangeOfMotion.flexion}</p>
					<p>Extension: ${entry.rangeOfMotion.extension}</p>

					<h2>Swelling</h2>
					<p>${entry.swelling}</p>

					<h2>Medications</h2>
					<ul>
						<li>
							<p>Name: ${entry.medications.length ? entry.medications[0].name : null}</p>
							<p>Dosage: ${entry.medications.length ? entry.medications[0].dosage : null}</p>
							<p>Frequency: ${
								entry.medications.length
									? entry.medications[0].frequency
									: null
							}</p>
						</li>
					</ul>

					<h2>Physical Therapy</h2>
					<ul>
						<li>
							<p>Exercise: ${
								entry.physicalTherapy.length
									? entry.physicalTherapy[0].exercise
									: null
							}</p>
							<p>Sets: ${
								entry.physicalTherapy.length
									? entry.physicalTherapy[0].sets
									: null
							}</p>
							<p>Repetitions: ${
								entry.physicalTherapy.length
									? entry.physicalTherapy[0].repetitions
									: null
							}</p>
							<p>Modifications: ${
								entry.physicalTherapy.length
									? entry.physicalTherapy[0].modifications
									: null
							}</p>
						</li>
					</ul>

					<h2>Challenges and Achievements</h2>
					<p>${entry.challengesAndAchievements}</p>

					<h2>Questions and Concerns</h2>
					<p>${entry.questionsAndConcerns}</p>

					<h2>Diet and Nutrition</h2>
					<p>${entry.dietAndNutrition}</p>

					<h2>Sleep and Rest</h2>
					<p>${entry.sleepAndRest}</p>

					<h2>Emotional Well-Being</h2>
					<p>${entry.emotionalWellBeing}</p>

					<h2>Future Goals</h2>
					<p>${entry.futureGoals}</p>

					<h2>Follow-Up Appointments</h2>
					<p>${entry.followUpAppointments.toLocaleDateString()}</p>

					<a href="/viewentries.html">Back to View Entries</a>
				</div>
			</body>
		</html>
		`;

		res.send(html);
	} catch (error) {
		console.log(error);
	}
});
