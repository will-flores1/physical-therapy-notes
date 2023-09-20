const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const log = console.log.bind(console);

// Function to generate an entry card
function createEntryCard(entry) {
	const card = document.createElement("div");
	card.classList.add("entry-card");

	// Create card content using entry data fields
	const title = document.createElement("h2");
	title.textContent =
		"Entry Date: " + new Date(entry.createdAt).toLocaleDateString();

	const challengesAndAchievements = document.createElement("p");
	challengesAndAchievements.textContent =
		"Challenges and Achievements: " + entry.challengesAndAchievements;

	// Append content to the card
	card.appendChild(title);
	card.appendChild(challengesAndAchievements);

	return card;
}

const fetchEntries = (async () => {
	try {
		const res = await fetch("http://localhost:3000/api/entries");
		const entries = await res.json();
		console.log(entries);

		const app = $("#app");
		entries.forEach((entry, idx) => {
			const entryCard = createEntryCard(entry);
			app.appendChild(entryCard);
		});
	} catch (error) {
		console.error("Error fetching data:", error);
	}
})();
