import { useState, useEffect, useRef, useMemo } from "react";
import type { SelectedElementInfo, StyleChangesMap } from "./types";

/* ── Property definitions ───────────────────────── */

const PROPERTIES_TO_READ = [
    "font-size", "font-weight", "color", "font-family",
    "line-height", "letter-spacing", "text-transform", "text-align",
    "background-color",
    "padding-top", "padding-right", "padding-bottom", "padding-left",
    "margin-top", "margin-right", "margin-bottom", "margin-left",
    "gap",
    "border-radius",
    "border-top-width", "border-top-style", "border-top-color",
    "box-shadow", "opacity",
] as const;

export { PROPERTIES_TO_READ };

interface PropDef {
    key: string;
    label: string;
    composite?: string[];
}

const SECTIONS: { id: string; label: string; props: PropDef[] }[] = [
    {
        id: "typography",
        label: "Typography",
        props: [
            { key: "font-size", label: "Size" },
            { key: "font-weight", label: "Weight" },
            { key: "color", label: "Color" },
            { key: "line-height", label: "Line Height" },
            { key: "letter-spacing", label: "Spacing" },
            { key: "text-transform", label: "Case" },
            { key: "text-align", label: "Align" },
        ],
    },
    {
        id: "fill",
        label: "Fill",
        props: [
            { key: "background-color", label: "Background" },
        ],
    },
    {
        id: "spacing",
        label: "Spacing",
        props: [
            { key: "padding", label: "Padding", composite: ["padding-top", "padding-right", "padding-bottom", "padding-left"] },
            { key: "margin", label: "Margin", composite: ["margin-top", "margin-right", "margin-bottom", "margin-left"] },
            { key: "gap", label: "Gap" },
        ],
    },
    {
        id: "border",
        label: "Border",
        props: [
            { key: "border-radius", label: "Corners" },
            { key: "border", label: "Border", composite: ["border-top-width", "border-top-style", "border-top-color"] },
        ],
    },
    {
        id: "effects",
        label: "Effects",
        props: [
            { key: "box-shadow", label: "Shadow" },
            { key: "opacity", label: "Opacity" },
        ],
    },
];

const FONT_WEIGHT_OPTIONS = [
    { label: "100 Thin", value: "100" },
    { label: "200 Extra Light", value: "200" },
    { label: "300 Light", value: "300" },
    { label: "400 Regular", value: "400" },
    { label: "500 Medium", value: "500" },
    { label: "600 Semibold", value: "600" },
    { label: "700 Bold", value: "700" },
    { label: "800 Extra Bold", value: "800" },
    { label: "900 Black", value: "900" },
];

const TEXT_TRANSFORM_OPTIONS = [
    { label: "None", value: "none" },
    { label: "Uppercase", value: "uppercase" },
    { label: "Lowercase", value: "lowercase" },
    { label: "Capitalize", value: "capitalize" },
];

const TEXT_ALIGN_OPTIONS = [
    { label: "Left", value: "left" },
    { label: "Center", value: "center" },
    { label: "Right", value: "right" },
];

/* ── Helpers ────────────────────────────────────── */

