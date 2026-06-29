---
name: mekorot-ux-designer
description: Specialized UI/UX design skill for Mekorot Water Company interfaces, focusing on the "Libi" design system, layout, and RTL constraints. Supports styling web interfaces, designing dashboards, writing custom CSS, and maintaining consistency with the Mekorot brand.
---

# Mekorot UX Designer Skill

This skill provides the required guidelines, styling tokens, and layout patterns to design, review, or modify interfaces for Mekorot Water Company projects—specifically aligned with the **Libi** internal tool aesthetic.

## Core Directives

### 1. Unified Brand Aesthetics (Libi Design System)
When styling or writing code for Mekorot, you must adhere strictly to the established brand palette and visual guidelines. Do not introduce ad-hoc colors, gradients, or random card shadows.

*   **Primary Palette**:
    *   Mekorot Blue: `#1E5ECC` (Primary brand accent, main buttons, active items)
    *   Mekorot Dark Blue: `#0D1F4E` (Deep blue for titles, dark accents)
    *   Mekorot Light Blue: `#E8F0FB` (Light blue background for tags, containers, and highlights)
    *   Page Background: `#F4F7FC` / `#E2E6EC`
*   **Typography**:
    *   Use the **Rubik** font (`'Rubik', sans-serif`) or `'Noto Sans Hebrew'` as fallback.
*   **Icons**:
    *   Use **Lucide Icons** exclusively for consistency.

For the exact design token values, typography details, and layouts, see the local [design_system.md](file:///c:/Users/amit/OneDrive%20-%20Mekorot%20Water%20Co/Documents/GitHub/libi/.agents/skills/mekorot-ux-designer/references/design_system.md) reference.

### 2. Right-to-Left (RTL) Layout Standards
Mekorot interfaces are primary designed in Hebrew.
*   Always ensure the HTML tag has `dir="rtl"` and `lang="he"`.
*   Ensure text alignment, paddings, and margins are adjusted for RTL (e.g., use `border-left` for sidebars instead of `border-right`, keep standard flex/grid directional logic).
*   Use standard Hebrew terminology for controls (e.g., "שלח הודעה", "ביקורת חדשה", "צרף קובץ").

### 3. Key Brand Assets
When inserting brand images, use the local project assets:
*   Logo (Libi): [libi-logo.png](file:///c:/Users/amit/OneDrive%20-%20Mekorot%20Water%20Co/Documents/GitHub/libi/Demo/libi-logo.png)
*   Logo (Mekorot Dark): [mekorot-logo.png](file:///c:/Users/amit/OneDrive%20-%20Mekorot%20Water%20Co/Documents/GitHub/libi/Demo/mekorot-logo.png)
*   Logo (Mekorot White): [mekorot-logo-white.png](file:///c:/Users/amit/OneDrive%20-%20Mekorot%20Water%20Co/Documents/GitHub/libi/Demo/mekorot-logo-white.png)
*   Input Background Wave: [wave-bg.png](file:///c:/Users/amit/OneDrive%20-%20Mekorot%20Water%20Co/Documents/GitHub/libi/Demo/wave-bg.png)

## Design Checklist

Before delivering code or UI designs, run this checklist:
- [ ] **Colors**: Does the design use *only* the official Mekorot hex codes? No raw blues/greens unless defined.
- [ ] **Aesthetics**: Are cards flat with light borders instead of heavy shadows or glassmorphism?
- [ ] **RTL Flow**: Does the layout read correctly from right to left? Check flex gaps, icons, and text alignments.
- [ ] **Typography**: Is the font set to Rubik or Noto Sans Hebrew?
- [ ] **Assets**: Are logo images referenced correctly using relative/local paths?
