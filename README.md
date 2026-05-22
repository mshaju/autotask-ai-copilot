# 💼 Autotask AI Ticket Finder

This project is a lightweight AI-powered ticket search system built using historical Autotask ticket data.

## 🚀 Features
- Loads ticket data from CSV
- Searches tickets by title similarity
- Returns ranked results with match scores
- Simulates AI-style retrieval (RAG concept)

## 🧠 Concept
Demonstrates Retrieval-Augmented Search (RAS) over IT service management data.

## 📂 Data Format
CSV file with:
- ID
- Title

## 💡 Future Improvements
- Integrate Autotask REST API for real-time ticket retrieval
- Enhance search by analyzing both ticket titles and descriptions/details to return the most relevant matches
- Add semantic AI search using OpenAI embeddings for true meaning-based similarity (not just keyword matching)
- Add chatbot-style interface for conversational ticket querying
- Improve ranking model to prioritise relevance, context, and historical resolution patterns
