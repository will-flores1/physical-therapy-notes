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

	// Attach entry id to the card using data-id attribute
	card.setAttribute("data-id", entry._id);

	const challengesAndAchievements = document.createElement("p");
	challengesAndAchievements.textContent =
		"Challenges and Achievements: " + entry.challengesAndAchievements;

	const deleteEntry = document.createElement("button");
	deleteEntry.textContent = "Delete";
	deleteEntry.classList.add("delete-entry-button");
	deleteEntry.addEventListener("click", async () => {
		try {
			const res = await fetch(
				`http://localhost:3000/api/entries/${entry._id}`,
				{
					method: "DELETE",
				}
			);
			const data = await res.json();
			console.log(data);
			window.location.reload();
		} catch (error) {
			console.error(error);
		}
	});

	const editEntry = document.createElement("a");
	editEntry.textContent = "Edit";
	editEntry.classList.add("edit-entry-button");
	editEntry.setAttribute("href", `/entry/edit/${entry._id}`);

	// Append content to the card
	card.appendChild(title);
	card.appendChild(challengesAndAchievements);
	card.appendChild(deleteEntry);
	card.appendChild(editEntry);

	return card;
}

const fetchEntries = (async () => {
	try {
		const res = await fetch("http://localhost:3000/api/entries");
		const entries = await res.json();
		// sort entries by date
		entries.sort((a, b) => {
			if (a.createdAt < b.createdAt) return 1;
			if (a.createdAt > b.createdAt) return -1;
			return 0;
		});
		console.log(entries);

		const app = $("#app");
		entries.forEach((entry, idx) => {
			const entryCard = createEntryCard(entry);
			app.appendChild(entryCard);
			entryCard.addEventListener("click", () => {
				console.log(entryCard.getAttribute("data-id"));
				window.location.href = `/entry/${entryCard.getAttribute(
					"data-id"
				)}`;
			});
		});
	} catch (error) {
		console.error("Error fetching data:", error);
	}
})();
