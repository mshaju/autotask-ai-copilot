let tickets = [];

// Load CSV safely
fetch("tickets.csv")
    .then(res => res.text())
    .then(data => {
        tickets = parseCSV(data);
        addMessage(`✅ Loaded ${tickets.length} tickets`, "bot");
    })
    .catch(err => {
        addMessage("❌ Failed to load CSV", "bot");
        console.error(err);
    });

/* ---------------------------
   FIXED CSV PARSER (IMPORTANT)
----------------------------*/
function parseCSV(data) {
    const lines = data.split(/\r?\n/).filter(l => l.trim().length > 0);

    const result = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];

        // split ONLY on first comma
        const firstCommaIndex = line.indexOf(",");

        if (firstCommaIndex === -1) continue;

        const id = line.substring(0, firstCommaIndex).trim();
        const title = line.substring(firstCommaIndex + 1).trim();

        result.push({
            id,
            title
        });
    }

    return result;
}

/* ---------------------------
   SEND MESSAGE
----------------------------*/
function sendMessage() {
    const input = document.getElementById("userInput");
    const query = input.value.trim();

    if (!query) return;

    input.value = "";

    addMessage(query, "user");
    addMessage("🧠 Searching tickets...", "bot");

    setTimeout(() => {
        const results = findSimilar(query);

        if (results.length === 0) {
            addMessage("❌ No matching tickets found.", "bot");
            return;
        }

        let response = `🔎 Found ${results.length} result(s):\n\n`;

        results.slice(0, 7).forEach(t => {
            response += 
`🎫 ID: ${t.id}
📌 Title: ${t.title}
📊 Match: ${t.score}%

----------------------\n`;
        });

        addMessage(response, "bot");
    }, 500);
}

/* ---------------------------
   SMART SEARCH (FIXED)
----------------------------*/
function findSimilar(query) {
    const q = query.toLowerCase().trim();

    return tickets.map(t => {
        let score = 0;

        const title = String(t.title || "").toLowerCase().trim();

        // exact substring match
        if (title.includes(q)) score += 60;

        // word-based match
        const words = q.split(" ");
        words.forEach(w => {
            if (w.length > 2 && title.includes(w)) {
                score += 15;
            }
        });

        // partial match (important for short words like "photo")
        if (q.length > 2 && title.includes(q)) {
            score += 30;
        }

        return { ...t, score };
    })
    .filter(t => t.score > 5)   // IMPORTANT: low threshold
    .sort((a, b) => b.score - a.score);
}

/* ---------------------------
   UI HELPER
----------------------------*/
function addMessage(text, type) {
    const div = document.createElement("div");
    div.className = "message " + type;
    div.innerText = text;

    const chat = document.getElementById("chatBox");
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}
