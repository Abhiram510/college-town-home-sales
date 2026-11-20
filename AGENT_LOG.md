# Agent log

Add a dated entry each time you work with your AI coding agent, with the newest entry at the bottom. Each entry records what you asked the agent, what it produced, and what you checked or changed. Paste your key prompts in exactly as you typed them. Include at least one time the agent got something wrong, and how you caught it.

Copy this outline for each entry:

```markdown
## YYYY-MM-DD: What you worked on

- **Asked:** "Paste your prompt here."
- **Agent produced:** What it made or changed.
- **Checked or changed:** How you checked it, and what you fixed.
```

## 2026-11-20: Built the college-town home sales homepage

- **Asked:** "Build a clean, modern homepage for my BDI 475 College-Town Home Sales project. Replace the under-construction placeholder, display median home sale prices for each city, exclude sales below $10,000, sort highest to lowest, show qualifying-sale counts, format whole-dollar prices, keep the original dataset files unchanged, work with GitHub Pages, and create a pull request."
- **Agent produced:** A responsive HTML/CSS/JavaScript homepage that loads the CSV, calculates city medians and qualifying-sale counts, and sorts the rankings highest to lowest.
- **Checked or changed:** Compared the browser calculation approach with an independent Python calculation of the CSV and verified the rendered desktop/mobile page in Playwright with no console errors. No original dataset files were changed. An initial README patch used outdated surrounding text and was rejected; I caught the mismatch by re-reading the file and reapplied an exact update.
