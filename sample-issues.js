/**
 * Curated High-Quality Starter Issues
 * Used as reliable fallback when GitHub Public API encounters rate limits,
 * or when the user enables "Demo Mode" for live stage presentations.
 */

const SAMPLE_ISSUES = [
  {
    id: 101001,
    number: 4821,
    title: "Add dark mode toggle to documentation navigation header",
    html_url: "https://github.com/facebook/react/issues/4821",
    repository_url: "https://api.github.com/repos/facebook/react",
    state: "open",
    assignee: null,
    assignees: [],
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    body: "The new documentation website currently defaults to light mode. We need a clean theme toggle in the top navbar that persists the user preference in localStorage. Great beginner task for someone familiar with React and CSS variables.",
    labels: [
      { id: 1, name: "good first issue", color: "7057ff" },
      { id: 2, name: "documentation", color: "0075ca" },
      { id: 3, name: "Hacktoberfest", color: "ff7518" },
      { id: 4, name: "React", color: "61dafb" }
    ],
    comments: 3
  },
  {
    id: 101002,
    number: 1420,
    title: "Improve CLI error message when configuration YAML contains invalid syntax",
    html_url: "https://github.com/pallets/flask/issues/1420",
    repository_url: "https://api.github.com/repos/pallets/flask",
    state: "open",
    assignee: null,
    assignees: [],
    updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    body: "When the user provides an invalid YAML config, the current error dump prints a raw traceback. We want to catch the YamlSyntaxError and output a friendly one-line message with file name and line number in Python.",
    labels: [
      { id: 5, name: "good first issue", color: "7057ff" },
      { id: 6, name: "help wanted", color: "008672" },
      { id: 7, name: "Python", color: "3572A5" },
      { id: 8, name: "Hacktoberfest", color: "ff7518" }
    ],
    comments: 2
  },
  {
    id: 101003,
    number: 893,
    title: "Fix broken hyperlink in Contributing Guide under Windows setup section",
    html_url: "https://github.com/tailwindlabs/tailwindcss/issues/893",
    repository_url: "https://api.github.com/repos/tailwindlabs/tailwindcss",
    state: "open",
    assignee: null,
    assignees: [],
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    body: "The Windows troubleshooting section in CONTRIBUTING.md points to an outdated wiki link that returns 404. Update it to the new documentation link.",
    labels: [
      { id: 9, name: "good first issue", color: "7057ff" },
      { id: 10, name: "documentation", color: "0075ca" },
      { id: 11, name: "CSS", color: "563d7c" }
    ],
    comments: 1
  },
  {
    id: 101004,
    number: 3104,
    title: "Add unit tests for string utility function `truncateWithEllipsis`",
    html_url: "https://github.com/microsoft/TypeScript/issues/3104",
    repository_url: "https://api.github.com/repos/microsoft/TypeScript",
    state: "open",
    assignee: null,
    assignees: [],
    updated_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    body: "We recently refactored the text truncation helper in src/utils/format.ts. We need comprehensive Jest unit tests covering edge cases: empty strings, zero length, unicode characters, and long sentences in TypeScript.",
    labels: [
      { id: 12, name: "good first issue", color: "7057ff" },
      { id: 13, name: "help wanted", color: "008672" },
      { id: 14, name: "TypeScript", color: "2b7489" },
      { id: 15, name: "bug", color: "d73a4a" }
    ],
    comments: 4
  },
  {
    id: 101005,
    number: 2049,
    title: "Ensure mobile drawer navigation closes on Escape key press",
    html_url: "https://github.com/vercel/next.js/issues/2049",
    repository_url: "https://api.github.com/repos/vercel/next.js",
    state: "open",
    assignee: null,
    assignees: [],
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    body: "Accessibility enhancement: Pressing Escape while the mobile sidebar is active does not currently dismiss the menu. We should add an event listener for KeyDown `Escape` in the navigation component using React and JavaScript.",
    labels: [
      { id: 16, name: "good first issue", color: "7057ff" },
      { id: 17, name: "React", color: "61dafb" },
      { id: 18, name: "JavaScript", color: "f1e05a" },
      { id: 19, name: "Hacktoberfest", color: "ff7518" }
    ],
    comments: 2
  },
  {
    id: 101006,
    number: 772,
    title: "Support custom headers in HTTP healthcheck endpoint",
    html_url: "https://github.com/gin-gonic/gin/issues/772",
    repository_url: "https://api.github.com/repos/gin-gonic/gin",
    state: "open",
    assignee: null,
    assignees: [],
    updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    body: "The default ping handler currently only returns 200 OK without allowing custom headers like X-Service-Version. We would like to add an optional middleware or configuration parameter in Go.",
    labels: [
      { id: 20, name: "good first issue", color: "7057ff" },
      { id: 21, name: "Go", color: "00ADD8" },
      { id: 22, name: "help wanted", color: "008672" }
    ],
    comments: 3
  },
  {
    id: 101007,
    number: 5612,
    title: "Add quickstart guide for Docker Compose deployment with PostgreSQL",
    html_url: "https://github.com/fastapi/fastapi/issues/5612",
    repository_url: "https://api.github.com/repos/fastapi/fastapi",
    state: "open",
    assignee: null,
    assignees: [],
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    body: "Many beginners ask for a working docker-compose.yml example connecting FastAPI to a local PostgreSQL container. We should create a docs guide with an example compose file and clear instructions in Python and Markdown.",
    labels: [
      { id: 23, name: "documentation", color: "0075ca" },
      { id: 24, name: "good first issue", color: "7057ff" },
      { id: 25, name: "Python", color: "3572A5" },
      { id: 26, name: "Hacktoberfest", color: "ff7518" }
    ],
    comments: 5
  },
  {
    id: 101008,
    number: 994,
    title: "Validate port number in Node.js server start argument",
    html_url: "https://github.com/expressjs/express/issues/994",
    repository_url: "https://api.github.com/repos/expressjs/express",
    state: "open",
    assignee: null,
    assignees: [],
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    body: "If a negative number or NaN is passed to the port argument, the process crashes ungracefully. Add input sanitation to verify that port is between 1 and 65535 in Node.js and JavaScript.",
    labels: [
      { id: 27, name: "good first issue", color: "7057ff" },
      { id: 28, name: "Node.js", color: "339933" },
      { id: 29, name: "JavaScript", color: "f1e05a" },
      { id: 30, name: "bug", color: "d73a4a" }
    ],
    comments: 2
  },
  {
    id: 101009,
    number: 1102,
    title: "Fix responsive table overflow on mobile viewports",
    html_url: "https://github.com/twbs/bootstrap/issues/1102",
    repository_url: "https://api.github.com/repos/twbs/bootstrap",
    state: "open",
    assignee: null,
    assignees: [],
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    body: "On screens below 480px, wide data tables break horizontal layout instead of smoothly scrolling. We need to apply proper overflow-x auto and -webkit-overflow-scrolling touch styles in HTML and CSS.",
    labels: [
      { id: 31, name: "good first issue", color: "7057ff" },
      { id: 32, name: "CSS", color: "563d7c" },
      { id: 33, name: "HTML", color: "e34c26" },
      { id: 34, name: "Hacktoberfest", color: "ff7518" }
    ],
    comments: 1
  },
  {
    id: 101010,
    number: 1650,
    title: "Refactor deprecated `substr()` call to `slice()` in parser utility",
    html_url: "https://github.com/babel/babel/issues/1650",
    repository_url: "https://api.github.com/repos/babel/babel",
    state: "open",
    assignee: null,
    assignees: [],
    updated_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    body: "String.prototype.substr() is officially deprecated in modern JavaScript standards. We should replace existing occurrences in packages/babel-parser with slice() and verify test suite passes.",
    labels: [
      { id: 35, name: "good first issue", color: "7057ff" },
      { id: 36, name: "JavaScript", color: "f1e05a" },
      { id: 37, name: "TypeScript", color: "2b7489" },
      { id: 38, name: "help wanted", color: "008672" }
    ],
    comments: 3
  },
  {
    id: 101011,
    number: 442,
    title: "Add sample scripts demonstrating file upload with requests library",
    html_url: "https://github.com/psf/requests/issues/442",
    repository_url: "https://api.github.com/repos/psf/requests",
    state: "open",
    assignee: null,
    assignees: [],
    updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
    body: "Beginners often get confused about multipart/form-data vs raw binary streaming. Add a clear, runnable Python recipe in docs/user/quickstart.rst with commentary.",
    labels: [
      { id: 39, name: "good first issue", color: "7057ff" },
      { id: 40, name: "documentation", color: "0075ca" },
      { id: 41, name: "Python", color: "3572A5" },
      { id: 42, name: "Hacktoberfest", color: "ff7518" }
    ],
    comments: 2
  },
  {
    id: 101012,
    number: 830,
    title: "Fix broken button hover elevation in dark theme",
    html_url: "https://github.com/mui/material-ui/issues/830",
    repository_url: "https://api.github.com/repos/mui/material-ui",
    state: "open",
    assignee: null,
    assignees: [],
    updated_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    body: "Contained buttons in dark palette mode show no visual shadow change upon hover due to an overridden box-shadow property. Update the CSS transition rule in React component theme.",
    labels: [
      { id: 43, name: "good first issue", color: "7057ff" },
      { id: 44, name: "React", color: "61dafb" },
      { id: 45, name: "CSS", color: "563d7c" },
      { id: 46, name: "bug", color: "d73a4a" }
    ],
    comments: 4
  }
];

