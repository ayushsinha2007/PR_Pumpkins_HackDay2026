# PR_Pumpkins_HackDay2026
# 🌱 FirstPatch — Open-Source Contribution Finder

> **Hacktoberfest Hack Day 2026 — Problem Statement #20**  
> *"Other tools show you beginner issues. We show you the ones that are actually open, alive, and right for you, and tell you why."*

[![Hacktoberfest 2026](https://img.shields.io/badge/Hacktoberfest-2026-orange.svg)](https://hacktoberfest.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-blue.svg)](#)

---

## 🎯 The Problem

Beginners want to contribute to open source during Hacktoberfest and beyond, but:
1. **Don't know where to start**: Searching manually on GitHub is overwhelming and confusing.
2. **Too hard, out of date, or already taken**: Many "good first issue" tags are months old, already assigned, have active pull requests, or demand senior architectural knowledge.
3. **No context on fit**: Beginners don't know *why* an issue suits their level or skills.

## ✨ Our Solution: FirstPatch

**FirstPatch** solves all three pain points through an intelligent **Input → Fetch → Filter → Rank → Explain** pipeline:

* 🔍 **Skill Matching**: Enter your GitHub username (automatically discovers your languages from public repos) or choose/add custom skills manually.
* 🛡️ **Intelligent Quality Gate Filter**:
  * Strips out issues that are already claimed, assigned, or have active PRs.
  * Discards stale issues with no activity in over 6 months.
  * Ignores archived repositories.
  * Filters out high-complexity discussions (>25 comments without resolution).
* 💡 **"Why It May Fit" Explanations**: Every single recommendation includes an explicit explanation (e.g. *Mentions React, CSS · Tagged "good first issue" · Marked "Hacktoberfest"*).
* 🚦 **4-Point Readiness Signals**:
  * ✅ **Open Issue**: Verified open status.
  * 👤 **Unassigned**: Verified no assignee or active claim.
  * ⏱️ **Freshness**: Updated recently (within 30 days).
  * 🏷️ **Beginner Label**: Verified `good first issue`, `starter`, or `beginner` tag.
* 🗺️ **First PR Roadmap**: Step-by-step interactive guidance on how to fork, clone, create a dedicated branch, test, and open a PR with auto-closing keywords (`Fixes #123`).
* ⚡ **Stage-Safe Demo Mode & PAT Support**:
  * Seamlessly toggles to curated offline issues if GitHub public API reaches the 60 req/hr unauthenticated limit.
  * Optional Personal Access Token (PAT) input for 5,000 requests/hour directly in browser storage.

---

## 🚀 Quick Start (Running Locally)

FirstPatch is designed with **zero build steps** and **zero node_modules** headaches. It runs instantly on any machine!

### Option 1: Python Server (Recommended)

```bash
cd "HACK DAY 2026"
python3 server.py
```
Then open: **`http://localhost:3000`** in your browser.

### Option 2: Open Directly

Simply double-click `index.html` or open it with your favorite browser (Chrome, Safari, Firefox, Edge).

---

## 📂 Project Architecture

```
HACK DAY 2026/
├── index.html         # Semantic, responsive HTML5 layout with modals & SVG icons
├── style.css          # Editorial typography (Fraunces + DM Sans + DM Mono), warm design system
├── app.js             # Core engine: GitHub API search, skills inferring, quality filter & ranker
├── sample-issues.js   # Curated starter issues & quality gate audit samples for demo resilience
├── server.py          # Zero-dependency Python 3 HTTP server with CORS headers
└── README.md          # Project documentation, pitch deck guide & architecture
```

---

## 🧮 How the Scoring Engine Works

Match scores are calculated dynamically from $10\%$ to $99\%$:

$$\text{Score} = \min\Big(99, \max\big(10, (\text{Matched Skills} \times 18) + (\text{Beginner Label} \times 28) + (\text{Category Tag} \times 12)\big)\Big)$$

* **Skill Mentions**: Scans title, description, and tags for chosen/inferred technologies.
* **Beginner Label**: Rewarded when maintaining teams explicitly classify the issue for new contributors.
* **Category Match**: Bonus for `Hacktoberfest`, `help wanted`, or `documentation`.

---

## 🎤 The 2-Minute Hackathon Pitch

1. **The Hook (15s)**:  
   *"Every Hacktoberfest, thousands of beginners want to make their first open-source contribution. But searching GitHub by hand is painful: 7 out of 10 'good first issues' are either already taken, stale for 2 years, or ridiculously hard."*
2. **The Demo (60s)**:  
   - Type a GitHub username or select Python & React.
   - Click **Find my first issue**.
   - Show the **LIVE FROM GITHUB** badge and the **Quality Gate** counter (*"Notice how we filtered out 26 stale and taken issues!"*).
   - Show the **Why it may fit** explanation and the **Readiness badges**.
   - Click **How to Contribute & Solve** to reveal the **First PR Roadmap** with copyable git commands.
3. **The Differentiator (30s)**:  
   *"Other platforms just dump search results. FirstPatch validates readiness, rejects dead issues, matches your exact skillset, and gives you the exact road to your first pull request."*
4. **Closing (15s)**:  
   *"FirstPatch turns open source from intimidating to welcoming. Thank you!"*

---

## 👥 Hack Day 2026 Team

Built with ❤️ for **Hacktoberfest Hack Day 2026**.
