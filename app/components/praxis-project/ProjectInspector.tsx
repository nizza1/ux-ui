import { useState, useMemo } from "react";
import {
    ChevronLeft, ChevronRight, Plus, Trash2, Palette, Ruler,
    Layers, Type, Sparkles, Settings2, MousePointerClick, Search as SearchIcon,
    RotateCcw,
} from "lucide-react";
import type {
    DesignToken, SelectedElementInfo, StyleOverride, TokenCategory,
    SelectedIconInfo, IconOverride, IconVariant,
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
    elementOverrides: Record<string, StyleOverride>;
    onSetProperty: (property: string, value: string, tokenId?: string) => void;
    onClearProperty: (property: string) => void;
    onDeselect: () => void;

    /** Icon-edit mode (mutually exclusive with element-edit) */
    selectedIcon: SelectedIconInfo | null;
    iconOverride: Partial<IconOverride> | undefined;
    onUpdateIcon: (patch: Partial<IconOverride>) => void;
    onResetIcon: () => void;
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
        selectedElement, elementOverrides, onSetProperty, onClearProperty, onDeselect,
        selectedIcon, iconOverride, onUpdateIcon, onResetIcon,
    } = props;

    const [activeTab, setActiveTab] = useState<TabId>("design-system");
    const [openCats, setOpenCats] = useState<Record<TokenCategory, boolean>>({
        color: true,
        space: true,
        radius: false,
        "font-size": false,
        "font-weight": false,
        "line-height": false,
        "font-family": false,
    });

    // When an icon is selected, the element tab becomes the icon editor.
    const effectiveTab: TabId = activeTab;
    const anySelection = Boolean(selectedElement || selectedIcon);

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
                                {selectedIcon ? "Icon" : "Element"}
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
                            ) : (
                                <ElementTab
                                    selectedElement={selectedElement}
                                    tokens={tokens}
                                    overrides={elementOverrides}
                                    onSetProperty={onSetProperty}
                                    onClearProperty={onClearProperty}
                                    onDeselect={onDeselect}
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
    selectedElement, tokens, overrides, onSetProperty, onClearProperty, onDeselect,
}: {
    selectedElement: SelectedElementInfo | null;
    tokens: DesignToken[];
    overrides: Record<string, StyleOverride>;
    onSetProperty: (property: string, value: string, tokenId?: string) => void;
    onClearProperty: (property: string) => void;
    onDeselect: () => void;
}) {
    if (!selectedElement) {
        return (
            <div className="pp-empty">
                <div className="pp-empty-icon">
                    <MousePointerClick size={20} />
                </div>
                <div className="pp-empty-title">No element selected</div>
                <div className="pp-empty-text">
                    Click any element in the dashboard to edit its styles, or assign a design token.
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="pp-element-head">
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
            />
            <PropsGroup
                title="Spacing"
                keys={["padding", "margin", "gap"]}
                tokens={tokens}
                overrides={overrides}
                onSetProperty={onSetProperty}
                onClearProperty={onClearProperty}
            />
        </>
    );
}

function PropsGroup({
    title, keys, tokens, overrides, onSetProperty, onClearProperty,
}: {
    title: string;
    keys: string[];
    tokens: DesignToken[];
    overrides: Record<string, StyleOverride>;
    onSetProperty: (property: string, value: string, tokenId?: string) => void;
    onClearProperty: (property: string) => void;
}) {
    const [open, setOpen] = useState(true);
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