// Sample rejected issues used to demonstrate the Quality Gate filter in action
const SAMPLE_REJECTED_ISSUES = [
  {
    id: 9001,
    repo: "facebook/react #24119",
    title: "Fix hydration mismatch in Suspense boundary on edge runtime",
    reason: "Already Assigned & Active PR",
    details: "Assigned to @acdlite; active linked pull request #24128 opened 3 hours ago."
  },
  {
    id: 9002,
    repo: "django/django #17890",
    title: "Add support for async database connections in PostgreSQL engine",
    reason: "Too Complex for Beginners",
    details: "Tagged 'architecture', 'needs design'; 48 comments and core team review pending."
  },
  {
    id: 9003,
    repo: "old-tools/web-crawler #42",
    title: "Update README installation steps for Ubuntu 18.04",
    reason: "Stale / Abandoned Repository",
    details: "Last commit was in 2021; repository has 0 active maintainers and no activity in 3 years."
  },
  {
    id: 9004,
    repo: "lodash/lodash #5012",
    title: "Typo in clamp documentation example parameter",
    reason: "Claimed in Comments",
    details: "Comment 2 days ago: 'I am working on this PR now, please leave for me'."
  }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { SAMPLE_ISSUES, SAMPLE_REJECTED_ISSUES };
}
