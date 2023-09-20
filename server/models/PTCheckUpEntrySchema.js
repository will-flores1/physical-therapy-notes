const mongoose = require("mongoose");

const recoveryCheckUpSchema = new mongoose.Schema(
	{
		pain: {
			level: Number,
			description: String,
			triggers: String,
		},
		rangeOfMotion: {
			flexion: Number,
			extension: Number,
		},
		swelling: String,
		medications: [
			{
				name: String,
				dosage: String,
				frequency: String,
			},
		],
		physicalTherapy: [
			{
				exercise: String,
				sets: Number,
				repetitions: Number,
				modifications: String,
			},
		],
		challengesAndAchievements: String,
		questionsAndConcerns: String,
		dietAndNutrition: String,
		sleepAndRest: String,
		emotionalWellBeing: String,
		futureGoals: String,
		followUpAppointments: Date,
	},
	{ timestamps: true }
);

const PTCheckUpEntry = mongoose.model("PTCheckUpEntry", recoveryCheckUpSchema);

module.exports = PTCheckUpEntry;
