# Project Rules

## Styling: Tailwind Only

**All component styling must use Tailwind utility classes.**

`global.css` must contain ONLY:
1. Font `@import` (Google Fonts)
2. `@import "tailwindcss"` and `@import "@heroui/styles"`
3. `@theme` block (font family variables)
4. `:root` CSS custom properties (design tokens: colors, spacing, radii, shadows, layout)
5. `[data-theme="dark"]` token overrides
6. `[data-theme="dark"] body` gradient
7. Bare HTML base reset (`box-sizing`, `html/body`, `:focus-visible`, scrollbar styles)
8. HeroUI variable overrides

**Never add component-level CSS classes to `global.css`.** No `.ws-*`, no `.nav-item`, no `.sidebar-*`, no custom component classes of any kind.

### Tailwind v4 CSS Variable Syntax

Reference CSS custom properties directly in Tailwind classes using parentheses:

```tsx
// Correct
className="bg-(--bg-surface) text-(--text-primary) border-(--accent-border)"

// Wrong — don't write CSS classes for these
className="bg-surface text-primary"
```

### Canonical Class Forms

Always use Tailwind's canonical shorthand. The IDE will warn when a class can be simplified:

```tsx
// Correct
"min-w-7"        // not min-w-[28px]
"leading-normal" // not leading-[1.5]
"rounded-sm"     // not rounded-[var(--radius-sm)]
"shadow-(--shadow-sm)" // not shadow-[var(--shadow-sm)]

// Important modifier syntax (Tailwind v4)
"p-0!"   // not !p-0
"w-0!"   // not !w-0
```

## Typography: Minimum Font Size

**The smallest readable text in the app must be 13px (`text-[13px]`).**

This applies to all body text, descriptions, card content, list items, button labels, code blocks, annotation values, and any text a user is expected to read.

**Exceptions** (decorative/functional micro-labels that may be smaller):
- Uppercase monospace section labels (e.g. "THEORIE", "VERGLEICHSBEISPIEL 1 VON 4") — 10px
- Badge/pill text inside compact UI chrome — 11px
- Sidebar nav number badges (tiny numbers inside 20px squares) — 9px
- Browser chrome decorations (DemoWindow title bar, CodeBlock language label) — 10px
- ComparisonPanel status badges — 9px
- Spacing scale data visualization labels — 10px
- Prev/Next navigation micro-labels — 10px

When in doubt, use 13px. Only use smaller sizes for decorative elements that are uppercase, monospace, and not meant to be read as content.

## Module Content Requirements

Every module page must include:

1. **A live practice exercise** using the `<LiveEditor>` component (`app/components/live-editor/LiveEditor.tsx`)
   - One `<LiveEditor>` per module, placed at the Praxisaufgabe (practice) section
   - Provide a `html` prop: a complete, self-contained HTML string with inline `<style>` — the "before" state the user will improve
   - Provide a `controls` prop: an array of `PropertyControl` objects covering the relevant CSS properties for that module's topic
   - Use `defaultMode="controller"` so non-coders start in the visual controls view
   - See `app/routes/demo.live-editor.tsx` for a full example with all control types
   - Do NOT use `<CodeBlock>` for code examples — the LiveEditor replaces that

2. **Comparison panels** showing before/after with `<ComparisonPanel>` for visual demos

3. **At least one exercise block** using `<ExerciseBlock>` with the task description, followed by the `<LiveEditor>`

4. **The standard module structure:**
   - Module badge + title + subtitle
   - `<ModuleMeta>` (duration + practice time)
   - `<LearningGoals>` (learning objectives)
   - Theory sections with `<TheoryCard>` and `<ConceptList>`
   - `<RuleBox>` for key takeaway rules
   - Comparison examples with `<AnnotationGrid>` + `<ExplanationBox>`
   - Practice exercise: `<ExerciseBlock>` (tasks) + `<LiveEditor>` (interactive editor)
   - `<ModuleNav>` at the bottom

### LiveEditor PropertyControl types

```typescript
// slider — numeric range (font-size, padding, gap, border-radius, line-height)
{ type: "slider", min, max, step, unit: "px" | "rem" | "%" | "" }

// color — color picker + hex input
{ type: "color", defaultValue: "#0ea5a0" }

// select — dropdown (font-weight, box-shadow presets, font-family)
{ type: "select", options: [{ label, value }] }

// toggle — on/off switch (border, box-shadow on/off)
{ type: "toggle", defaultValue: "off-value", options: [{ value: "on-value" }] }

// stepper — +/- buttons for precise values (margin, padding steps)
{ type: "stepper", min, max, step, unit: "px" }
```

## Routing (Remix)

- Dot-notation route files map to nested URL paths: `modules.visual-hierarchy.tsx` -> `/modules/visual-hierarchy`
- `_index.tsx` is the index route for a path segment
- Specific content routes (e.g. `modules.visual-hierarchy.tsx`) take precedence over the dynamic `modules.$slug.tsx` catch-all
