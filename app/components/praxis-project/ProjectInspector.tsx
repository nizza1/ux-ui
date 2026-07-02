import { useState, useMemo, useEffect, useRef } from "react";
import {
    ChevronLeft, ChevronRight, Plus, Trash2, Palette, Ruler,
    Layers, Type, Sparkles, Settings2, MousePointerClick, Search as SearchIcon,
    RotateCcw, ChevronDown, ChevronRight as ChevronRightSm,
    BarChart3, PieChart, Activity,
} from "lucide-react";
import type {
    DesignToken, SelectedElementInfo, StyleOverride, TokenCategory,
    SelectedIconInfo, IconOverride, IconVariant, TreeNode, BreadcrumbCrumb,
    SelectedChartInfo, ChartOverride,
} from "./types";
import { EDITABLE_PROPERTIES } from "./types";
import { searchIcons, findIcon } from "./icon-catalog";

interface ProjectInspectorProps {
    collapsed: boolean;
    onToggleCollapsed: () => void;

    tokens: DesignToken[];
    onAddToken: (category: TokenCategory) => void;
    onUpdateToken: (id: string, patch: Partial<DesignToken>) => void;
    onRemoveToken: (id: string) => void;

    selectedElement: SelectedElementInfo | null;
    selectedList: SelectedElementInfo[];
    elementOverrides: Record<string, StyleOverride>;
    onSetProperty: (property: string, value: string, tokenId?: string) => void;
    onClearProperty: (property: string) => void;
    onDeselect: () => void;
    onSelectAllSimilar: (role: string) => void;
    /** data-pp-role → number of elements carrying it */
    roleCounts: Record<string, number>;

    /** Icon-edit mode (mutually exclusive with element-edit) */
    selectedIcon: SelectedIconInfo | null;
    iconOverride: Partial<IconOverride> | undefined;
    onUpdateIcon: (patch: Partial<IconOverride>) => void;
    onResetIcon: () => void;

    /** Chart-edit mode (mutually exclusive with element/icon-edit) */
    selectedChart: SelectedChartInfo | null;
    chartOverride: ChartOverride | undefined;
    onUpdateChart: (patch: Partial<ChartOverride>) => void;
    onResetChart: () => void;

    /** Layers panel: live DOM tree + breadcrumb + hover preview */
    tree: TreeNode | null;
    breadcrumbs: BreadcrumbCrumb[];
    onSelectBySelector: (selector: string, additive?: boolean) => void;
    onHoverSelector: (selector: string | null) => void;
}

type TabId = "design-system" | "element";

const CATEGORY_META: Record<TokenCategory, { label: string; icon: typeof Palette; placeholder: string; }> = {
    color: { label: "Colors", icon: Palette, placeholder: "#0ea5a0" },
    space: { label: "Spacing", icon: Ruler, placeholder: "16px" },
    radius: { label: "Radius", icon: Layers, placeholder: "8px" },
    "font-size": { label: "Font sizes", icon: Type, placeholder: "14px" },
    "font-weight": { label: "Font weights", icon: Type, placeholder: "500" },
    "line-height": { label: "Line heights", icon: Type, placeholder: "1.5" },
    "font-family": { label: "Font families", icon: Type, placeholder: "'Inter', sans-serif" },
};

const SYSTEM_CATEGORIES: TokenCategory[] = [
    "color", "space", "radius", "font-size", "font-weight", "line-height", "font-family",
];

