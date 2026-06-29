# Mekorot Libi UI/UX Design System Guidelines

This document details the visual style, CSS variables, and layout specs of the **Libi** project for Mekorot. Follow these guidelines to ensure consistency with existing pages.

---

## 1. Design Tokens (CSS Variables)

These are the core variables defined in [styles.css](file:///c:/Users/amit/OneDrive%20-%20Mekorot%20Water%20Co/Documents/GitHub/libi/Demo/styles.css):

```css
:root {
  /* Brand Palette (Mekorot Official Colors) */
  --mekorot-blue:       #1E5ECC; /* Primary Accent */
  --mekorot-blue-dark:  #0D1F4E; /* Typography & Dark Headers */
  --mekorot-blue-mid:   #1448A3; /* Hover Accent */
  --mekorot-blue-light: #E8F0FB; /* Card / Icon container backgrounds */
  --mekorot-blue-pale:  #F4F7FC; /* Subtle background */
  
  /* System Backgrounds */
  --bg:                 #E2E6EC;
  --bg-secondary:       #F4F7FC;
  --bg-tertiary:        #F4F7FC;
  
  /* Text */
  --text:               #0D1B2A; /* Primary */
  --text-secondary:     #3D5166; /* Secondary */
  --text-tertiary:      #7A93B8; /* Muted hint text */
  
  /* Borders */
  --border:             rgba(30, 94, 204, 0.1);
  --border-mid:         rgba(30, 94, 204, 0.18);
  
  /* Border Radii */
  --radius-sm:          8px;
  --radius-md:          12px;
  --radius-lg:          18px;

  /* Fonts */
  --font: 'Rubik', 'Noto Sans Hebrew', 'Segoe UI', Arial, sans-serif;
}
```

---

## 2. Layout & Typography Rules

### RTL (Right-to-Left) Implementation
- Body must be set to `direction: rtl` with the primary document language as Hebrew (`lang="he"`).
- Sidebars are aligned to the right, main content is to the left.
- Use CSS logical properties where appropriate, or verify that horizontal layout margins/borders are flipped:
  - Sidebar border is on the left: `border-left: 1px solid var(--border)`.
  - Icon offsets in lists are on the left side of text.

### Visual Styling Restraints
- **No Background Blur/Glassmorphism**: Avoid `backdrop-filter` or transparent neon elements.
- **Flat Layout**: Use light borders (`var(--border)`) and solid backgrounds instead of heavy, dark box-shadows. Shadows should be subtle (`rgba(13,31,78,0.06)`).
- **Smooth Transitions**: Interactive buttons and inputs should have subtle transitions (`transition: all 0.2s ease`).

---

## 3. Core Component Layouts

### Chat Bubble Layout
*   **User Message**: Aligned to the left (since we read RTL, the user text is on the left side). Background color is `--user-bg` (`#1E5ECC`) with white text.
*   **Agent (Libi) Message**: Aligned to the right. Background color is `--agent-bg` (`#F4F7FC`) with dark text (`#0D1B2A`).

### Input Area Styling
*   The input container must have a relative positioning (`z-index: 1`) to sit cleanly over the background wave `wave-bg.png`.
*   Include standard input helper text below: `הסוכן עלול לטעות. אנא אמת מידע קריטי מול מערכות מקורות הרשמיות.` (The agent can make errors. Please verify critical information against official Mekorot systems).

---

## 4. Status Indicators (Auditing / Tasks)
For workflow tags or states, use the predefined color system:
*   **Running / Active**: Background: `#E8F0FB`, Text: `#1E5ECC` (`--tag-run-text`)
*   **Completed / Successful**: Background: `#E0F6F0`, Text: `#006B4B` (`--tag-done-text`)
*   **Warning / Pending / Wait**: Background: `#FFF3E0`, Text: `#8C5200` (`--tag-wait-text`)
