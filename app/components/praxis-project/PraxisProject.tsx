import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { Scan } from "lucide-react";
import "./praxis-project.css";
import { Dashboard } from "./Dashboard";
import { ProjectInspector } from "./ProjectInspector";
import type {
    DesignToken, SelectedElementInfo, StyleChangesMap, StyleOverride, TokenCategory,
    IconOverride, IconOverrideMap, SelectedIconInfo, TreeNode, BreadcrumbCrumb,
    ChartOverride, ChartOverrideMap, ChartType, SelectedChartInfo,
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

/* ── Local storage persistence ─────────────────────────── */

const STORAGE_KEY = "praxis-project-state-v1";

type PersistedState = {
    tokens: DesignToken[];
    changes: StyleChangesMap;
    iconOverrides: IconOverrideMap;
    chartOverrides: ChartOverrideMap;
};

function loadPersisted(): PersistedState | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as Partial<PersistedState>;
        if (!parsed || typeof parsed !== "object") return null;
        return {
            tokens: Array.isArray(parsed.tokens) ? parsed.tokens : INITIAL_TOKENS,
            changes: parsed.changes && typeof parsed.changes === "object" ? parsed.changes : {},
            iconOverrides: parsed.iconOverrides && typeof parsed.iconOverrides === "object" ? parsed.iconOverrides : {},
            chartOverrides: parsed.chartOverrides && typeof parsed.chartOverrides === "object" ? parsed.chartOverrides : {},
        };
    } catch {
        return null;
    }
}

/* ── Component ─────────────────────────────────────────── */

