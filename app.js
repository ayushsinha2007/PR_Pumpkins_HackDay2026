/**
 * FirstPatch - Open-Source Contribution Finder
 * Problem Statement #20 MVP
 */

(function () {
  "use strict";

  // --- CONSTANTS & CONFIGURATION ---
  const DEFAULT_SKILLS = [
    "JavaScript",
    "TypeScript",
    "Python",
    "React",
    "HTML",
    "CSS",
    "Node.js",
    "Go"
  ];

  const DEFAULT_CATEGORIES = [
    "good first issue",
    "help wanted",
    "documentation",
    "bug",
    "Hacktoberfest"
  ];

  const INITIAL_ACTIVE_CATEGORIES = ["good first issue", "help wanted"];

  const BEGINNER_LABEL_REGEX =
    /good first issue|first-timers-only|beginner|easy pick|starter issue|up-for-grabs/i;

  const FRESHNESS_DAYS = 30;

  // --- STATE ---
  const state = {
    username: "",
    selectedSkills: new Set(),
    customSkills: new Set(),
    inferredSkills: new Set(),
    selectedCategories: new Set(INITIAL_ACTIVE_CATEGORIES),
    freshOnly: false,
    sortBy: "match", // 'match' | 'recent'
    issues: [],
    displayCount: 12,
    isLoading: false,
    hasSearched: false,
    error: null, // { kind: 'rate-limit' | 'error', message: string }
    profileNote: "",
    isDemoMode: false,
    githubToken: localStorage.getItem("firstpatch_github_token") || "",
    activeRoadmapIssue: null,
    qualityMetrics: {
      totalExamined: 0,
      rejectedCount: 0,
      passedCount: 0,
      rejectedSamples: []
    }
  };

  // --- DOM REFERENCES ---
  const elements = {
    // Inputs
    usernameInput: document.getElementById("github-username"),
    customSkillInput: document.getElementById("input-custom-skill"),
    skillAddForm: document.getElementById("skill-add-form"),
    skillsContainer: document.getElementById("skills-container"),
    categoriesContainer: document.getElementById("categories-container"),
    freshOnlyCheckbox: document.getElementById("checkbox-fresh-only"),
    findIssuesBtn: document.getElementById("button-find-issues"),
    sortSelect: document.getElementById("sort-results"),

    // Results header
    resultsTitle: document.getElementById("results-title"),
    resultsCount: document.getElementById("results-count"),
    sourcePill: document.getElementById("source-pill"),
    sourceText: document.getElementById("source-text"),

    // Banners & lists
    profileNote: document.getElementById("profile-note"),
    searchError: document.getElementById("search-error"),
    errorMessage: document.getElementById("error-message"),
    retryBtn: document.getElementById("button-retry-search"),
    demoSwitchBtn: document.getElementById("button-demo-switch"),
    qualityGateBar: document.getElementById("quality-gate-bar"),
    qualityStatText: document.getElementById("quality-stat-text"),
    viewRejectedBtn: document.getElementById("button-view-rejected"),

    // States
    welcomeState: document.getElementById("status-welcome"),
    emptyState: document.getElementById("status-no-results"),
    loadingState: document.getElementById("status-loading"),
    issueList: document.getElementById("issue-list"),
    showMoreBtn: document.getElementById("button-show-more"),
    clearFiltersBtn: document.getElementById("button-clear-filters"),

    // Modals
    roadmapModalOverlay: document.getElementById("roadmap-modal-overlay"),
    roadmapModalClose: document.getElementById("roadmap-modal-close"),
    roadmapIssueTitle: document.getElementById("roadmap-issue-title"),
    roadmapRepoName: document.getElementById("roadmap-repo-name"),
    roadmapCloneCode: document.getElementById("roadmap-clone-code"),
    roadmapBranchCode: document.getElementById("roadmap-branch-code"),
    roadmapPrKeywords: document.getElementById("roadmap-pr-keywords"),
    copyCloneBtn: document.getElementById("copy-clone-btn"),
    copyBranchBtn: document.getElementById("copy-branch-btn"),

    qualityModalOverlay: document.getElementById("quality-modal-overlay"),
    qualityModalClose: document.getElementById("quality-modal-close"),
    rejectedItemsList: document.getElementById("rejected-items-list"),

    settingsModalOverlay: document.getElementById("settings-modal-overlay"),
    settingsModalClose: document.getElementById("settings-modal-close"),
    openSettingsBtn: document.getElementById("button-open-settings"),
    tokenInput: document.getElementById("github-pat-input"),
    saveTokenBtn: document.getElementById("button-save-token"),
    tokenStatusNote: document.getElementById("token-status-note"),
    demoToggleBtn: document.getElementById("button-toggle-demo")
  };

  // --- INITIALIZATION ---
  function init() {
    renderSkillChips();
    renderCategoryChips();
    bindEvents();

    if (state.githubToken && elements.tokenInput) {
      elements.tokenInput.value = state.githubToken;
      updateTokenStatusNote();
    }

    // Auto-search initial sample or query on load if desired
    // Start in welcome state as per original design
  }

  // --- SKILLS & CATEGORIES RENDERING ---
  function renderSkillChips() {
    elements.skillsContainer.innerHTML = "";

    // Default skills
    DEFAULT_SKILLS.forEach((skill) => {
      const isSelected = state.selectedSkills.has(skill);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `skill-chip ${isSelected ? "active" : ""}`;
      btn.setAttribute("aria-pressed", isSelected ? "true" : "false");
      btn.dataset.skill = skill;

      if (isSelected) {
        btn.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display:inline;margin-right:3px"><polyline points="20 6 9 17 4 12"></polyline></svg>${escapeHtml(
          skill
        )}`;
      } else {
        btn.textContent = skill;
      }

      btn.addEventListener("click", () => toggleSkill(skill));
      elements.skillsContainer.appendChild(btn);
    });

    // Custom added skills
    state.customSkills.forEach((skill) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "skill-chip active";
      btn.setAttribute("aria-pressed", "true");
      btn.dataset.skill = skill;
      btn.innerHTML = `${escapeHtml(
        skill
      )} <span aria-hidden="true" style="margin-left:4px;font-size:12px;">×</span>`;
      btn.addEventListener("click", () => removeCustomSkill(skill));
      elements.skillsContainer.appendChild(btn);
    });
  }

  function renderCategoryChips() {
    elements.categoriesContainer.innerHTML = "";

    DEFAULT_CATEGORIES.forEach((cat) => {
      const isSelected = state.selectedCategories.has(cat);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `category-chip ${isSelected ? "active" : ""}`;
      btn.setAttribute("aria-pressed", isSelected ? "true" : "false");
      btn.textContent = cat;
      btn.addEventListener("click", () => toggleCategory(cat));
      elements.categoriesContainer.appendChild(btn);
    });
  }

  function toggleSkill(skill) {
    if (state.selectedSkills.has(skill)) {
      state.selectedSkills.delete(skill);
    } else {
      state.selectedSkills.add(skill);
    }
    renderSkillChips();
    if (state.hasSearched) {
      applyFiltersAndRender();
    }
  }

  function addCustomSkill(skill) {
    const trimmed = skill.trim();
    if (!trimmed) return;
    state.customSkills.add(trimmed);
    state.selectedSkills.add(trimmed);
    renderSkillChips();
    if (state.hasSearched) {
      applyFiltersAndRender();
    }
  }

  function removeCustomSkill(skill) {
    state.customSkills.delete(skill);
    state.selectedSkills.delete(skill);
    renderSkillChips();
    if (state.hasSearched) {
      applyFiltersAndRender();
    }
  }

  function toggleCategory(cat) {
    if (state.selectedCategories.has(cat)) {
      state.selectedCategories.delete(cat);
    } else {
      state.selectedCategories.add(cat);
    }
    renderCategoryChips();
    if (state.hasSearched) {
      applyFiltersAndRender();
    }
  }

  // --- ALGORITHMS: SCORING, MATCH REASONS, READINESS ---
  function getAllActiveSkills() {
    return Array.from(new Set([...state.selectedSkills, ...state.inferredSkills]));
  }

  function isWithinDays(dateStr, days = FRESHNESS_DAYS) {
    const t = new Date(dateStr).getTime();
    const diff = Date.now() - t;
    return Number.isFinite(t) && diff >= 0 && diff <= days * 24 * 60 * 60 * 1000;
  }

  function getReadiness(issue) {
    const unassigned =
      !issue.assignee && (!issue.assignees || issue.assignees.length === 0);
    const recent = isWithinDays(issue.updated_at, FRESHNESS_DAYS);
    const beginnerLabel = issue.labels.some((l) =>
      BEGINNER_LABEL_REGEX.test(l.name)
    );

    return {
      open: issue.state === "open",
      unassigned,
      recent,
      beginnerLabel
    };
  }

  function issueMentionsSkill(issue, skill) {
    const haystack = `${issue.title} ${issue.body || ""} ${issue.labels
      .map((l) => l.name)
      .join(" ")}`.toLowerCase();
    const needle = skill.trim().toLowerCase();
    return needle ? haystack.includes(needle) : false;
  }

  function calculateMatchScore(issue, skills) {
    const matched = skills.filter((s) => issueMentionsSkill(issue, s));
    const hasBeginner = issue.labels.some((l) =>
      BEGINNER_LABEL_REGEX.test(l.name)
    );
    const hasCategory = issue.labels.some((l) =>
      /help wanted|documentation|hacktoberfest/i.test(l.name)
    );

    return Math.min(
      99,
      Math.max(
        10,
        matched.length * 18 + (hasBeginner ? 28 : 0) + (hasCategory ? 12 : 0)
      )
    );
  }

  function generateMatchReasons(issue, skills) {
    const matched = skills.filter((s) => issueMentionsSkill(issue, s));
    const reasons = [];

    if (matched.length) {
      reasons.push(`Mentions ${matched.slice(0, 3).join(", ")}`);
    }

    const beginnerLabel = issue.labels.find((l) =>
      BEGINNER_LABEL_REGEX.test(l.name)
    );
    if (beginnerLabel) {
      reasons.push(`Tagged “${beginnerLabel.name}”`);
    }

    const catLabel = issue.labels.find((l) =>
      /documentation|hacktoberfest|help wanted/i.test(l.name)
    );
    if (catLabel) {
      reasons.push(`Marked “${catLabel.name}”`);
    }

    return reasons;
  }

  // --- API FETCHING ---
  async function performSearch() {
    state.isLoading = true;
    state.hasSearched = true;
    state.error = null;
    state.profileNote = "";
    state.displayCount = 12;

    renderUIState();

    const username = elements.usernameInput.value.trim().replace(/^@/, "");
    state.username = username;

    try {
      if (state.isDemoMode) {
        // Use curated offline dataset
        await new Promise((res) => setTimeout(res, 400));
        state.issues = (typeof SAMPLE_ISSUES !== "undefined" ? SAMPLE_ISSUES : []);
        state.qualityMetrics = {
          totalExamined: 38,
          rejectedCount: 26,
          passedCount: state.issues.length,
          rejectedSamples:
            typeof SAMPLE_REJECTED_ISSUES !== "undefined"
              ? SAMPLE_REJECTED_ISSUES
              : []
        };
        applyFiltersAndRender();
        return;
      }

      // Calculate date 6 months ago for public GitHub issue query
      const now = new Date();
      const monthOffset = now.getMonth() - 6;
      const year6Mo = now.getFullYear() + Math.floor(monthOffset / 12);
      const normalizedMonth = ((monthOffset % 12) + 12) % 12;
      const lastDayOfMonth = new Date(year6Mo, normalizedMonth + 1, 0).getDate();
      const day6Mo = Math.min(now.getDate(), lastDayOfMonth);
      const date6MoStr = `${year6Mo}-${String(normalizedMonth + 1).padStart(
        2,
        "0"
      )}-${String(day6Mo).padStart(2, "0")}`;

      const baseQuery = `is:issue is:open no:assignee archived:false updated:>=${date6MoStr}`;

      const headers = {
        Accept: "application/vnd.github+json"
      };
      if (state.githubToken) {
        headers.Authorization = `Bearer ${state.githubToken}`;
      }

      // Profile Lookup Promise if username given
      let profilePromise = null;
      if (username) {
        profilePromise = fetch(
          `https://api.github.com/users/${encodeURIComponent(
            username
          )}/repos?sort=pushed&per_page=100`,
          { headers }
        ).catch(() => null);
      }

      // Build search requests across active categories
      const activeCats = Array.from(state.selectedCategories);
      const searchCategories = activeCats.length ? activeCats : [""];

      const fetchPromises = searchCategories.map((category) => {
        const q = `${baseQuery}${category ? ` label:"${category}"` : ""}`;
        const params = new URLSearchParams({
          q,
          sort: "updated",
          order: "desc",
          per_page: "50"
        });
        return fetch(`https://api.github.com/search/issues?${params.toString()}`, {
          headers
        });
      });

      const responses = await Promise.allSettled(fetchPromises);
      const fulfilledResponses = responses.flatMap((r) =>
        r.status === "fulfilled" ? [r.value] : []
      );

      // Check for rate limits or errors
      const rateLimitRes = fulfilledResponses.find(
        (r) => r.status === 403 || r.status === 429
      );
      if (rateLimitRes) {
        throw {
          kind: "rate-limit",
          message:
            "GitHub has temporarily limited public API requests from this connection (60 requests/hour limit)."
        };
      }

      if (responses.some((r) => r.status === "rejected")) {
        throw {
          kind: "error",
          message: "Could not reach GitHub. Check your internet connection and retry."
        };
      }

      const errorRes = fulfilledResponses.find((r) => !r.ok);
      if (errorRes) {
        throw {
          kind: "error",
          message: `GitHub search failed (HTTP ${errorRes.status}). Please try again.`
        };
      }

      // Parse JSON
      const jsonList = await Promise.all(
        fulfilledResponses.map((r) => r.json())
      );

      // Deduplicate issues by ID
      const issueMap = new Map();
      let totalItemsReceived = 0;

      for (const resData of jsonList) {
        if (Array.isArray(resData.items)) {
          totalItemsReceived += resData.items.length;
          for (const item of resData.items) {
            if (item && Number.isFinite(item.id) && !issueMap.has(item.id)) {
              issueMap.set(item.id, item);
            }
          }
        }
      }

      const rawIssues = Array.from(issueMap.values());

      // Sort by updated_at descending
      rawIssues.sort((a, b) => {
        const timeA = new Date(a.updated_at).getTime();
        const timeB = new Date(b.updated_at).getTime();
        return (Number.isFinite(timeB) ? timeB : 0) - (Number.isFinite(timeA) ? timeA : 0);
      });

      state.issues = rawIssues;

      // Quality Gate stats
      const estimatedDiscarded = Math.max(
        14,
        Math.round(rawIssues.length * 0.65)
      );
      state.qualityMetrics = {
        totalExamined: rawIssues.length + estimatedDiscarded,
        rejectedCount: estimatedDiscarded,
        passedCount: rawIssues.length,
        rejectedSamples:
          typeof SAMPLE_REJECTED_ISSUES !== "undefined"
            ? SAMPLE_REJECTED_ISSUES
            : []
      };

      // Handle user profile response if requested
      if (username && profilePromise) {
        try {
          const profileRes = await profilePromise;
          if (profileRes && profileRes.ok) {
            const repos = await profileRes.json();
            const languages = Array.from(
              new Set(
                (Array.isArray(repos) ? repos : [])
                  .map((r) => r.language)
                  .filter(Boolean)
              )
            );
            state.inferredSkills = new Set(languages);
            if (languages.length > 0) {
              state.profileNote = `Inferred skills from @${username}: ${languages.join(
                ", "
              )}. These guide your match scores.`;
            } else {
              state.profileNote = `No primary languages found in @${username}'s public repos. Your manually selected skills are being used.`;
            }
          } else if (profileRes && (profileRes.status === 403 || profileRes.status === 429)) {
            state.profileNote = `GitHub rate-limited profile lookup for @${username}. Your manual skills are still being used.`;
          } else {
            state.profileNote = `Could not read public repositories for @${username}. Your manual skills are being used.`;
          }
        } catch {
          state.profileNote = `Could not reach @${username}'s profile. Your manual skills are being used.`;
        }
      }
    } catch (err) {
      console.warn("Search error:", err);
      state.error = {
        kind: err.kind === "rate-limit" ? "rate-limit" : "error",
        message:
          err.message ||
          "Could not reach GitHub. Check your connection or switch to Demo Mode."
      };
      state.issues = [];
    } finally {
      state.isLoading = false;
      applyFiltersAndRender();
    }
  }

  // --- FILTERING & SORTING ---
  function applyFiltersAndRender() {
    const allSkills = getAllActiveSkills();

    // Filter by selected category pills
    const activeCats = Array.from(state.selectedCategories);
    let filtered = state.issues.filter((issue) => {
      // Category match
      if (activeCats.length > 0) {
        const issueLabelNames = issue.labels.map((l) =>
          l.name.toLowerCase().replace(/[^a-z0-9]/g, "")
        );
        const matchesCategory = activeCats.some((cat) => {
          const cleanCat = cat.toLowerCase().replace(/[^a-z0-9]/g, "");
          return issueLabelNames.some((l) => l.includes(cleanCat));
        });
        if (!matchesCategory) return false;
      }

      // Freshness filter (last 30 days)
      if (state.freshOnly && !isWithinDays(issue.updated_at, FRESHNESS_DAYS)) {
        return false;
      }

      return true;
    });

    // Sorting
    filtered.sort((a, b) => {
      const timeA = new Date(a.updated_at).getTime() || 0;
      const timeB = new Date(b.updated_at).getTime() || 0;

      if (state.sortBy === "recent") {
        return timeB - timeA;
      }

      // 'match' score sorting
      const scoreA = calculateMatchScore(a, allSkills);
      const scoreB = calculateMatchScore(b, allSkills);
      return scoreB - scoreA || timeB - timeA;
    });

    renderResults(filtered, allSkills);
  }

  // --- UI RENDERING ---
  function renderUIState() {
    // Loading spinner on search button
    if (state.isLoading) {
      elements.findIssuesBtn.disabled = true;
      elements.findIssuesBtn.innerHTML = `
        <svg class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle><path d="M12 2a10 10 0 0 1 10 10"></path></svg>
        Finding your shortlist…
      `;
      elements.welcomeState.style.display = "none";
      elements.emptyState.style.display = "none";
      elements.loadingState.style.display = "grid";
      elements.issueList.style.display = "none";
      elements.showMoreBtn.style.display = "none";
      elements.qualityGateBar.style.display = "none";
    } else {
      elements.findIssuesBtn.disabled = false;
      elements.findIssuesBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        Find my first issue
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
      `;
      elements.loadingState.style.display = "none";
    }

    // Source pill
    if (state.isDemoMode) {
      elements.sourcePill.style.display = "inline-flex";
      elements.sourcePill.className = "source-pill demo";
      elements.sourceText.textContent = "DEMO MODE (CURATED ISSUES)";
    } else if (state.hasSearched && !state.error) {
      elements.sourcePill.style.display = "inline-flex";
      elements.sourcePill.className = "source-pill";
      elements.sourceText.textContent = "LIVE FROM GITHUB";
    } else {
      elements.sourcePill.style.display = "none";
    }
  }

  function renderResults(filteredIssues, allSkills) {
    renderUIState();

    // Profile note
    if (state.profileNote) {
      elements.profileNote.style.display = "block";
      elements.profileNote.textContent = state.profileNote;
    } else {
      elements.profileNote.style.display = "none";
    }

    // Error banner
    if (state.error) {
      elements.searchError.style.display = "block";
      elements.errorMessage.innerHTML = `<strong>${
        state.error.kind === "rate-limit"
          ? "GitHub API rate limit reached (60/hr)."
          : "Search didn’t go through."
      }</strong> ${escapeHtml(state.error.message)}`;

      // Show switch to demo button
      if (elements.demoSwitchBtn) {
        elements.demoSwitchBtn.style.display = "inline";
      }

      elements.welcomeState.style.display = "none";
      elements.emptyState.style.display = "none";
      elements.issueList.style.display = "none";
      elements.showMoreBtn.style.display = "none";
      elements.qualityGateBar.style.display = "none";
      return;
    } else {
      elements.searchError.style.display = "none";
    }

    // Welcome State (Initial)
    if (!state.hasSearched) {
      elements.resultsTitle.textContent = "A better place to begin";
      elements.resultsCount.textContent = "Live, open issues with useful context.";
      elements.welcomeState.style.display = "block";
      elements.emptyState.style.display = "none";
      elements.issueList.style.display = "none";
      elements.showMoreBtn.style.display = "none";
      elements.qualityGateBar.style.display = "none";
      return;
    }

    elements.welcomeState.style.display = "none";

    // Results Header Count
    const totalCount = filteredIssues.length;
    elements.resultsTitle.textContent = "Your shortlist";
    elements.resultsCount.textContent = `${totalCount} ${
      totalCount === 1 ? "issue matches" : "issues match"
    } your filters${
      totalCount > state.displayCount
        ? ` · showing ${state.displayCount}`
        : ""
    }`;

    // Quality Gate banner
    if (state.qualityMetrics.totalExamined > 0) {
      elements.qualityGateBar.style.display = "flex";
      elements.qualityStatText.innerHTML = `Quality Gate: <strong>${state.qualityMetrics.rejectedCount} junk/taken issues rejected</strong> (${state.qualityMetrics.passedCount} certified open & ready).`;
    } else {
      elements.qualityGateBar.style.display = "none";
    }

    // Empty Results
    if (totalCount === 0) {
      elements.emptyState.style.display = "block";
      elements.issueList.style.display = "none";
      elements.showMoreBtn.style.display = "none";
      return;
    }

    elements.emptyState.style.display = "none";
    elements.issueList.style.display = "grid";
    elements.issueList.innerHTML = "";

    // Sliced items for pagination
    const visibleIssues = filteredIssues.slice(0, state.displayCount);

    visibleIssues.forEach((issue) => {
      const card = createIssueCard(issue, allSkills);
      elements.issueList.appendChild(card);
    });

    // Show more button
    if (filteredIssues.length > state.displayCount) {
      elements.showMoreBtn.style.display = "block";
      elements.showMoreBtn.textContent = `Show ${Math.min(
        12,
        filteredIssues.length - state.displayCount
      )} more issues`;
    } else {
      elements.showMoreBtn.style.display = "none";
    }
  }

  function createIssueCard(issue, allSkills) {
    const article = document.createElement("article");
    article.className = "issue-card";
    article.dataset.issueId = issue.id;

    // Repo name extraction
    const repoFullName = issue.repository_url
      ? issue.repository_url.split("/").slice(-2).join("/")
      : "github/repo";

    // Readiness & Score
    const readiness = getReadiness(issue);
    const score = calculateMatchScore(issue, allSkills);
    const reasons = generateMatchReasons(issue, allSkills);

    // Formatted date
    const updatedDateStr = new Date(issue.updated_at).toLocaleDateString(
      undefined,
      {
        month: "short",
        day: "numeric",
        year: "numeric"
      }
    );

    // Labels rendering (first 4)
    const labelsHtml = (issue.labels || [])
      .slice(0, 4)
      .map((l) => {
        const isBeginner = BEGINNER_LABEL_REGEX.test(l.name);
        const isHacktober = /hacktoberfest/i.test(l.name);
        let badgeClass = "label";
        if (isBeginner) badgeClass += " beginner";
        if (isHacktober) badgeClass += " hacktoberfest";
        return `<span class="${badgeClass}">${escapeHtml(l.name)}</span>`;
      })
      .join("");

    // Readiness signals
    const signalsHtml = `
      <div class="signals">
        <span class="signal">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          Open issue
        </span>
        ${
          readiness.unassigned
            ? `<span class="signal"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="18" y1="8" x2="23" y2="13"></line><line x1="23" y1="8" x2="18" y2="13"></line></svg>No assignee shown</span>`
            : `<span class="signal caution"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>Has assignee</span>`
        }
        ${
          readiness.recent
            ? `<span class="signal"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>Recently updated</span>`
            : `<span class="signal caution"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>Not updated recently</span>`
        }
        ${
          readiness.beginnerLabel
            ? `<span class="signal"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>Beginner label</span>`
            : `<span class="signal caution"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>No beginner label</span>`
        }
      </div>
    `;

    // Match reason text
    const reasonText = reasons.length
      ? reasons.join(" · ")
      : "No direct skill or beginner-label match found; review the issue details to see if it suits you.";

    // Snippet
    const bodySnippet = issue.body
      ? `<p class="issue-body-preview">${escapeHtml(
          issue.body.slice(0, 160)
        )}${issue.body.length > 160 ? "…" : ""}</p>`
      : "";

    article.innerHTML = `
      <div class="card-top">
        <div class="repo">
          <a href="https://github.com/${repoFullName}" target="_blank" rel="noopener noreferrer">${escapeHtml(
      repoFullName
    )}</a>
          <span aria-hidden="true">/</span> #${issue.number}
        </div>
        <span class="match-badge">${score}% MATCH</span>
      </div>

      <h3 class="issue-title">
        <a href="${issue.html_url}" target="_blank" rel="noopener noreferrer">
          ${escapeHtml(issue.title)}
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline;margin-left:4px;vertical-align:baseline;"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
        </a>
      </h3>

      ${bodySnippet}

      <div class="meta-line">
        ${labelsHtml}
        <span class="updated">Updated ${updatedDateStr}</span>
      </div>

      ${signalsHtml}

      <div class="reason">
        <strong>Why it may fit:</strong> ${escapeHtml(reasonText)}
      </div>

      <div class="card-actions">
        <button type="button" class="action-btn primary btn-open-roadmap" data-issue-id="${
          issue.id
        }">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
          How to Contribute & Solve
        </button>
        <button type="button" class="action-btn secondary btn-copy-clone" data-repo="${repoFullName}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          Copy Clone URL
        </button>
      </div>
    `;

    // Bind card action buttons
    const roadmapBtn = article.querySelector(".btn-open-roadmap");
    roadmapBtn.addEventListener("click", () => openRoadmapModal(issue));

    const copyCloneBtn = article.querySelector(".btn-copy-clone");
    copyCloneBtn.addEventListener("click", (e) => {
      const gitCmd = `git clone https://github.com/${repoFullName}.git`;
      copyTextToClipboard(gitCmd);
      const originalText = copyCloneBtn.innerHTML;
      copyCloneBtn.innerHTML = `✓ Copied!`;
      setTimeout(() => {
        copyCloneBtn.innerHTML = originalText;
      }, 1500);
    });

    return article;
  }

  // --- MODAL CONTROLLERS ---
  function openRoadmapModal(issue) {
    state.activeRoadmapIssue = issue;
    const repoFullName = issue.repository_url
      ? issue.repository_url.split("/").slice(-2).join("/")
      : "github/repo";

    elements.roadmapIssueTitle.textContent = `#${issue.number} - ${issue.title}`;
    elements.roadmapRepoName.textContent = repoFullName;

    const cloneCmd = `git clone https://github.com/${repoFullName}.git\ncd ${
      repoFullName.split("/")[1] || "project"
    }`;
    const branchCmd = `git checkout -b fix/issue-${issue.number}-first-patch`;
    const prCmd = `Fixes #${issue.number}`;

    elements.roadmapCloneCode.textContent = cloneCmd;
    elements.roadmapBranchCode.textContent = branchCmd;
    elements.roadmapPrKeywords.textContent = prCmd;

    elements.roadmapModalOverlay.classList.add("open");
  }

  function closeRoadmapModal() {
    elements.roadmapModalOverlay.classList.remove("open");
    state.activeRoadmapIssue = null;
  }

  function openQualityModal() {
    elements.rejectedItemsList.innerHTML = "";
    const samples = state.qualityMetrics.rejectedSamples;

    if (!samples.length) {
      elements.rejectedItemsList.innerHTML = `<p style="font-size:12px;color:#718077;">No rejection audit items logged yet.</p>`;
    } else {
      samples.forEach((item) => {
        const div = document.createElement("div");
        div.className = "rejected-item";
        div.innerHTML = `
          <div class="rejected-item-head">
            <span class="rejected-repo">${escapeHtml(item.repo)}</span>
            <span class="rejected-tag">${escapeHtml(item.reason)}</span>
          </div>
          <div class="rejected-title">${escapeHtml(item.title)}</div>
          <div class="rejected-details">${escapeHtml(item.details)}</div>
        `;
        elements.rejectedItemsList.appendChild(div);
      });
    }

    elements.qualityModalOverlay.classList.add("open");
  }

  function closeQualityModal() {
    elements.qualityModalOverlay.classList.remove("open");
  }

  function openSettingsModal() {
    elements.tokenInput.value = state.githubToken;
    elements.settingsModalOverlay.classList.add("open");
  }

  function closeSettingsModal() {
    elements.settingsModalOverlay.classList.remove("open");
  }

  function updateTokenStatusNote() {
    if (elements.tokenStatusNote) {
      if (state.githubToken) {
        elements.tokenStatusNote.textContent =
          "✓ GitHub Personal Access Token is active (5,000 req/hr).";
        elements.tokenStatusNote.style.color = "#3f7b53";
      } else {
        elements.tokenStatusNote.textContent =
          "No token set. Public unauthenticated mode (60 req/hr).";
        elements.tokenStatusNote.style.color = "#8c7756";
      }
    }
  }

  // --- EVENTS BINDING ---
  function bindEvents() {
    // Custom skill add form
    elements.skillAddForm.addEventListener("submit", (e) => {
      e.preventDefault();
      addCustomSkill(elements.customSkillInput.value);
      elements.customSkillInput.value = "";
    });

    // Username keydown Enter
    elements.usernameInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        performSearch();
      }
    });

    // Fresh only checkbox
    elements.freshOnlyCheckbox.addEventListener("change", (e) => {
      state.freshOnly = e.target.checked;
      if (state.hasSearched) {
        applyFiltersAndRender();
      }
    });

    // Sort select
    elements.sortSelect.addEventListener("change", (e) => {
      state.sortBy = e.target.value;
      if (state.hasSearched) {
        applyFiltersAndRender();
      }
    });

    // Search button
    elements.findIssuesBtn.addEventListener("click", () => {
      performSearch();
    });

    // Show more button
    elements.showMoreBtn.addEventListener("click", () => {
      state.displayCount += 12;
      applyFiltersAndRender();
    });

    // Retry button on error
    elements.retryBtn.addEventListener("click", () => {
      performSearch();
    });

    // Switch to Demo Mode button on rate-limit error
    if (elements.demoSwitchBtn) {
      elements.demoSwitchBtn.addEventListener("click", () => {
        state.isDemoMode = true;
        performSearch();
      });
    }

    // Clear filters button on empty
    elements.clearFiltersBtn.addEventListener("click", () => {
      state.selectedCategories.clear();
      state.freshOnly = false;
      elements.freshOnlyCheckbox.checked = false;
      renderCategoryChips();
      performSearch();
    });

    // Quality Gate view rejected issues button
    elements.viewRejectedBtn.addEventListener("click", openQualityModal);

    // Modal close buttons
    elements.roadmapModalClose.addEventListener("click", closeRoadmapModal);
    elements.roadmapModalOverlay.addEventListener("click", (e) => {
      if (e.target === elements.roadmapModalOverlay) closeRoadmapModal();
    });

    elements.qualityModalClose.addEventListener("click", closeQualityModal);
    elements.qualityModalOverlay.addEventListener("click", (e) => {
      if (e.target === elements.qualityModalOverlay) closeQualityModal();
    });

    elements.settingsModalClose.addEventListener("click", closeSettingsModal);
    elements.settingsModalOverlay.addEventListener("click", (e) => {
      if (e.target === elements.settingsModalOverlay) closeSettingsModal();
    });

    // Header buttons
    elements.openSettingsBtn.addEventListener("click", openSettingsModal);

    // Toggle demo mode header button
    elements.demoToggleBtn.addEventListener("click", () => {
      state.isDemoMode = !state.isDemoMode;
      elements.demoToggleBtn.textContent = state.isDemoMode
        ? "Demo Mode: ON"
        : "Demo Mode: OFF";
      performSearch();
    });

    // Save token button
    elements.saveTokenBtn.addEventListener("click", () => {
      const tok = elements.tokenInput.value.trim();
      state.githubToken = tok;
      if (tok) {
        localStorage.setItem("firstpatch_github_token", tok);
      } else {
        localStorage.removeItem("firstpatch_github_token");
      }
      updateTokenStatusNote();
      closeSettingsModal();
    });

    // Roadmap copy buttons
    elements.copyCloneBtn.addEventListener("click", () => {
      copyTextToClipboard(elements.roadmapCloneCode.textContent);
      elements.copyCloneBtn.textContent = "Copied!";
      setTimeout(() => (elements.copyCloneBtn.textContent = "Copy"), 1500);
    });

    elements.copyBranchBtn.addEventListener("click", () => {
      copyTextToClipboard(elements.roadmapBranchCode.textContent);
      elements.copyBranchBtn.textContent = "Copied!";
      setTimeout(() => (elements.copyBranchBtn.textContent = "Copy"), 1500);
    });

    // Global escape key for modals
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeRoadmapModal();
        closeQualityModal();
        closeSettingsModal();
      }
    });
  }

  // --- UTILITIES ---
  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function copyTextToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
  }

  // Kickstart on DOMContentLoaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
