import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import "./praxis-project.css";
import { Dashboard } from "./Dashboard";
import { ProjectInspector } from "./ProjectInspector";
import type {
    DesignToken, SelectedElementInfo, StyleChangesMap, StyleOverride, TokenCategory,
    IconOverride, IconOverrideMap, SelectedIconInfo,
} from "./types";

/* ── Starter tokens (users can add/edit/remove) ─────────── */

const INITIAL_TOKENS: DesignToken[] = [
    // Colors
    { id: "t-c-1", name: "color-bg", category: "color", value: "#f7f7fa" },
    { id: "t-c-2", name: "color-surface", category: "color", value: "#ffffff" },
    { id: "t-c-3", name: "color-text", category: "color", value: "#1a1a24" },
    { id: "t-c-4", name: "color-muted", category: "color", value: "#6b7280" },
    { id: "t-c-5", name: "color-border", category: "color", value: "#e5e7eb" },
    { id: "t-c-6", name: "color-accent", category: "color", value: "#0ea5a0" },

    // Spacing scale (4px base)
    { id: "t-s-1", name: "space-1", category: "space", value: "4px" },
    { id: "t-s-2", name: "space-2", category: "space", value: "8px" },
    { id: "t-s-3", name: "space-3", category: "space", value: "12px" },
    { id: "t-s-4", name: "space-4", category: "space", value: "16px" },
    { id: "t-s-5", name: "space-5", category: "space", value: "24px" },

    // Radius
    { id: "t-r-1", name: "radius-sm", category: "radius", value: "4px" },
    { id: "t-r-2", name: "radius-md", category: "radius", value: "8px" },

    // Font sizes
    { id: "t-f-1", name: "font-sm", category: "font-size", value: "12px" },
    { id: "t-f-2", name: "font-md", category: "font-size", value: "14px" },
    { id: "t-f-3", name: "font-lg", category: "font-size", value: "18px" },
    { id: "t-f-4", name: "font-xl", category: "font-size", value: "24px" },

    // Font weights
    { id: "t-w-1", name: "weight-regular", category: "font-weight", value: "400" },
    { id: "t-w-2", name: "weight-medium", category: "font-weight", value: "500" },
    { id: "t-w-3", name: "weight-bold", category: "font-weight", value: "700" },

    // Line heights
    { id: "t-lh-1", name: "lh-tight", category: "line-height", value: "1.2" },
    { id: "t-lh-2", name: "lh-normal", category: "line-height", value: "1.5" },

    // Font families
    { id: "t-ff-1", name: "font-body", category: "font-family", value: "'Inter', system-ui, sans-serif" },
];

const DEFAULT_NAMES: Record<TokenCategory, string> = {
    color: "color",
    space: "space",
    radius: "radius",
    "font-size": "font",
    "font-weight": "weight",
    "line-height": "lh",
    "font-family": "font-family",
};

const DEFAULT_VALUES: Record<TokenCategory, string> = {
    color: "#000000",
    space: "8px",
    radius: "4px",
    "font-size": "14px",
    "font-weight": "500",
    "line-height": "1.5",
    "font-family": "'Inter', sans-serif",
};

/* ── Component ─────────────────────────────────────────── */