export function PraxisProject() {
    const canvasRef = useRef<HTMLDivElement>(null);
    const dashboardRef = useRef<HTMLDivElement>(null);

    const [collapsed, setCollapsed] = useState(false);
    // Start with defaults so SSR and the first client render match; hydrate from
    // localStorage in an effect once we're on the client.
    const [tokens, setTokens] = useState<DesignToken[]>(INITIAL_TOKENS);
    const [changes, setChanges] = useState<StyleChangesMap>({});
    const [iconOverrides, setIconOverrides] = useState<IconOverrideMap>({});
    const [chartOverrides, setChartOverrides] = useState<ChartOverrideMap>({});
    const [hydrated, setHydrated] = useState(false);
    const [selectedList, setSelectedList] = useState<SelectedElementInfo[]>([]);
    const [selectedIcon, setSelectedIcon] = useState<SelectedIconInfo | null>(null);
    const [selectedChart, setSelectedChart] = useState<SelectedChartInfo | null>(null);
    const [hoveredSelector, setHoveredSelector] = useState<string | null>(null);
    const [showGuides, setShowGuides] = useState(false);
    const [deepHover, setDeepHover] = useState(false);
    const [hoverStatus, setHoverStatus] = useState<string | null>(null);

    // Hydrate persisted state on mount (client-only).
    useEffect(() => {
        const saved = loadPersisted();
        if (saved) {
            setTokens(saved.tokens);
            setChanges(saved.changes);
            setIconOverrides(saved.iconOverrides);
            setChartOverrides(saved.chartOverrides);
            // Avoid id collisions with restored "t-new-N" tokens.
            let maxId = 1000;
            for (const t of saved.tokens) {
                const m = t.id.match(/^t-new-(\d+)$/);
                if (m) maxId = Math.max(maxId, parseInt(m[1], 10) + 1);
            }
            nextTokenId.current = maxId;
        }
        setHydrated(true);
    }, []);

    // Persist whenever the relevant slices change — but only after hydration,
    // so we don't overwrite saved state with the initial defaults.
    useEffect(() => {
        if (!hydrated) return;
        try {
            const payload: PersistedState = { tokens, changes, iconOverrides, chartOverrides };
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        } catch {
            // Quota exceeded or storage unavailable — ignore.
        }
    }, [hydrated, tokens, changes, iconOverrides, chartOverrides]);
    // Re-build the tree whenever the dashboard mounts; iconOverrides don't change DOM shape.
    const [treeVersion, setTreeVersion] = useState(0);

    const selectorDisplayMap = useRef(new Map<string, string>());

    // Primary selection — the inspector shows this element's existing overrides
    // and writes propagate to all selected elements.
    const primarySelected = selectedList[0] ?? null;

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
        // Also unlink chart options that referenced this token
        setChartOverrides((prev) => {
            const next: ChartOverrideMap = {};
            for (const [chartId, ov] of Object.entries(prev)) {
                const clean: ChartOverride = { ...ov };
                for (const key of ["accent", "base", "seg2", "seg3", "seg4"] as const) {
                    if (clean[key]?.tokenId === id) delete clean[key];
                }
                if (Object.values(clean).some((v) => v !== undefined)) next[chartId] = clean;
            }
            return next;
        });
    }, []);

    /* ── Token CSS injection (custom properties on dashboard root) ── */

    const tokenStyleBlock = useMemo(() => {
        const lines = tokens.map((t) => `  --tok-${t.name}: ${t.value};`).join("\n");
        return `.pp-dashboard {\n${lines}\n}`;
    }, [tokens]);

    /* ── Chart options → per-chart CSS custom properties ─ */
    // Only the fields the user actually set are emitted; everything else
    // falls back to the neutral defaults in the chart CSS.

    const chartStyleBlock = useMemo(() => {
        const blocks: string[] = [];
        for (const [id, ov] of Object.entries(chartOverrides)) {
            const lines: string[] = [];
            if (ov.accent?.value) lines.push(`  --ch-accent: ${ov.accent.value};`);
            if (ov.base?.value) lines.push(`  --ch-base: ${ov.base.value};`, "  --ch-base-op: 1;");
            if (ov.barRadius !== undefined) lines.push(`  --ch-bar-radius: ${ov.barRadius}px;`);
            if (ov.barGap !== undefined) lines.push(`  --ch-bar-gap: ${ov.barGap}px;`);
            if (ov.seg2?.value) lines.push(`  --ch-seg-2: ${ov.seg2.value};`, "  --ch-seg-2-op: 1;");
            if (ov.seg3?.value) lines.push(`  --ch-seg-3: ${ov.seg3.value};`, "  --ch-seg-3-op: 1;");
            if (ov.seg4?.value) lines.push(`  --ch-seg-4: ${ov.seg4.value};`, "  --ch-seg-4-op: 1;");
            if (ov.ringWidth !== undefined) lines.push(`  --ch-ring: ${ov.ringWidth}px;`);
            if (ov.strokeWidth !== undefined) lines.push(`  --ch-stroke: ${ov.strokeWidth};`);
            if (ov.showDots !== undefined) lines.push(`  --ch-dots: ${ov.showDots ? "visible" : "hidden"};`);
            if (ov.showArea !== undefined) lines.push(`  --ch-area: ${ov.showArea ? "visible" : "hidden"};`);
            if (lines.length > 0) {
                blocks.push(`.pp-dashboard [data-pp-chart-scope="${id}"] {\n${lines.join("\n")}\n}`);
            }
        }
        return blocks.join("\n\n");
    }, [chartOverrides]);

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
    // Plain click snaps to the nearest labeled component (data-pp-role /
    // data-pp-chart-id / data-pp-icon-id). Cmd/Ctrl+Click selects the exact
    // leaf element (the generic escape hatch), Alt+Click walks to the parent,
    // Shift+Click toggles multi-select.

    const handleCanvasClick = useCallback((e: React.MouseEvent) => {
        if (collapsed) return;
        const root = dashboardRef.current;
        if (!root) return;
        const target = e.target as Element | null;
        if (!target || !root.contains(target)) return;

        e.preventDefault();
        e.stopPropagation();

        const deep = e.metaKey || e.ctrlKey;

        // Icon / chart snap — only for a plain click (no modifiers).
        if (!deep && !e.altKey && !e.shiftKey) {
            const iconHost = target.closest("[data-pp-icon-id]");
            if (iconHost) {
                const id = iconHost.getAttribute("data-pp-icon-id")!;
                const defaults = parseIconDefaults(iconHost);
                if (defaults) {
                    setSelectedList([]);
                    setSelectedChart(null);
                    setSelectedIcon({ id, defaults });
                    return;
                }
            }
            const chartHost = resolveChartHost(target, root);
            if (chartHost) {
                const info = readChartInfo(chartHost);
                if (info) {
                    setSelectedList([]);
                    setSelectedIcon(null);
                    setSelectedChart(info);
                    return;
                }
            }
        }

        let pickEl: HTMLElement = deep ? (target as HTMLElement) : snapElement(target, root);

        // Alt+Click: walk up. When the click lands inside the current primary
        // selection, climb from that selection — repeated Alt+Clicks keep
        // climbing the tree. Otherwise climb from the (snapped) click target.
        if (e.altKey) {
            let base: HTMLElement = pickEl;
            if (primarySelected) {
                const selEl = findElementBySelector(root, primarySelected.selector);
                if (selEl && (selEl === target || selEl.contains(target))) base = selEl;
            }
            if (base.parentElement && base !== root) {
                pickEl = base.parentElement as HTMLElement;
            }
        }
        if (pickEl === root || !root.contains(pickEl)) return;

        const info = describeElement(pickEl, root);
        selectorDisplayMap.current.set(info.selector, info.displaySelector);
        setSelectedIcon(null);
        setSelectedChart(null);

        if (e.shiftKey) {
            // Toggle in the selection list.
            setSelectedList((prev) => {
                const idx = prev.findIndex((s) => s.selector === info.selector);
                if (idx >= 0) {
                    return prev.filter((_, i) => i !== idx);
                }
                return [...prev, info];
            });
        } else {
            setSelectedList([info]);
        }
    }, [collapsed, primarySelected]);

    /* ── Select all elements sharing a data-pp-role ─────── */

    const handleSelectAllSimilar = useCallback((role: string) => {
        const root = dashboardRef.current;
        if (!root) return;
        const els = Array.from(root.querySelectorAll(`[data-pp-role="${CSS.escape(role)}"]`));
        if (els.length === 0) return;
        const infos = els.map((el) => {
            const info = describeElement(el as HTMLElement, root);
            selectorDisplayMap.current.set(info.selector, info.displaySelector);
            return info;
        });
        setSelectedIcon(null);
        setSelectedChart(null);
        setSelectedList(infos);
    }, []);

    /* ── Hover status (bottom status bar) ───────────────── */

    const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
        if (collapsed) return;
        const root = dashboardRef.current;
        if (!root) return;
        const target = e.target as Element | null;
        if (!target || !root.contains(target)) {
            setHoverStatus(null);
            return;
        }
        const deep = e.metaKey || e.ctrlKey;
        let status: string;
        if (deep) {
            status = describeElement(target as HTMLElement, root).displaySelector;
        } else {
            const iconHost = target.closest("[data-pp-icon-id]");
            const chartHost = iconHost ? null : resolveChartHost(target, root);
            if (iconHost) {
                status = `Icon · ${iconHost.getAttribute("data-pp-icon-id")}`;
            } else if (chartHost) {
                status = `Chart · ${chartHost.getAttribute("data-pp-chart-label") ?? chartHost.getAttribute("data-pp-chart-id")}`;
            } else {
                const info = describeElement(snapElement(target, root), root);
                status = info.role ? `${info.role} · <${info.tag}>` : info.displaySelector;
            }
        }
        setHoverStatus(status);
    }, [collapsed]);

    // Deep-select mode (Cmd/Ctrl held) switches the hover outline to the
    // exact leaf element so the cursor preview matches what a click selects.
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "Meta" || e.key === "Control") setDeepHover(true);
        };
        const up = (e: KeyboardEvent) => {
            if (e.key === "Meta" || e.key === "Control") setDeepHover(false);
        };
        const reset = () => setDeepHover(false);
        window.addEventListener("keydown", down);
        window.addEventListener("keyup", up);
        window.addEventListener("blur", reset);
        return () => {
            window.removeEventListener("keydown", down);
            window.removeEventListener("keyup", up);
            window.removeEventListener("blur", reset);
        };
    }, []);

    // Bump tree version on mount (Dashboard JSX is static, so once is enough).
    useEffect(() => {
        setTreeVersion((v) => v + 1);
    }, []);

    // Build the tree from the rendered dashboard DOM.
    const tree = useMemo<TreeNode | null>(() => {
        const root = dashboardRef.current;
        if (!root) return null;
        return buildTree(root);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [treeVersion]);

    // How many elements share each data-pp-role — drives "Select all similar".
    const roleCounts = useMemo<Record<string, number>>(() => {
        const root = dashboardRef.current;
        if (!root) return {};
        const counts: Record<string, number> = {};
        root.querySelectorAll("[data-pp-role]").forEach((el) => {
            const r = el.getAttribute("data-pp-role")!;
            counts[r] = (counts[r] ?? 0) + 1;
        });
        return counts;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [treeVersion]);

    // Breadcrumb path for the *primary* selection only — multi-select hides it.
    const breadcrumbs = useMemo<BreadcrumbCrumb[]>(() => {
        if (!primarySelected || !tree || selectedList.length > 1) return [];
        const targetSel = primarySelected.selector;
        const path: BreadcrumbCrumb[] = [];
        const walk = (node: TreeNode): boolean => {
            if (node.selector === targetSel) {
                path.push({ selector: node.selector, label: shortLabel(node) });
                return true;
            }
            for (const c of node.children) {
                if (walk(c)) {
                    path.unshift({ selector: node.selector, label: shortLabel(node) });
                    return true;
                }
            }
            return false;
        };
        walk(tree);
        return path;
    }, [primarySelected, tree, selectedList.length]);

    const handleSelectBySelector = useCallback((selector: string, additive = false) => {
        const root = dashboardRef.current;
        if (!root) return;
        const el = findElementBySelector(root, selector);
        if (!el) return;
        const info = describeElement(el, root);
        selectorDisplayMap.current.set(info.selector, info.displaySelector);
        setSelectedIcon(null);
        setSelectedChart(null);
        if (additive) {
            setSelectedList((prev) => {
                const idx = prev.findIndex((s) => s.selector === info.selector);
                if (idx >= 0) return prev.filter((_, i) => i !== idx);
                return [...prev, info];
            });
        } else {
            setSelectedList([info]);
        }
    }, []);

    // Apply hover highlight from the tree panel.
    useEffect(() => {
        const root = dashboardRef.current;
        if (!root) return;
        root.querySelectorAll("[data-pp-hovered]").forEach((el) => {
            (el as Element).removeAttribute("data-pp-hovered");
        });
        if (hoveredSelector) {
            const el = findElementBySelector(root, hoveredSelector);
            if (el) el.setAttribute("data-pp-hovered", "true");
        }
    }, [hoveredSelector]);

    // Highlight all selected elements (or icon) in the DOM.
    useEffect(() => {
        const root = dashboardRef.current;
        if (!root) return;
        root.querySelectorAll("[data-pp-selected]").forEach((el) => {
            (el as Element).removeAttribute("data-pp-selected");
        });
        if (selectedList.length > 0) {
            for (const s of selectedList) {
                const el = findElementBySelector(root, s.selector);
                if (el) el.setAttribute("data-pp-selected", "true");
            }
        } else if (selectedIcon) {
            const el = root.querySelector(`[data-pp-icon-id="${selectedIcon.id}"]`);
            if (el) el.setAttribute("data-pp-selected", "true");
        } else if (selectedChart) {
            const el = root.querySelector(`[data-pp-chart-id="${selectedChart.id}"]`);
            if (el) el.setAttribute("data-pp-selected", "true");
        }
    }, [selectedList, selectedIcon, selectedChart]);

    const handleDeselect = useCallback(() => {
        setSelectedList([]);
        setSelectedIcon(null);
        setSelectedChart(null);
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

    /* ── Chart override handlers ──────────────────────── */

    const handleUpdateChart = useCallback((patch: Partial<ChartOverride>) => {
        if (!selectedChart) return;
        const id = selectedChart.id;
        setChartOverrides((prev) => ({
            ...prev,
            [id]: { ...(prev[id] ?? {}), ...patch },
        }));
    }, [selectedChart]);

    const handleResetChart = useCallback(() => {
        if (!selectedChart) return;
        const id = selectedChart.id;
        setChartOverrides((prev) => {
            const { [id]: _gone, ...rest } = prev;
            return rest;
        });
    }, [selectedChart]);

    /* ── Property editing — writes propagate to every selected element ─── */

    // Inspector reads overrides from the *primary* (first) selection.
    const elementOverrides = primarySelected ? (changes[primarySelected.selector] ?? {}) : {};

    const handleSetProperty = useCallback((property: string, value: string, tokenId?: string) => {
        if (selectedList.length === 0) return;
        setChanges((prev) => {
            const next = { ...prev };
            for (const s of selectedList) {
                const sel = s.selector;
                next[sel] = { ...(next[sel] ?? {}), [property]: { value, tokenId } };
            }
            return next;
        });
    }, [selectedList]);

    const handleClearProperty = useCallback((property: string) => {
        if (selectedList.length === 0) return;
        setChanges((prev) => {
            const next = { ...prev };
            for (const s of selectedList) {
                const sel = s.selector;
                const cur = next[sel];
                if (!cur) continue;
                const { [property]: _gone, ...rest } = cur;
                if (Object.keys(rest).length === 0) delete next[sel];
                else next[sel] = rest;
            }
            return next;
        });
    }, [selectedList]);

    /* ── Render ─────────────────────────────────────────── */

    return (
        <div className="pp-root">
            <style dangerouslySetInnerHTML={{ __html: `${tokenStyleBlock}\n\n${chartStyleBlock}\n\n${overrideStyleBlock}` }} />

            <div className="pp-workbench">
                <div className="pp-canvas-toolbar">
                    <button
                        type="button"
                        className={`pp-toolbar-btn ${showGuides ? "pp-toolbar-btn--active" : ""}`}
                        onClick={() => setShowGuides((g) => !g)}
                        aria-pressed={showGuides}
                        title="Show dashed outlines around every selectable component"
                    >
                        <Scan size={13} />
                        Structure
                    </button>
                </div>

                <div
                    ref={canvasRef}
                    className={[
                        "pp-canvas",
                        !collapsed ? "pp-canvas--inspecting" : "",
                        showGuides ? "pp-canvas--guides" : "",
                        deepHover ? "pp-canvas--deep" : "",
                    ].join(" ")}
                    onClick={handleCanvasClick}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseLeave={() => setHoverStatus(null)}
                >
                    <Dashboard ref={dashboardRef} iconOverrides={iconOverrides} />
                </div>

                <div className="pp-statusbar">
                    <span className="pp-statusbar-target">
                        {!collapsed && hoverStatus ? hoverStatus : ""}
                    </span>
                    <span className="pp-statusbar-hint">
                        Click: component · ⌘/Ctrl+Click: exact element · Alt: parent · Shift: multi
                    </span>
                </div>
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
                selectedChart={selectedChart}
                chartOverride={selectedChart ? chartOverrides[selectedChart.id] : undefined}
                onUpdateChart={handleUpdateChart}
                onResetChart={handleResetChart}
                selectedElement={primarySelected}
                selectedList={selectedList}
                elementOverrides={elementOverrides}
                onSetProperty={handleSetProperty}
                onClearProperty={handleClearProperty}
                onDeselect={handleDeselect}
                onSelectAllSimilar={handleSelectAllSimilar}
                roleCounts={roleCounts}
                tree={tree}
                breadcrumbs={breadcrumbs}
                onSelectBySelector={handleSelectBySelector}
                onHoverSelector={setHoveredSelector}
            />
        </div>
    );
}

/* ── Snap-target resolution ─────────────────────────────── */

/** Nearest labeled ancestor (data-pp-role) of the click target, or the exact
 *  target when nothing above it is labeled — keeps the editor generic. */
function snapElement(target: Element, root: HTMLElement): HTMLElement {
    const roleEl = target.closest("[data-pp-role]");
    if (roleEl && roleEl !== root && root.contains(roleEl)) return roleEl as HTMLElement;
    return target as HTMLElement;
}

/** The chart host (data-pp-chart-id) the click belongs to. Labeled elements
 *  *inside* a chart host (e.g. axis labels) stay individually selectable. */
function resolveChartHost(target: Element, root: HTMLElement): Element | null {
    const chartEl = target.closest("[data-pp-chart-id]");
    if (!chartEl || !root.contains(chartEl)) return null;
    const roleEl = target.closest("[data-pp-role]");
    if (roleEl && roleEl !== chartEl && chartEl.contains(roleEl)) return null;
    return chartEl;
}

function readChartInfo(el: Element): SelectedChartInfo | null {
    const id = el.getAttribute("data-pp-chart-id");
    const type = el.getAttribute("data-pp-chart-type");
    if (!id || (type !== "bar" && type !== "donut" && type !== "sparkline")) return null;
    return { id, type: type as ChartType, label: el.getAttribute("data-pp-chart-label") ?? id };
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

/* ── Tree builder ──────────────────────────────────────── */

function buildTree(root: HTMLElement): TreeNode {
    const build = (el: HTMLElement, depth: number, path: string[]): TreeNode => {
        const tag = el.tagName.toLowerCase();
        const classes = Array.from(el.classList).filter((c) => !c.startsWith("pp-") && c !== "");
        const role = el.getAttribute("data-pp-role");
        const iconId = el.getAttribute("data-pp-icon-id");
        const chartId = el.getAttribute("data-pp-chart-id");

        const childEls = Array.from(el.children).filter(
            (c): c is HTMLElement => c instanceof HTMLElement,
        );

        // Build selector for this node (relative to root)
        const selector = depth === 0 ? "" : "> " + path.join(" > ");

        // Display selector
        let display = tag;
        if (classes.length > 0) display += "." + classes.join(".");
        if (role) display += `[role=${role}]`;

        // Build child nodes, computing each child's nth-of-type slice
        const children: TreeNode[] = [];
        const tagCounts = new Map<string, number>();
        for (const child of childEls) {
            // Skip icon and chart internals: the host appears as a leaf; the
            // dozens of bars/circles/paths inside would only be tree noise.
            if (el.hasAttribute("data-pp-icon-id") || el.hasAttribute("data-pp-chart-id")) break;

            const childTag = child.tagName.toLowerCase();
            const idx = (tagCounts.get(childTag) ?? 0) + 1;
            tagCounts.set(childTag, idx);
            const childPart = `${childTag}:nth-of-type(${idx})`;
            children.push(build(child, depth + 1, [...path, childPart]));
        }

        // Text preview only when leaf (no element children)
        let text = "";
        if (children.length === 0 && !iconId && !chartId) {
            const raw = (el.textContent ?? "").trim().replace(/\s+/g, " ");
            text = raw.length > 40 ? raw.slice(0, 37) + "…" : raw;
        }

        return {
            selector,
            displaySelector: display,
            tag,
            classes,
            role,
            iconId,
            chartId,
            text,
            depth,
            children,
        };
    };

    return build(root, 0, []);
}

function shortLabel(node: TreeNode): string {
    if (node.role) return node.role;
    if (node.classes.length > 0) {
        const c = node.classes.find((x) => x.startsWith("d-")) ?? node.classes[0];
        return "." + c;
    }
    return node.tag;
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
