let tickets = [];

// Load CSV on startup
fetch("tickets.csv")
    .then(res => res.text())
    .then(data => {
        tickets = parseCSV(data);
        addMessage("✅ Ticket database loaded. Ask me anything.", "bot");
    });

function parseCSV(data) {
    const rows = data.split("\n").slice(1);

    return rows
        .filter(r => r.trim() !== "")
        .map(r => {
            const [id, title] = r.split(",");
            return {
                id: id?.trim(),
                title: title?.trim()
            };
        });
}

function sendMessage() {
    const input = document.getElementById("userInput");
    const query = input.value.trim();
    input.value = "";

    if (!query) return;

    addMessage(query, "user");

    addMessage("🧠 Searching tickets...", "bot");

    setTimeout(() => {
        const results = findSimilar(query);

        if (results.length === 0) {
            addMessage("❌ No matching tickets found.", "bot");
            return;
        }

        let response = `🔎 Found ${results.length} ticket(s):\n\n`;

        results.slice(0, 5).forEach(t => {
            response += 
`🎫 ID: ${t.id}
📌 Title: ${t.title}
📊 Match: ${t.score}%

----------------------\n`;
        });

        addMessage(response, "bot");

    }, 600);
}

function findSimilar(query) {
    query = query.toLowerCase();

    return tickets.map(t => {
        let score = 0;
        const title = (t.title || "").toLowerCase();

        // exact match boost
        if (title.includes(query)) score += 60;

        // word matching
        const words = query.split(" ");
        words.forEach(w => {
            if (w.length > 2 && title.includes(w)) {
                score += 15;
            }
        });

        return {
            ...t,
            score
        };
    })
    .filter(t => t.score > 10)
    .sort((a, b) => b.score - a.score);
}

function addMessage(text, type) {
    const div = document.createElement("div");
    div.className = "message " + type;
    div.innerText = text;

    document.getElementById("chatBox").appendChild(div);
    document.getElementById("chatBox").scrollTop =
        document.getElementById("chatBox").scrollHeight;
}