export function ProjectInspector(props: ProjectInspectorProps) {
    const {
        collapsed, onToggleCollapsed,
        tokens, onAddToken, onUpdateToken, onRemoveToken,
        selectedElement, selectedList, elementOverrides, onSetProperty, onClearProperty, onDeselect,
        onSelectAllSimilar, roleCounts,
        selectedIcon, iconOverride, onUpdateIcon, onResetIcon,
        selectedChart, chartOverride, onUpdateChart, onResetChart,
        tree, breadcrumbs, onSelectBySelector, onHoverSelector,
    } = props;

    const [activeTab, setActiveTab] = useState<TabId>("design-system");

    // Selecting anything on the canvas jumps to the editing tab, so a click
    // always shows its editor without an extra tab switch.
    const selectionKey = selectedElement?.selector ?? selectedIcon?.id ?? selectedChart?.id ?? null;
    useEffect(() => {
        if (selectionKey) setActiveTab("element");
    }, [selectionKey]);
    const [openCats, setOpenCats] = useState<Record<TokenCategory, boolean>>({
        color: true,
        space: true,
        radius: false,
        "font-size": false,
        "font-weight": false,
        "line-height": false,
        "font-family": false,
    });

    // When an icon or chart is selected, the element tab becomes its editor.
    const effectiveTab: TabId = activeTab;
    const anySelection = selectedList.length > 0 || Boolean(selectedIcon) || Boolean(selectedChart);

    return (
        <>
            <aside className={`pp-inspector ${collapsed ? "pp-inspector--collapsed" : ""}`}>
                {!collapsed && (
                    <>
                        <div className="pp-inspector-tabs">
                            <button
                                type="button"
                                className={`pp-tab ${effectiveTab === "design-system" ? "pp-tab--active" : ""}`}
                                onClick={() => setActiveTab("design-system")}
                            >
                                <Sparkles size={13} />
                                Design System
                            </button>
                            <button
                                type="button"
                                className={`pp-tab ${effectiveTab === "element" ? "pp-tab--active" : ""}`}
                                onClick={() => setActiveTab("element")}
                            >
                                <Settings2 size={13} />
                                {selectedIcon ? "Icon" : selectedChart ? "Chart" : "Element"}
                                {anySelection && (
                                    <span style={{
                                        width: 6, height: 6, borderRadius: "50%",
                                        background: "var(--pp-accent)", display: "inline-block",
                                    }} />
                                )}
                            </button>
                        </div>

                        <div className="pp-inspector-body">
                            {effectiveTab === "design-system" ? (
                                <DesignSystemTab
                                    tokens={tokens}
                                    openCats={openCats}
                                    setOpenCats={setOpenCats}
                                    onAddToken={onAddToken}
                                    onUpdateToken={onUpdateToken}
                                    onRemoveToken={onRemoveToken}
                                />
                            ) : selectedIcon ? (
                                <IconEditorTab
                                    selectedIcon={selectedIcon}
                                    override={iconOverride}
                                    onUpdateIcon={onUpdateIcon}
                                    onResetIcon={onResetIcon}
                                    onDeselect={onDeselect}
                                />
                            ) : selectedChart ? (
                                <ChartEditorTab
                                    selectedChart={selectedChart}
                                    override={chartOverride}
                                    tokens={tokens}
                                    onUpdateChart={onUpdateChart}
                                    onResetChart={onResetChart}
                                    onDeselect={onDeselect}
                                />
                            ) : (
                                <ElementTab
                                    selectedElement={selectedElement}
                                    selectedList={selectedList}
                                    tokens={tokens}
                                    overrides={elementOverrides}
                                    onSetProperty={onSetProperty}
                                    onClearProperty={onClearProperty}
                                    onDeselect={onDeselect}
                                    onSelectAllSimilar={onSelectAllSimilar}
                                    roleCounts={roleCounts}
                                    tree={tree}
                                    breadcrumbs={breadcrumbs}
                                    onSelectBySelector={onSelectBySelector}
                                    onHoverSelector={onHoverSelector}
                                />
                            )}
                        </div>
                    </>
                )}
            </aside>

            <button
                type="button"
                className="pp-inspector-toggle"
                onClick={onToggleCollapsed}
                title={collapsed ? "Expand inspector" : "Collapse inspector"}
                aria-label={collapsed ? "Expand inspector" : "Collapse inspector"}
            >
                {collapsed ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </button>
        </>
    );
}

/* ── Design System Tab ─────────────────────────────────── */

function DesignSystemTab({
    tokens, openCats, setOpenCats, onAddToken, onUpdateToken, onRemoveToken,
}: {
    tokens: DesignToken[];
    openCats: Record<TokenCategory, boolean>;
    setOpenCats: (fn: (prev: Record<TokenCategory, boolean>) => Record<TokenCategory, boolean>) => void;
    onAddToken: (category: TokenCategory) => void;
    onUpdateToken: (id: string, patch: Partial<DesignToken>) => void;
    onRemoveToken: (id: string) => void;
}) {
    return (
        <>
            <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--pp-border)", fontSize: 11.5, color: "var(--pp-text-tertiary)", lineHeight: 1.5 }}>
                Define the scales, palettes and type of your design system. Then select an element and assign these values.
            </div>

            {SYSTEM_CATEGORIES.map((cat) => {
                const meta = CATEGORY_META[cat];
                const Icon = meta.icon;
                const items = tokens.filter((t) => t.category === cat);
                const open = openCats[cat];
                return (
                    <div className="pp-section" key={cat}>
                        <button
                            type="button"
                            className="pp-section-header"
                            onClick={() => setOpenCats((prev) => ({ ...prev, [cat]: !prev[cat] }))}
                            aria-expanded={open}
                        >
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                                <Icon size={12} />
                                {meta.label}
                                <span style={{ color: "var(--pp-text-ghost)", fontWeight: 400 }}>({items.length})</span>
                            </span>
                            <span className={`pp-chevron ${open ? "" : "pp-chevron--closed"}`}>▾</span>
                        </button>

                        {open && (
                            <div className="pp-section-body">
                                {cat === "color" && items.length > 0 && (
                                    <div className="pp-swatch-strip">
                                        {items.map((t) => (
                                            <span
                                                key={t.id}
                                                className="pp-swatch-chip"
                                                style={{ background: t.value }}
                                                title={`${t.name}: ${t.value}`}
                                            />
                                        ))}
                                    </div>
                                )}
                                {cat === "space" && items.length > 0 && (
                                    <div className="pp-scale-preview">
                                        {items.map((t) => {
                                            const px = parseFloat(t.value) || 0;
                                            return <span key={t.id} className="pp-scale-bar" style={{ width: 6, height: Math.min(28, 4 + px) }} title={`${t.name}: ${t.value}`} />;
                                        })}
                                    </div>
                                )}

                                {items.map((t) => (
                                    <TokenRow
                                        key={t.id}
                                        token={t}
                                        onChange={(patch) => onUpdateToken(t.id, patch)}
                                        onRemove={() => onRemoveToken(t.id)}
                                    />
                                ))}

                                <button type="button" className="pp-add-token" onClick={() => onAddToken(cat)}>
                                    <Plus size={11} />
                                    Add {meta.label.toLowerCase().replace(/s$/, "")}
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}
        </>
    );
}

function TokenRow({
    token, onChange, onRemove,
}: {
    token: DesignToken;
    onChange: (patch: Partial<DesignToken>) => void;
    onRemove: () => void;
}) {
    const isColor = token.category === "color";
    return (
        <div className="pp-token-row">
            <input
                className="pp-token-input pp-token-label"
                style={{ fontFamily: "var(--pp-font-mono)", fontSize: 11 }}
                value={token.name}
                onChange={(e) => onChange({ name: e.target.value })}
                spellCheck={false}
            />
            {isColor ? (
                <div className="pp-token-color-row">
                    <input
                        type="color"
                        className="pp-color-swatch"
                        value={toHexSafe(token.value)}
                        onChange={(e) => onChange({ value: e.target.value })}
                    />
                    <input
                        className="pp-token-input"
                        value={token.value}
                        onChange={(e) => onChange({ value: e.target.value })}
                        spellCheck={false}
                    />
                </div>
            ) : (
                <input
                    className="pp-token-input"
                    value={token.value}
                    onChange={(e) => onChange({ value: e.target.value })}
                    spellCheck={false}
                />
            )}
            <button type="button" className="pp-icon-btn" onClick={onRemove} title="Remove">
                <Trash2 size={12} />
            </button>
        </div>
    );
}

function toHexSafe(v: string): string {
    v = v.trim();
    if (/^#[0-9a-f]{6}$/i.test(v)) return v;
    if (/^#[0-9a-f]{3}$/i.test(v)) {
        return "#" + v.slice(1).split("").map((c) => c + c).join("");
    }
    return "#000000";
}

/* ── Element Tab ────────────────────────────────────────── */

function ElementTab({
    selectedElement, selectedList, tokens, overrides, onSetProperty, onClearProperty, onDeselect,
    onSelectAllSimilar, roleCounts,
    tree, breadcrumbs, onSelectBySelector, onHoverSelector,
}: {
    selectedElement: SelectedElementInfo | null;
    selectedList: SelectedElementInfo[];
    tokens: DesignToken[];
    overrides: Record<string, StyleOverride>;
    onSetProperty: (property: string, value: string, tokenId?: string) => void;
    onClearProperty: (property: string) => void;
    onDeselect: () => void;
    onSelectAllSimilar: (role: string) => void;
    roleCounts: Record<string, number>;
    tree: TreeNode | null;
    breadcrumbs: BreadcrumbCrumb[];
    onSelectBySelector: (selector: string, additive?: boolean) => void;
    onHoverSelector: (selector: string | null) => void;
}) {
    const selectedSet = useMemo(() => new Set(selectedList.map((s) => s.selector)), [selectedList]);
    return (
        <>
            <LayersPanel
                tree={tree}
                selectedSelector={selectedElement?.selector ?? null}
                selectedSet={selectedSet}
                onSelectBySelector={onSelectBySelector}
                onHoverSelector={onHoverSelector}
            />

            {!selectedElement ? (
                <div className="pp-empty">
                    <div className="pp-empty-icon">
                        <MousePointerClick size={20} />
                    </div>
                    <div className="pp-empty-title">No element selected</div>
                    <div className="pp-empty-text">
                        Click a component in the dashboard or pick one from Layers above.
                        ⌘/Ctrl+Click selects the exact element, Alt+Click the parent,
                        Shift+Click multi-selects. Charts and icons open their own editor.
                    </div>
                </div>
            ) : (
                <ElementBody
                    selectedElement={selectedElement}
                    selectedList={selectedList}
                    breadcrumbs={breadcrumbs}
                    tokens={tokens}
                    overrides={overrides}
                    onSetProperty={onSetProperty}
                    onClearProperty={onClearProperty}
                    onDeselect={onDeselect}
                    onSelectAllSimilar={onSelectAllSimilar}
                    roleCounts={roleCounts}
                    onSelectBySelector={onSelectBySelector}
                />
            )}
        </>
    );
}

function ElementBody({
    selectedElement, selectedList, breadcrumbs, tokens, overrides,
    onSetProperty, onClearProperty, onDeselect, onSelectAllSimilar, roleCounts, onSelectBySelector,
}: {
    selectedElement: SelectedElementInfo;
    selectedList: SelectedElementInfo[];
    breadcrumbs: BreadcrumbCrumb[];
    tokens: DesignToken[];
    overrides: Record<string, StyleOverride>;
    onSetProperty: (property: string, value: string, tokenId?: string) => void;
    onClearProperty: (property: string) => void;
    onDeselect: () => void;
    onSelectAllSimilar: (role: string) => void;
    roleCounts: Record<string, number>;
    onSelectBySelector: (selector: string, additive?: boolean) => void;
}) {
    const isMulti = selectedList.length > 1;
    const similarCount = selectedElement.role ? (roleCounts[selectedElement.role] ?? 0) : 0;
    return (
        <>
            <div className="pp-element-head">
                {isMulti && (
                    <div className="pp-multi-head">
                        <div className="pp-multi-count">
                            <span className="pp-multi-badge">{selectedList.length}</span>
                            <span>elements selected — edits apply to all</span>
                            <button
                                type="button"
                                className="pp-icon-btn"
                                onClick={onDeselect}
                                title="Clear selection"
                                style={{ marginLeft: "auto" }}
                            >
                                ×
                            </button>
                        </div>
                        <div className="pp-multi-list">
                            {selectedList.map((s) => (
                                <button
                                    key={s.selector}
                                    type="button"
                                    className="pp-multi-chip"
                                    onClick={() => onSelectBySelector(s.selector, true)}
                                    title="Remove from selection"
                                >
                                    {chipLabel(s)}
                                    <span className="pp-multi-chip-x">×</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {!isMulti && breadcrumbs.length > 1 && (
                    <div className="pp-breadcrumb" aria-label="Element path">
                        {breadcrumbs.map((c, i) => {
                            const isLast = i === breadcrumbs.length - 1;
                            return (
                                <span key={c.selector || "root"} className="pp-breadcrumb-row">
                                    {i > 0 && <span className="pp-breadcrumb-sep">›</span>}
                                    {isLast ? (
                                        <span className="pp-breadcrumb-crumb pp-breadcrumb-crumb--current">
                                            {c.label}
                                        </span>
                                    ) : (
                                        <button
                                            type="button"
                                            className="pp-breadcrumb-crumb"
                                            onClick={() => c.selector && onSelectBySelector(c.selector)}
                                            disabled={!c.selector}
                                            title={c.selector ? "Select this ancestor" : "Dashboard root"}
                                        >
                                            {c.label}
                                        </button>
                                    )}
                                </span>
                            );
                        })}
                    </div>
                )}

                {!isMulti && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                        <div style={{ minWidth: 0, flex: 1 }}>
                            <div className="pp-element-tag">
                                &lt;{selectedElement.tag}&gt;
                                {selectedElement.classes.length > 0 && (
                                    <span style={{ color: "var(--pp-text-tertiary)", fontWeight: 400 }}>
                                        {selectedElement.classes.map((c) => `.${c}`).join("")}
                                    </span>
                                )}
                            </div>
                            {selectedElement.role && (
                                <div style={{ fontSize: 10.5, color: "var(--pp-text-tertiary)", marginTop: 2 }}>
                                    role: <strong>{selectedElement.role}</strong>
                                </div>
                            )}
                            {selectedElement.text && (
                                <div className="pp-element-path" style={{ marginTop: 4 }}>
                                    “{selectedElement.text}”
                                </div>
                            )}
                        </div>
                        <button type="button" className="pp-icon-btn" onClick={onDeselect} title="Deselect">
                            ×
                        </button>
                    </div>
                )}

                {!isMulti && selectedElement.role && similarCount > 1 && (
                    <button
                        type="button"
                        className="pp-select-similar"
                        onClick={() => onSelectAllSimilar(selectedElement.role!)}
                        title={`Select every element with role "${selectedElement.role}" and edit them together`}
                    >
                        <Layers size={13} />
                        Select all similar ({similarCount})
                    </button>
                )}
            </div>

            <PropsGroup
                title="Typography"
                keys={["font-size", "font-weight", "line-height", "font-family", "letter-spacing", "text-transform", "color"]}
                tokens={tokens}
                overrides={overrides}
                onSetProperty={onSetProperty}
                onClearProperty={onClearProperty}
            />
            <PropsGroup
                title="Fill & Border"
                keys={["background-color", "border-color", "border-width", "border-radius"]}
                tokens={tokens}
                overrides={overrides}
                onSetProperty={onSetProperty}
                onClearProperty={onClearProperty}
                defaultOpen={false}
            />
            <PropsGroup
                title="Spacing"
                keys={["padding", "margin", "gap"]}
                tokens={tokens}
                overrides={overrides}
                onSetProperty={onSetProperty}
                onClearProperty={onClearProperty}
                defaultOpen={false}
            />
        </>
    );
}

/* ── Layers panel (live DOM tree) ──────────────────────── */

function chipLabel(s: SelectedElementInfo): string {
    if (s.role) return s.role;
    if (s.classes.length > 0) {
        const c = s.classes.find((x) => x.startsWith("d-")) ?? s.classes[0];
        return "." + c;
    }
    return s.tag;
}

function LayersPanel({
    tree, selectedSelector, selectedSet, onSelectBySelector, onHoverSelector,
}: {
    tree: TreeNode | null;
    selectedSelector: string | null;
    selectedSet: Set<string>;
    onSelectBySelector: (selector: string, additive?: boolean) => void;
    onHoverSelector: (selector: string | null) => void;
}) {
    const [open, setOpen] = useState(true);
    const [expanded, setExpanded] = useState<Set<string>>(() => new Set([""])); // root expanded
    const rowRefs = useRef(new Map<string, HTMLButtonElement>());

    // Auto-expand ancestors of the selection so the row becomes visible.
    useEffect(() => {
        if (!selectedSelector || !tree) return;
        const next = new Set(expanded);
        const ancestors = collectAncestors(tree, selectedSelector);
        let changed = false;
        for (const a of ancestors) {
            if (!next.has(a)) { next.add(a); changed = true; }
        }
        if (changed) setExpanded(next);
        // Scroll selected row into view (after expansion paint).
        const id = window.requestAnimationFrame(() => {
            const row = rowRefs.current.get(selectedSelector);
            if (row) row.scrollIntoView({ block: "nearest" });
        });
        return () => window.cancelAnimationFrame(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedSelector, tree]);

    const toggleNode = (sel: string) => {
        setExpanded((prev) => {
            const next = new Set(prev);
            if (next.has(sel)) next.delete(sel); else next.add(sel);
            return next;
        });
    };

    return (
        <div className="pp-section">
            <button
                type="button"
                className="pp-section-header"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
            >
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <Layers size={12} />
                    Layers
                </span>
                <span className={`pp-chevron ${open ? "" : "pp-chevron--closed"}`}>▾</span>
            </button>
            {open && (
                <div
                    className="pp-tree"
                    onMouseLeave={() => onHoverSelector(null)}
                >
                    {!tree ? (
                        <div className="pp-tree-empty">Loading…</div>
                    ) : (
                        tree.children.map((c) => (
                            <TreeRow
                                key={c.selector}
                                node={c}
                                expanded={expanded}
                                onToggle={toggleNode}
                                selectedSelector={selectedSelector}
                                selectedSet={selectedSet}
                                onSelectBySelector={onSelectBySelector}
                                onHoverSelector={onHoverSelector}
                                rowRefs={rowRefs}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

function TreeRow({
    node, expanded, onToggle, selectedSelector, selectedSet,
    onSelectBySelector, onHoverSelector, rowRefs,
}: {
    node: TreeNode;
    expanded: Set<string>;
    onToggle: (sel: string) => void;
    selectedSelector: string | null;
    selectedSet: Set<string>;
    onSelectBySelector: (selector: string, additive?: boolean) => void;
    onHoverSelector: (selector: string | null) => void;
    rowRefs: React.MutableRefObject<Map<string, HTMLButtonElement>>;
}) {
    const isPrimary = selectedSelector === node.selector;
    const isInSelection = selectedSet.has(node.selector);
    const hasChildren = node.children.length > 0;
    const isOpen = expanded.has(node.selector);
    const indent = 6 + node.depth * 12;

    return (
        <>
            <button
                type="button"
                ref={(el) => {
                    if (el) rowRefs.current.set(node.selector, el);
                    else rowRefs.current.delete(node.selector);
                }}
                className={`pp-tree-row ${isPrimary ? "pp-tree-row--selected" : ""} ${isInSelection && !isPrimary ? "pp-tree-row--selected-also" : ""}`}
                style={{ paddingLeft: indent }}
                onClick={(e) => onSelectBySelector(node.selector, e.shiftKey)}
                onMouseEnter={() => onHoverSelector(node.selector)}
                onFocus={() => onHoverSelector(node.selector)}
                title={node.displaySelector}
            >
                <span
                    className="pp-tree-twist"
                    onClick={(e) => {
                        if (!hasChildren) return;
                        e.stopPropagation();
                        onToggle(node.selector);
                    }}
                    role={hasChildren ? "button" : undefined}
                    aria-label={hasChildren ? (isOpen ? "Collapse" : "Expand") : undefined}
                >
                    {hasChildren ? (
                        isOpen ? <ChevronDown size={11} /> : <ChevronRightSm size={11} />
                    ) : null}
                </span>
                <span className="pp-tree-tag">{node.tag}</span>
                {node.iconId && (
                    <span className="pp-tree-meta pp-tree-meta--icon">icon</span>
                )}
                {node.chartId && (
                    <span className="pp-tree-meta pp-tree-meta--chart">chart</span>
                )}
                {node.role && (
                    <span className="pp-tree-meta">[{node.role}]</span>
                )}
                {node.classes.length > 0 && (
                    <span className="pp-tree-class">
                        .{node.classes[0]}{node.classes.length > 1 ? `+${node.classes.length - 1}` : ""}
                    </span>
                )}
                {node.text && (
                    <span className="pp-tree-text">“{node.text}”</span>
                )}
            </button>
            {hasChildren && isOpen && node.children.map((c) => (
                <TreeRow
                    key={c.selector}
                    node={c}
                    expanded={expanded}
                    onToggle={onToggle}
                    selectedSelector={selectedSelector}
                    selectedSet={selectedSet}
                    onSelectBySelector={onSelectBySelector}
                    onHoverSelector={onHoverSelector}
                    rowRefs={rowRefs}
                />
            ))}
        </>
    );
}

function collectAncestors(root: TreeNode, target: string): string[] {
    const found: string[] = [];
    const walk = (n: TreeNode, path: string[]): boolean => {
        if (n.selector === target) {
            for (const p of path) found.push(p);
            return true;
        }
        for (const c of n.children) {
            if (walk(c, [...path, n.selector])) return true;
        }
        return false;
    };
    walk(root, []);
    return found;
}

function PropsGroup({
    title, keys, tokens, overrides, onSetProperty, onClearProperty, defaultOpen = true,
}: {
    title: string;
    keys: string[];
    tokens: DesignToken[];
    overrides: Record<string, StyleOverride>;
    onSetProperty: (property: string, value: string, tokenId?: string) => void;
    onClearProperty: (property: string) => void;
    defaultOpen?: boolean;
}) {
    const [open, setOpen] = useState(defaultOpen);
    const props = useMemo(
        () => keys.map((k) => EDITABLE_PROPERTIES.find((p) => p.key === k)).filter(Boolean) as typeof EDITABLE_PROPERTIES[number][],
        [keys],
    );

    return (
        <div className="pp-section">
            <button type="button" className="pp-section-header" onClick={() => setOpen((o) => !o)}>
                <span>{title}</span>
                <span className={`pp-chevron ${open ? "" : "pp-chevron--closed"}`}>▾</span>
            </button>
            {open && (
                <div className="pp-section-body">
                    {props.map((p) => (
                        <PropRow
                            key={p.key}
                            propKey={p.key}
                            label={p.label}
                            category={p.category}
                            tokens={tokens}
                            override={overrides[p.key]}
                            onSetProperty={onSetProperty}
                            onClearProperty={onClearProperty}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function PropRow({
    propKey, label, category, tokens, override, onSetProperty, onClearProperty,
}: {
    propKey: string;
    label: string;
    category: TokenCategory;
    tokens: DesignToken[];
    override: StyleOverride | undefined;
    onSetProperty: (property: string, value: string, tokenId?: string) => void;
    onClearProperty: (property: string) => void;
}) {
    const applicableTokens = tokens.filter((t) => t.category === category);
    const currentTokenId = override?.tokenId ?? "";
    const isColorProp = propKey.includes("color") && category === "color";

    const handleTextChange = (v: string) => {
        if (v === "") {
            onClearProperty(propKey);
        } else {
            onSetProperty(propKey, v);
        }
    };

    const handleTokenPick = (tokenId: string) => {
        if (!tokenId) {
            onClearProperty(propKey);
            return;
        }
        const tok = tokens.find((t) => t.id === tokenId);
        if (!tok) return;
        onSetProperty(propKey, `var(--tok-${tok.name})`, tok.id);
    };

    const displayValue = override?.tokenId
        ? ""
        : override?.value ?? "";

    return (
        <div className="pp-prop-row">
            <span className="pp-prop-label">{label}</span>
            <div className="pp-prop-value">
                {currentTokenId ? (
                    <>
                        <span className="pp-var-badge" title={tokens.find((t) => t.id === currentTokenId)?.value}>
                            --{tokens.find((t) => t.id === currentTokenId)?.name}
                        </span>
                        <button
                            type="button"
                            className="pp-icon-btn"
                            onClick={() => onClearProperty(propKey)}
                            title="Unlink token"
                        >
                            ×
                        </button>
                    </>
                ) : (
                    <div className="pp-prop-with-var">
                        {isColorProp && override?.value ? (
                            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                                <input
                                    type="color"
                                    className="pp-color-swatch"
                                    value={toHexSafe(override.value)}
                                    onChange={(e) => handleTextChange(e.target.value)}
                                />
                                <input
                                    className="pp-token-input"
                                    value={displayValue}
                                    placeholder="auto"
                                    onChange={(e) => handleTextChange(e.target.value)}
                                    spellCheck={false}
                                />
                            </div>
                        ) : (
                            <input
                                className="pp-token-input"
                                value={displayValue}
                                placeholder={isColorProp ? "#..." : "auto"}
                                onChange={(e) => handleTextChange(e.target.value)}
                                spellCheck={false}
                            />
                        )}
                        <select
                            className="pp-var-select"
                            value=""
                            onChange={(e) => handleTokenPick(e.target.value)}
                            title="Assign a token"
                        >
                            <option value="">var…</option>
                            {applicableTokens.length === 0 ? (
                                <option disabled>No {category} tokens</option>
                            ) : (
                                applicableTokens.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        --{t.name} ({t.value})
                                    </option>
                                ))
                            )}
                        </select>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ── Icon Editor Tab ────────────────────────────────────── */

function IconEditorTab({
    selectedIcon, override, onUpdateIcon, onResetIcon, onDeselect,
}: {
    selectedIcon: SelectedIconInfo;
    override: Partial<IconOverride> | undefined;
    onUpdateIcon: (patch: Partial<IconOverride>) => void;
    onResetIcon: () => void;
    onDeselect: () => void;
}) {
    const current: IconOverride = { ...selectedIcon.defaults, ...(override ?? {}) };
    const [query, setQuery] = useState("");
    const results = useMemo(() => searchIcons(query, 96), [query]);
    const CurrentIcon = findIcon(current.name);

    return (
        <>
            <div className="pp-element-head">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
                        <div style={{
                            width: 44, height: 44, flexShrink: 0,
                            border: "1px solid var(--pp-border)",
                            borderRadius: "var(--pp-radius-sm)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            background: "var(--pp-bg-surface)",
                            color: "var(--pp-text-primary)",
                        }}>
                            {CurrentIcon && (
                                <CurrentIcon
                                    size={Math.min(current.size, 26)}
                                    strokeWidth={current.strokeWidth}
                                    fill={current.variant === "fill" ? "currentColor" : "none"}
                                    stroke={current.variant === "fill" ? "none" : "currentColor"}
                                />
                            )}
                        </div>
                        <div style={{ minWidth: 0 }}>
                            <div className="pp-element-tag">Icon</div>
                            <div className="pp-element-path" style={{ marginTop: 3 }}>
                                <strong style={{ color: "var(--pp-text-secondary)" }}>{current.name}</strong>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: 4 }}>
                        <button type="button" className="pp-icon-btn" onClick={onResetIcon} title="Reset to default">
                            <RotateCcw size={12} />
                        </button>
                        <button type="button" className="pp-icon-btn" onClick={onDeselect} title="Deselect">
                            ×
                        </button>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="pp-section">
                <div className="pp-section-body" style={{ paddingTop: 12 }}>
                    <div className="pp-icon-search">
                        <SearchIcon size={13} />
                        <input
                            type="text"
                            className="pp-icon-search-input"
                            placeholder="Search icons…"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            spellCheck={false}
                        />
                        {query && (
                            <button
                                type="button"
                                className="pp-icon-btn"
                                onClick={() => setQuery("")}
                                title="Clear"
                                style={{ width: 20, height: 20 }}
                            >
                                ×
                            </button>
                        )}
                    </div>

                    <div className="pp-icon-grid">
                        {results.map((entry) => {
                            const Icon = entry.component;
                            const isSelected = entry.name === current.name;
                            return (
                                <button
                                    key={entry.name}
                                    type="button"
                                    className={`pp-icon-tile ${isSelected ? "pp-icon-tile--selected" : ""}`}
                                    onClick={() => onUpdateIcon({ name: entry.name })}
                                    title={entry.name}
                                >
                                    <Icon
                                        size={18}
                                        strokeWidth={current.strokeWidth}
                                        fill={current.variant === "fill" ? "currentColor" : "none"}
                                        stroke={current.variant === "fill" ? "none" : "currentColor"}
                                    />
                                </button>
                            );
                        })}
                        {results.length === 0 && (
                            <div style={{ gridColumn: "1 / -1", padding: "14px 4px", color: "var(--pp-text-tertiary)", fontSize: 12, textAlign: "center" }}>
                                No icons match "{query}"
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Size */}
            <div className="pp-section">
                <div className="pp-section-header" style={{ cursor: "default" }}>
                    <span>Size</span>
                    <span style={{ fontFamily: "var(--pp-font-mono)", color: "var(--pp-text-tertiary)" }}>
                        {current.size}px
                    </span>
                </div>
                <div className="pp-section-body">
                    <input
                        type="range"
                        min={8}
                        max={64}
                        step={1}
                        value={current.size}
                        onChange={(e) => onUpdateIcon({ size: parseInt(e.target.value, 10) })}
                        className="pp-range"
                    />
                    <div className="pp-preset-row">
                        {[12, 14, 16, 20, 24, 32].map((s) => (
                            <button
                                key={s}
                                type="button"
                                className={`pp-preset-btn ${current.size === s ? "pp-preset-btn--active" : ""}`}
                                onClick={() => onUpdateIcon({ size: s })}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stroke width */}
            <div className="pp-section">
                <div className="pp-section-header" style={{ cursor: "default" }}>
                    <span>Stroke width</span>
                    <span style={{ fontFamily: "var(--pp-font-mono)", color: "var(--pp-text-tertiary)" }}>
                        {current.strokeWidth.toFixed(1)}
                    </span>
                </div>
                <div className="pp-section-body">
                    <input
                        type="range"
                        min={0.5}
                        max={3}
                        step={0.25}
                        value={current.strokeWidth}
                        onChange={(e) => onUpdateIcon({ strokeWidth: parseFloat(e.target.value) })}
                        className="pp-range"
                        disabled={current.variant === "fill"}
                    />
                    <div className="pp-preset-row">
                        {[1, 1.5, 2, 2.5].map((s) => (
                            <button
                                key={s}
                                type="button"
                                className={`pp-preset-btn ${current.strokeWidth === s ? "pp-preset-btn--active" : ""}`}
                                onClick={() => onUpdateIcon({ strokeWidth: s })}
                                disabled={current.variant === "fill"}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Variant */}
            <div className="pp-section">
                <div className="pp-section-header" style={{ cursor: "default" }}>
                    <span>Variant</span>
                </div>
                <div className="pp-section-body">
                    <div className="pp-variant-row">
                        {(["stroke", "fill"] as IconVariant[]).map((v) => (
                            <button
                                key={v}
                                type="button"
                                className={`pp-variant-btn ${current.variant === v ? "pp-variant-btn--active" : ""}`}
                                onClick={() => onUpdateIcon({ variant: v })}
                            >
                                {CurrentIcon && (
                                    <CurrentIcon
                                        size={16}
                                        strokeWidth={v === "stroke" ? current.strokeWidth : 0}
                                        fill={v === "fill" ? "currentColor" : "none"}
                                        stroke={v === "fill" ? "none" : "currentColor"}
                                    />
                                )}
                                <span style={{ textTransform: "capitalize" }}>{v}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

/* ── Chart Editor Tab ───────────────────────────────────── */
/* Optional per-chart shortcuts. Everything here writes `--ch-*` variables
   scoped to the one chart — the chart, its card and its labels all remain
   normal selectable elements for the generic property editor. */

function ChartEditorTab({
    selectedChart, override, tokens, onUpdateChart, onResetChart, onDeselect,
}: {
    selectedChart: SelectedChartInfo;
    override: ChartOverride | undefined;
    tokens: DesignToken[];
    onUpdateChart: (patch: Partial<ChartOverride>) => void;
    onResetChart: () => void;
    onDeselect: () => void;
}) {
    const ov = override ?? {};
    const type = selectedChart.type;
    const TypeIcon = type === "bar" ? BarChart3 : type === "donut" ? PieChart : Activity;
    const typeLabel = type === "bar" ? "Bar chart" : type === "donut" ? "Donut chart" : "Line chart";
    const showDots = ov.showDots ?? true;
    const showArea = ov.showArea ?? true;

    return (
        <>
            <div className="pp-element-head">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
                        <div style={{
                            width: 44, height: 44, flexShrink: 0,
                            border: "1px solid var(--pp-border)",
                            borderRadius: "var(--pp-radius-sm)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            background: "var(--pp-bg-surface)",
                            color: "var(--pp-text-primary)",
                        }}>
                            <TypeIcon size={22} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                            <div className="pp-element-tag">{selectedChart.label}</div>
                            <div className="pp-element-path" style={{ marginTop: 3 }}>{typeLabel}</div>
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: 4 }}>
                        <button type="button" className="pp-icon-btn" onClick={onResetChart} title="Reset all chart options">
                            <RotateCcw size={12} />
                        </button>
                        <button type="button" className="pp-icon-btn" onClick={onDeselect} title="Deselect">
                            ×
                        </button>
                    </div>
                </div>
            </div>

            {/* Colors */}
            <div className="pp-section">
                <div className="pp-section-header" style={{ cursor: "default" }}>
                    <span>Colors</span>
                </div>
                <div className="pp-section-body">
                    <ChartColorRow
                        label="Accent"
                        value={ov.accent}
                        tokens={tokens}
                        onChange={(v) => onUpdateChart({ accent: v })}
                    />
                    {type === "bar" && (
                        <ChartColorRow
                            label="Base bars"
                            value={ov.base}
                            tokens={tokens}
                            onChange={(v) => onUpdateChart({ base: v })}
                        />
                    )}
                    {type === "donut" && (
                        <>
                            <ChartColorRow
                                label="Segment 2"
                                value={ov.seg2}
                                tokens={tokens}
                                onChange={(v) => onUpdateChart({ seg2: v })}
                            />
                            <ChartColorRow
                                label="Segment 3"
                                value={ov.seg3}
                                tokens={tokens}
                                onChange={(v) => onUpdateChart({ seg3: v })}
                            />
                            <ChartColorRow
                                label="Segment 4"
                                value={ov.seg4}
                                tokens={tokens}
                                onChange={(v) => onUpdateChart({ seg4: v })}
                            />
                            <div style={{ fontSize: 13, color: "var(--pp-text-tertiary)", lineHeight: 1.5, marginTop: 6 }}>
                                Segment 1 uses the accent color. The legend swatches follow automatically.
                            </div>
                        </>
                    )}
                    {type === "sparkline" && (
                        <div style={{ fontSize: 13, color: "var(--pp-text-tertiary)", lineHeight: 1.5, marginTop: 6 }}>
                            The accent colors the line, dots and area fill.
                        </div>
                    )}
                </div>
            </div>

            {/* Per-type dimensions */}
            {type === "bar" && (
                <>
                    <ChartRangeSection
                        label="Bar radius"
                        value={ov.barRadius}
                        fallback={0}
                        min={0}
                        max={12}
                        presets={[0, 2, 4, 6, 8]}
                        onChange={(v) => onUpdateChart({ barRadius: v })}
                        onClear={() => onUpdateChart({ barRadius: undefined })}
                    />
                    <ChartRangeSection
                        label="Bar gap"
                        value={ov.barGap}
                        fallback={0}
                        min={0}
                        max={16}
                        presets={[0, 2, 4, 8, 12]}
                        onChange={(v) => onUpdateChart({ barGap: v })}
                        onClear={() => onUpdateChart({ barGap: undefined })}
                    />
                </>
            )}
            {type === "donut" && (
                <ChartRangeSection
                    label="Ring width"
                    value={ov.ringWidth}
                    fallback={16}
                    min={6}
                    max={40}
                    presets={[10, 16, 24, 32]}
                    onChange={(v) => onUpdateChart({ ringWidth: v })}
                    onClear={() => onUpdateChart({ ringWidth: undefined })}
                />
            )}
            {type === "sparkline" && (
                <>
                    <ChartRangeSection
                        label="Line width"
                        value={ov.strokeWidth}
                        fallback={2}
                        min={0.5}
                        max={6}
                        step={0.25}
                        unit=""
                        presets={[1, 2, 3, 4]}
                        onChange={(v) => onUpdateChart({ strokeWidth: v })}
                        onClear={() => onUpdateChart({ strokeWidth: undefined })}
                    />
                    <div className="pp-section">
                        <div className="pp-section-header" style={{ cursor: "default" }}>
                            <span>Show</span>
                        </div>
                        <div className="pp-section-body">
                            <div className="pp-variant-row">
                                <button
                                    type="button"
                                    className={`pp-variant-btn ${showDots ? "pp-variant-btn--active" : ""}`}
                                    onClick={() => onUpdateChart({ showDots: !showDots })}
                                >
                                    Dots
                                </button>
                                <button
                                    type="button"
                                    className={`pp-variant-btn ${showArea ? "pp-variant-btn--active" : ""}`}
                                    onClick={() => onUpdateChart({ showArea: !showArea })}
                                >
                                    Area
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <div style={{ padding: "12px 14px", fontSize: 13, color: "var(--pp-text-tertiary)", lineHeight: 1.5 }}>
                These options are optional shortcuts. The chart's card, labels and legend
                stay normal elements — click them to style spacing, typography and colors.
            </div>
        </>
    );
}

function ChartColorRow({
    label, value, tokens, onChange,
}: {
    label: string;
    value: StyleOverride | undefined;
    tokens: DesignToken[];
    onChange: (v: StyleOverride | undefined) => void;
}) {
    const colorTokens = tokens.filter((t) => t.category === "color");
    const linkedToken = value?.tokenId ? tokens.find((t) => t.id === value.tokenId) : undefined;

    const handleTextChange = (v: string) => {
        onChange(v === "" ? undefined : { value: v });
    };

    return (
        <div className="pp-prop-row">
            <span className="pp-prop-label">{label}</span>
            <div className="pp-prop-value">
                {value?.tokenId ? (
                    <>
                        <span className="pp-var-badge" title={linkedToken?.value}>
                            --{linkedToken?.name}
                        </span>
                        <button
                            type="button"
                            className="pp-icon-btn"
                            onClick={() => onChange(undefined)}
                            title="Unlink token"
                        >
                            ×
                        </button>
                    </>
                ) : (
                    <div className="pp-prop-with-var">
                        {value?.value ? (
                            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                                <input
                                    type="color"
                                    className="pp-color-swatch"
                                    value={toHexSafe(value.value)}
                                    onChange={(e) => handleTextChange(e.target.value)}
                                />
                                <input
                                    className="pp-token-input"
                                    value={value.value}
                                    placeholder="default"
                                    onChange={(e) => handleTextChange(e.target.value)}
                                    spellCheck={false}
                                />
                            </div>
                        ) : (
                            <input
                                className="pp-token-input"
                                value=""
                                placeholder="default"
                                onChange={(e) => handleTextChange(e.target.value)}
                                spellCheck={false}
                            />
                        )}
                        <select
                            className="pp-var-select"
                            value=""
                            onChange={(e) => {
                                const tok = tokens.find((t) => t.id === e.target.value);
                                if (tok) onChange({ value: `var(--tok-${tok.name})`, tokenId: tok.id });
                            }}
                            title="Assign a token"
                        >
                            <option value="">var…</option>
                            {colorTokens.length === 0 ? (
                                <option disabled>No color tokens</option>
                            ) : (
                                colorTokens.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        --{t.name} ({t.value})
                                    </option>
                                ))
                            )}
                        </select>
                    </div>
                )}
            </div>
        </div>
    );
}

function ChartRangeSection({
    label, value, fallback, min, max, step = 1, unit = "px", presets, onChange, onClear,
}: {
    label: string;
    value: number | undefined;
    fallback: number;
    min: number;
    max: number;
    step?: number;
    unit?: string;
    presets?: number[];
    onChange: (v: number) => void;
    onClear: () => void;
}) {
    const current = value ?? fallback;
    return (
        <div className="pp-section">
            <div className="pp-section-header" style={{ cursor: "default" }}>
                <span>{label}</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontFamily: "var(--pp-font-mono)", color: "var(--pp-text-tertiary)" }}>
                        {value === undefined ? "default" : `${current}${unit}`}
                    </span>
                    {value !== undefined && (
                        <button
                            type="button"
                            className="pp-icon-btn"
                            onClick={onClear}
                            title="Reset to default"
                        >
                            ×
                        </button>
                    )}
                </span>
            </div>
            <div className="pp-section-body">
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={current}
                    onChange={(e) => onChange(parseFloat(e.target.value))}
                    className="pp-range"
                />
                {presets && (
                    <div className="pp-preset-row">
                        {presets.map((p) => (
                            <button
                                key={p}
                                type="button"
                                className={`pp-preset-btn ${value === p ? "pp-preset-btn--active" : ""}`}
                                onClick={() => onChange(p)}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