function isColorValue(value: string): boolean {
    return /^(#|rgb|rgba|hsl|hsla)/.test(value.trim());
}

function rgbToHex(rgb: string): string {
    const match = rgb.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
    if (!match) return rgb;
    return "#" + [match[1], match[2], match[3]]
        .map((x) => parseInt(x, 10).toString(16).padStart(2, "0"))
        .join("");
}

function combineBoxValues(t: string, r: string, b: string, l: string): string {
    if (t === r && r === b && b === l) return t;
    if (t === b && r === l) return `${t} ${r}`;
    if (r === l) return `${t} ${r} ${b}`;
    return `${t} ${r} ${b} ${l}`;
}

function combineBorderValues(width: string, style: string, color: string): string {
    if (width === "0px" || style === "none") return "none";
    return `${width} ${style} ${rgbToHex(color)}`;
}

/* ── Component ──────────────────────────────────── */

interface InspectorPanelProps {
    selectedElement: SelectedElementInfo | null;
    overrides: Record<string, string>;
    allChanges: StyleChangesMap;
    onStyleChange: (property: string, value: string) => void;
    onDeselect: () => void;
}

export function InspectorPanel({
    selectedElement,
    overrides,
    allChanges,
    onStyleChange,
    onDeselect,
}: InspectorPanelProps) {
    // Only the first section (typography) open by default
    const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
        fill: true,
        spacing: true,
        border: true,
        effects: true,
    });

    const toggleSection = (id: string) => {
        setCollapsedSections((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    if (!selectedElement) {
        return (
            <div className="le-inspector-panel">
                <div className="le-inspector-empty">
                    <div className="le-inspector-empty-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                            <path d="M11 8v6M8 11h6" />
                        </svg>
                    </div>
                    <div className="le-inspector-empty-title">Select an Element</div>
                    <div className="le-inspector-empty-text">
                        Click any element in the preview to inspect and edit its styles
                    </div>
                </div>
            </div>
        );
    }

    const getValue = (prop: PropDef): string => {
        if (prop.composite) {
            // Check for a shorthand override first
            if (overrides[prop.key] !== undefined) return overrides[prop.key];
            const vals = prop.composite.map((k) => overrides[k] ?? selectedElement.styles[k] ?? "");
            if (prop.key === "border") return combineBorderValues(vals[0], vals[1], vals[2]);
            return combineBoxValues(vals[0], vals[1], vals[2], vals[3]);
        }
        return overrides[prop.key] ?? selectedElement.styles[prop.key] ?? "";
    };

    const isModified = (prop: PropDef): boolean => {
        if (prop.composite) {
            return overrides[prop.key] !== undefined || prop.composite.some((k) => overrides[k] !== undefined);
        }
        return overrides[prop.key] !== undefined;
    };

    return (
        <div className="le-inspector-panel">
            <div className="le-inspector-scroll">
                {/* Breadcrumb */}
                <div className="le-inspector-breadcrumb">
                    <div className="le-inspector-breadcrumb-row">
                        <span className="le-inspector-element-tag">&lt;{selectedElement.tag}&gt;</span>
                        {selectedElement.classes.length > 0 && (
                            <span className="le-inspector-element-classes">
                                {selectedElement.classes.map((c) => `.${c}`).join("")}
                            </span>
                        )}
                    </div>
                    <button
                        type="button"
                        className="le-inspector-deselect"
                        onClick={onDeselect}
                        title="Deselect element"
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="le-inspector-path-full">{selectedElement.displayPath}</div>

                {/* Sections */}
                {SECTIONS.map((section) => {
                    const isCollapsed = collapsedSections[section.id] ?? false;
                    return (
                        <div key={section.id} className="le-inspector-section">
                            <button
                                type="button"
                                className="le-inspector-section-header"
                                onClick={() => toggleSection(section.id)}
                                aria-expanded={!isCollapsed}
                            >
                                <span>{section.label}</span>
                                <span className={`le-group-chevron ${isCollapsed ? "le-group-chevron--closed" : ""}`}>
                                    &#9662;
                                </span>
                            </button>
                            {!isCollapsed && (
                                <div className="le-inspector-section-body">
                                    {section.props.map((prop) => (
                                        <PropertyRow
                                            key={prop.key}
                                            prop={prop}
                                            value={getValue(prop)}
                                            modified={isModified(prop)}
                                            onStyleChange={onStyleChange}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* CSS Output */}
            <InspectorCssOutput changes={allChanges} />
        </div>
    );
}

/* ── Property row ───────────────────────────────── */

interface PropertyRowProps {
    prop: PropDef;
    value: string;
    modified: boolean;
    onStyleChange: (property: string, value: string) => void;
}

function PropertyRow({ prop, value, modified, onStyleChange }: PropertyRowProps) {
    const isColor = isColorValue(value);
    const hexValue = isColor ? rgbToHex(value) : "";

    const handleChange = (newValue: string) => {
        onStyleChange(prop.key, newValue);
    };

    // Font weight → dropdown
    if (prop.key === "font-weight") {
        return (
            <div className={`le-inspector-row ${modified ? "le-inspector-row--modified" : ""}`}>
                <span className="le-inspector-label">{prop.label}</span>
                <div className="le-inspector-value">
                    <select
                        className="le-inspector-select"
                        value={value}
                        onChange={(e) => handleChange(e.target.value)}
                    >
                        {FONT_WEIGHT_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>
        );
    }

    // Text transform → dropdown
    if (prop.key === "text-transform") {
        return (
            <div className={`le-inspector-row ${modified ? "le-inspector-row--modified" : ""}`}>
                <span className="le-inspector-label">{prop.label}</span>
                <div className="le-inspector-value">
                    <select
                        className="le-inspector-select"
                        value={value}
                        onChange={(e) => handleChange(e.target.value)}
                    >
                        {TEXT_TRANSFORM_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>
        );
    }

    // Text align → dropdown
    if (prop.key === "text-align") {
        return (
            <div className={`le-inspector-row ${modified ? "le-inspector-row--modified" : ""}`}>
                <span className="le-inspector-label">{prop.label}</span>
                <div className="le-inspector-value">
                    <select
                        className="le-inspector-select"
                        value={value}
                        onChange={(e) => handleChange(e.target.value)}
                    >
                        {TEXT_ALIGN_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>
        );
    }

    // Opacity → range slider
    if (prop.key === "opacity") {
        const numVal = Math.max(0, Math.min(1, parseFloat(value) || 1));
        return (
            <div className={`le-inspector-row ${modified ? "le-inspector-row--modified" : ""}`}>
                <span className="le-inspector-label">{prop.label}</span>
                <div className="le-inspector-value">
                    <div className="le-opacity-row">
                        <input
                            type="range"
                            className="le-inspector-slider"
                            min={0}
                            max={1}
                            step={0.01}
                            value={numVal}
                            onChange={(e) => handleChange(parseFloat(e.target.value).toFixed(2))}
                        />
                        <span className="le-opacity-value">{numVal.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        );
    }

    // Box shadow → preset buttons + custom input
    if (prop.key === "box-shadow") {
        const SHADOW_PRESETS = [
            { label: "None", value: "none" },
            { label: "XS", value: "0 1px 2px rgba(0,0,0,0.08)" },
            { label: "SM", value: "0 2px 8px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)" },
            { label: "MD", value: "0 4px 16px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.06)" },
            { label: "LG", value: "0 8px 32px rgba(0,0,0,0.14), 0 4px 8px rgba(0,0,0,0.08)" },
        ];
        const isPreset = SHADOW_PRESETS.some((p) => p.value === value);
        return (
            <div className={`le-inspector-row le-inspector-row--block ${modified ? "le-inspector-row--modified" : ""}`}>
                <span className="le-inspector-label">{prop.label}</span>
                <div className="le-shadow-presets">
                    {SHADOW_PRESETS.map((p) => (
                        <button
                            key={p.label}
                            type="button"
                            className={`le-shadow-preset ${value === p.value ? "le-shadow-preset--active" : ""}`}
                            onClick={() => handleChange(p.value)}
                            title={p.value}
                        >
                            <span
                                className="le-shadow-dot"
                                style={p.value !== "none" ? { boxShadow: p.value } : {}}
                            />
                            {p.label}
                        </button>
                    ))}
                </div>
                {!isPreset && (
                    <div className="le-inspector-value">
                        <EditableInput value={value} onCommit={handleChange} />
                    </div>
                )}
            </div>
        );
    }

    // Color value → color picker + text
    if (isColor) {
        return (
            <div className={`le-inspector-row ${modified ? "le-inspector-row--modified" : ""}`}>
                <span className="le-inspector-label">{prop.label}</span>
                <div className="le-inspector-value">
                    <div className="le-inspector-color">
                        <input
                            type="color"
                            className="le-inspector-color-swatch"
                            value={hexValue}
                            onChange={(e) => handleChange(e.target.value)}
                        />
                        <EditableInput value={hexValue} onCommit={handleChange} />
                    </div>
                </div>
            </div>
        );
    }

    // Default → text input
    return (
        <div className={`le-inspector-row ${modified ? "le-inspector-row--modified" : ""}`}>
            <span className="le-inspector-label">{prop.label}</span>
            <div className="le-inspector-value">
                <EditableInput value={value} onCommit={handleChange} />
            </div>
        </div>
    );
}

/* ── Editable input (commits on Enter / blur) ──── */

function EditableInput({ value, onCommit }: { value: string; onCommit: (v: string) => void }) {
    const [draft, setDraft] = useState(value);
    const [editing, setEditing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!editing) setDraft(value);
    }, [value, editing]);

    const commit = () => {
        setEditing(false);
        if (draft !== value) onCommit(draft);
    };

    return (
        <input
            ref={inputRef}
            type="text"
            className="le-inspector-text-input"
            value={editing ? draft : value}
            onFocus={() => { setEditing(true); setDraft(value); }}
            onBlur={commit}
            onChange={(e) => { setDraft(e.target.value); setEditing(true); }}
            onKeyDown={(e) => {
                if (e.key === "Enter") { e.currentTarget.blur(); }
                if (e.key === "Escape") { setEditing(false); setDraft(value); e.currentTarget.blur(); }
            }}
        />
    );
}

/* ── CSS Output ─────────────────────────────────── */

function InspectorCssOutput({ changes }: { changes: StyleChangesMap }) {
    const [copied, setCopied] = useState(false);

    const cssText = useMemo(() => {
        const entries = Object.entries(changes).filter(([, props]) => Object.keys(props).length > 0);
        if (entries.length === 0) return "";
        return entries
            .map(([selector, props]) => {
                const lines = Object.entries(props)
                    .map(([prop, val]) => `  ${prop}: ${val};`)
                    .join("\n");
                return `${selector} {\n${lines}\n}`;
            })
            .join("\n\n");
    }, [changes]);

    const handleCopy = async () => {
        if (!cssText) return;
        try {
            await navigator.clipboard.writeText(cssText);
        } catch {
            const ta = document.createElement("textarea");
            ta.value = cssText;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!cssText) {
        return (
            <div className="le-css-output">
                <div className="le-css-output-header">
                    <span>CSS Output</span>
                </div>
                <div className="le-css-output-empty">
                    Edit properties to generate CSS
                </div>
            </div>
        );
    }

    return (
        <div className="le-css-output">
            <div className="le-css-output-header">
                <span>CSS Output</span>
                <button
                    type="button"
                    className={`le-css-copy-btn ${copied ? "le-css-copy-btn--copied" : ""}`}
                    onClick={handleCopy}
                >
                    {copied ? "Copied!" : "Copy"}
                </button>
            </div>
            <pre className="le-css-output-code">
                <code>{cssText}</code>
            </pre>
        </div>
    );
}