export function PraxisProject() {
    const canvasRef = useRef<HTMLDivElement>(null);
    const dashboardRef = useRef<HTMLDivElement>(null);

    const [collapsed, setCollapsed] = useState(false);
    const [tokens, setTokens] = useState<DesignToken[]>(INITIAL_TOKENS);
    const [changes, setChanges] = useState<StyleChangesMap>({});
    const [selected, setSelected] = useState<SelectedElementInfo | null>(null);
    const [iconOverrides, setIconOverrides] = useState<IconOverrideMap>({});
    const [selectedIcon, setSelectedIcon] = useState<SelectedIconInfo | null>(null);

    const selectorDisplayMap = useRef(new Map<string, string>());

    /* ── Token operations ───────────────────────────────── */

    const nextTokenId = useRef(1000);

    const handleAddToken = useCallback((category: TokenCategory) => {
        setTokens((prev) => {
            const existing = prev.filter((t) => t.category === category).length;
            const id = `t-new-${nextTokenId.current++}`;
            const name = `${DEFAULT_NAMES[category]}-${existing + 1}`;
            return [...prev, { id, name, category, value: DEFAULT_VALUES[category] }];
        });
    }, []);

    const handleUpdateToken = useCallback((id: string, patch: Partial<DesignToken>) => {
        setTokens((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    }, []);

    const handleRemoveToken = useCallback((id: string) => {
        setTokens((prev) => prev.filter((t) => t.id !== id));
        // Unlink any overrides that referenced this token
        setChanges((prev) => {
            const next: StyleChangesMap = {};
            for (const [sel, props] of Object.entries(prev)) {
                const newProps: Record<string, StyleOverride> = {};
                for (const [key, ov] of Object.entries(props)) {
                    if (ov.tokenId !== id) newProps[key] = ov;
                }
                if (Object.keys(newProps).length > 0) next[sel] = newProps;
            }
            return next;
        });
    }, []);

    /* ── Token CSS injection (custom properties on dashboard root) ── */

    const tokenStyleBlock = useMemo(() => {
        const lines = tokens.map((t) => `  --tok-${t.name}: ${t.value};`).join("\n");
        return `.pp-dashboard {\n${lines}\n}`;
    }, [tokens]);

    /* ── Apply per-selector overrides as a <style> block ─ */

    const overrideStyleBlock = useMemo(() => {
        const blocks: string[] = [];
        for (const [selector, props] of Object.entries(changes)) {
            const lines = Object.entries(props).map(([k, v]) => `  ${k}: ${v.value};`).join("\n");
            if (lines) {
                const displaySelector = selectorDisplayMap.current.get(selector) ?? selector;
                // Use the unique selector in actual CSS; display selector is only for readability
                blocks.push(`.pp-dashboard ${selector} {\n${lines}\n}`);
            }
        }
        return blocks.join("\n\n");
    }, [changes]);

    /* ── Selection: click delegation on dashboard ──────── */

    const handleCanvasClick = useCallback((e: React.MouseEvent) => {
        if (collapsed) return;
        const root = dashboardRef.current;
        if (!root) return;
        const target = e.target as Element | null;
        if (!target || !root.contains(target)) return;

        e.preventDefault();
        e.stopPropagation();

        // Icon detection: walk up looking for data-pp-icon-id
        const iconHost = (target as Element).closest("[data-pp-icon-id]") as SVGElement | HTMLElement | null;
        if (iconHost) {
            const id = iconHost.getAttribute("data-pp-icon-id")!;
            const defaults = parseIconDefaults(iconHost);
            if (defaults) {
                setSelected(null);
                setSelectedIcon({ id, defaults });
                return;
            }
        }

        const info = describeElement(target as HTMLElement, root);
        selectorDisplayMap.current.set(info.selector, info.displaySelector);
        setSelectedIcon(null);
        setSelected(info);
    }, [collapsed]);

    // Highlight the selected element or icon in the DOM
    useEffect(() => {
        const root = dashboardRef.current;
        if (!root) return;
        root.querySelectorAll("[data-pp-selected]").forEach((el) => {
            (el as Element).removeAttribute("data-pp-selected");
        });
        if (selected) {
            const el = findElementBySelector(root, selected.selector);
            if (el) el.setAttribute("data-pp-selected", "true");
        } else if (selectedIcon) {
            const el = root.querySelector(`[data-pp-icon-id="${selectedIcon.id}"]`);
            if (el) el.setAttribute("data-pp-selected", "true");
        }
    }, [selected, selectedIcon]);

    const handleDeselect = useCallback(() => {
        setSelected(null);
        setSelectedIcon(null);
    }, []);

    /* ── Icon override handlers ───────────────────────── */

    const handleUpdateIcon = useCallback((patch: Partial<IconOverride>) => {
        if (!selectedIcon) return;
        const id = selectedIcon.id;
        setIconOverrides((prev) => ({
            ...prev,
            [id]: { ...(prev[id] ?? {}), ...patch },
        }));
    }, [selectedIcon]);

    const handleResetIcon = useCallback(() => {
        if (!selectedIcon) return;
        const id = selectedIcon.id;
        setIconOverrides((prev) => {
            const { [id]: _gone, ...rest } = prev;
            return rest;
        });
    }, [selectedIcon]);

    /* ── Property editing for the selected element ─────── */

    const elementOverrides = selected ? (changes[selected.selector] ?? {}) : {};

    const handleSetProperty = useCallback((property: string, value: string, tokenId?: string) => {
        if (!selected) return;
        const sel = selected.selector;
        setChanges((prev) => ({
            ...prev,
            [sel]: { ...(prev[sel] ?? {}), [property]: { value, tokenId } },
        }));
    }, [selected]);

    const handleClearProperty = useCallback((property: string) => {
        if (!selected) return;
        const sel = selected.selector;
        setChanges((prev) => {
            const cur = prev[sel];
            if (!cur) return prev;
            const { [property]: _gone, ...rest } = cur;
            const next = { ...prev };
            if (Object.keys(rest).length === 0) delete next[sel];
            else next[sel] = rest;
            return next;
        });
    }, [selected]);

    /* ── Render ─────────────────────────────────────────── */

    return (
        <div className="pp-root">
            <style dangerouslySetInnerHTML={{ __html: `${tokenStyleBlock}\n\n${overrideStyleBlock}` }} />

            <div
                ref={canvasRef}
                className={`pp-canvas ${!collapsed ? "pp-canvas--inspecting" : ""}`}
                onClick={handleCanvasClick}
            >
                <Dashboard ref={dashboardRef} iconOverrides={iconOverrides} />
            </div>

            <ProjectInspector
                collapsed={collapsed}
                onToggleCollapsed={() => setCollapsed((c) => !c)}
                tokens={tokens}
                onAddToken={handleAddToken}
                onUpdateToken={handleUpdateToken}
                onRemoveToken={handleRemoveToken}
                selectedIcon={selectedIcon}
                iconOverride={selectedIcon ? iconOverrides[selectedIcon.id] : undefined}
                onUpdateIcon={handleUpdateIcon}
                onResetIcon={handleResetIcon}
                selectedElement={selected}
                elementOverrides={elementOverrides}
                onSetProperty={handleSetProperty}
                onClearProperty={handleClearProperty}
                onDeselect={handleDeselect}
            />
        </div>
    );
}

/* ── Element description / selectors ────────────────────── */

function describeElement(el: HTMLElement, root: HTMLElement): SelectedElementInfo {
    const tag = el.tagName.toLowerCase();
    const classes = Array.from(el.classList).filter((c) => !c.startsWith("pp-") && c !== "d-bar--alt" && c !== "");
    const role = el.getAttribute("data-pp-role");
    const textRaw = (el.textContent ?? "").trim().replace(/\s+/g, " ");
    const text = textRaw.length > 60 ? textRaw.slice(0, 57) + "…" : textRaw;

    // Build a unique :nth-of-type selector path from the root
    const parts: string[] = [];
    let cur: HTMLElement | null = el;
    while (cur && cur !== root) {
        const parent: HTMLElement | null = cur.parentElement;
        if (!parent) break;
        const tagName = cur.tagName;
        const same: Element[] = Array.from(parent.children).filter((c: Element) => c.tagName === tagName);
        const idx = same.indexOf(cur) + 1;
        parts.unshift(`${cur.tagName.toLowerCase()}:nth-of-type(${idx})`);
        cur = parent;
    }
    const selector = "> " + parts.join(" > ");

    // Human-friendly display selector
    let display = tag;
    if (classes.length > 0) display += "." + classes.join(".");
    if (role) display += `[data-pp-role="${role}"]`;

    return { selector, displaySelector: display, tag, classes, role, text };
}

function parseIconDefaults(el: Element): IconOverride | null {
    const raw = el.getAttribute("data-pp-icon-defaults");
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw);
        if (typeof parsed?.name === "string"
            && typeof parsed?.size === "number"
            && typeof parsed?.strokeWidth === "number"
            && (parsed.variant === "stroke" || parsed.variant === "fill")) {
            return parsed as IconOverride;
        }
    } catch {
        // fall through
    }
    return null;
}

function findElementBySelector(root: HTMLElement, selector: string): HTMLElement | null {
    // selector is our custom path, parse it
    if (!selector.startsWith("> ")) return null;
    const parts = selector.slice(2).split(" > ");
    let cur: HTMLElement | null = root;
    for (const part of parts) {
        if (!cur) return null;
        const m = part.match(/^([a-z0-9]+):nth-of-type\((\d+)\)$/);
        if (!m) return null;
        const tag = m[1];
        const n = parseInt(m[2], 10);
        const same: Element[] = Array.from(cur.children).filter((c: Element) => c.tagName.toLowerCase() === tag);
        cur = (same[n - 1] as HTMLElement) ?? null;
    }
    return cur;
}
