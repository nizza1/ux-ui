import { forwardRef } from "react";

/*
 * Deliberately flat dashboard markup.
 *
 * NO inline styles, NO font-size / weight / color hierarchy, NO spacing —
 * everything equal and unstyled. The user builds visual hierarchy through
 * the inspector by authoring design-token variables + assigning them
 * to specific elements.
 *
 * Semantic data-pp-role attributes let the inspector target groups of
 * elements (all headings, all body text, all cards, etc.).
 */

export const Dashboard = forwardRef<HTMLDivElement>(function Dashboard(_props, ref) {
  return (
    <div className="pp-dashboard" ref={ref}>
      {/* ── Header ───────────────────────────── */}
      <header className="d-header" data-pp-role="header">
        <div className="d-header-left">
          <div className="d-logo" data-pp-role="logo">
            <span className="d-logo-mark" aria-hidden />
            <span data-pp-role="logo-text">Acme Analytics</span>
          </div>
          <nav className="d-breadcrumb" data-pp-role="breadcrumb">
            <span>Workspaces</span>
            <span aria-hidden>/</span>
            <span>Q2 Report</span>
          </nav>
        </div>
        <div className="d-header-right">
          <div className="d-search" data-pp-role="search">
            <span className="d-nav-icon" aria-hidden />
            <input
              className="d-search-input"
              type="text"
              placeholder="Search dashboards, reports, metrics…"
              readOnly
            />
            <span data-pp-role="kbd">⌘K</span>
          </div>
          <button type="button" className="d-iconbtn" aria-label="Notifications">
            <span className="d-nav-icon" aria-hidden />
          </button>
          <button type="button" className="d-iconbtn" aria-label="Help">
            <span className="d-nav-icon" aria-hidden />
          </button>
          <span className="d-avatar" aria-hidden />
        </div>
      </header>

      {/* ── Sidebar ──────────────────────────── */}
      <aside className="d-sidebar" data-pp-role="sidebar">
        <div className="d-nav-section">
          <span className="d-nav-title" data-pp-role="nav-title">Workspace</span>
          <ul className="d-nav">
            <li className="d-nav-item d-nav-item--active" data-pp-role="nav-item-active">
              <span className="d-nav-icon" aria-hidden />
              <span>Overview</span>
            </li>
            <li className="d-nav-item" data-pp-role="nav-item">
              <span className="d-nav-icon" aria-hidden />
              <span>Reports</span>
            </li>
            <li className="d-nav-item" data-pp-role="nav-item">
              <span className="d-nav-icon" aria-hidden />
              <span>Funnels</span>
            </li>
            <li className="d-nav-item" data-pp-role="nav-item">
              <span className="d-nav-icon" aria-hidden />
              <span>Segments</span>
            </li>
            <li className="d-nav-item" data-pp-role="nav-item">
              <span className="d-nav-icon" aria-hidden />
              <span>Experiments</span>
            </li>
          </ul>
        </div>

        <div className="d-nav-section">
          <span className="d-nav-title" data-pp-role="nav-title">Resources</span>
          <ul className="d-nav">
            <li className="d-nav-item" data-pp-role="nav-item">
              <span className="d-nav-icon" aria-hidden />
              <span>Data sources</span>
            </li>
            <li className="d-nav-item" data-pp-role="nav-item">
              <span className="d-nav-icon" aria-hidden />
              <span>Integrations</span>
            </li>
            <li className="d-nav-item" data-pp-role="nav-item">
              <span className="d-nav-icon" aria-hidden />
              <span>Team</span>
            </li>
            <li className="d-nav-item" data-pp-role="nav-item">
              <span className="d-nav-icon" aria-hidden />
              <span>Settings</span>
            </li>
          </ul>
        </div>
      </aside>

      {/* ── Main content ─────────────────────── */}
      <main className="d-main" data-pp-role="main">
        {/* Page head */}
        <div className="d-page-head" data-pp-role="page-head">
          <div className="d-page-title-group">
            <span data-pp-role="eyebrow">Workspace · Marketing</span>
            <h1 className="d-page-title" data-pp-role="page-title">Q2 Performance Overview</h1>
            <span data-pp-role="page-sub">
              Updated 14 minutes ago · Tracking 12 campaigns across 4 channels
            </span>
          </div>
          <div style={{ display: "flex", gap: "var(--d-space-2)" }}>
            <button type="button" className="d-btn" data-pp-role="btn-secondary">
              <span className="d-nav-icon" aria-hidden />
              <span>Export</span>
            </button>
            <button type="button" className="d-btn d-btn--primary" data-pp-role="btn-primary">
              <span className="d-nav-icon" aria-hidden />
              <span>New report</span>
            </button>
          </div>
        </div>

        {/* KPI row */}
        <section className="d-kpis" data-pp-role="kpi-row">
          {[
            { label: "Monthly revenue", value: "$128,430", delta: "+12.4% vs last month" },
            { label: "Active users", value: "42,871", delta: "+3.1% vs last month" },
            { label: "Conversion rate", value: "4.82%", delta: "−0.3% vs last month" },
            { label: "Avg. session", value: "3m 24s", delta: "+8s vs last month" },
          ].map((k) => (
            <div className="d-kpi" data-pp-role="kpi" key={k.label}>
              <div className="d-kpi-head">
                <span className="d-kpi-label" data-pp-role="kpi-label">{k.label}</span>
                <span className="d-kpi-icon" aria-hidden />
              </div>
              <span className="d-kpi-value" data-pp-role="kpi-value">{k.value}</span>
              <span className="d-kpi-delta" data-pp-role="kpi-delta">{k.delta}</span>
            </div>
          ))}
        </section>

        {/* Main grid */}
        <section className="d-grid" data-pp-role="grid-main">
          {/* Revenue chart */}
          <article className="d-card" data-pp-role="card">
            <div className="d-card-head">
              <div>
                <span className="d-card-title" data-pp-role="card-title">Revenue trend</span>
                <span className="d-card-sub" data-pp-role="card-sub">Last 30 days</span>
              </div>
              <div className="d-tabs" data-pp-role="card-tabs">
                <button type="button" className="d-tab d-tab--active">Day</button>
                <button type="button" className="d-tab">Week</button>
                <button type="button" className="d-tab">Month</button>
              </div>
            </div>
            <BarChart />
          </article>

          {/* Traffic donut */}
          <article className="d-card" data-pp-role="card">
            <div className="d-card-head">
              <div>
                <span className="d-card-title" data-pp-role="card-title">Traffic sources</span>
                <span className="d-card-sub" data-pp-role="card-sub">Sessions this week</span>
              </div>
            </div>
            <div className="d-donut">
              <Donut />
              <ul className="d-legend">
                {[
                  { label: "Direct", value: "42%", cls: "d-swatch--accent" },
                  { label: "Organic", value: "28%", cls: "d-swatch--a" },
                  { label: "Referral", value: "18%", cls: "d-swatch--b" },
                  { label: "Social", value: "12%", cls: "d-swatch--c" },
                ].map((l) => (
                  <li className="d-legend-item" key={l.label}>
                    <span className="d-legend-left">
                      <span className={`d-swatch ${l.cls}`} aria-hidden />
                      <span data-pp-role="legend-label">{l.label}</span>
                    </span>
                    <span data-pp-role="legend-value">{l.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </section>

        {/* Second row: 3 cards */}
        <section className="d-grid-row" data-pp-role="grid-row">
          <article className="d-card" data-pp-role="card">
            <div className="d-card-head">
              <div>
                <span className="d-card-title" data-pp-role="card-title">Sessions</span>
                <span className="d-card-sub" data-pp-role="card-sub">7 day trend</span>
              </div>
            </div>
            <Sparkline />
          </article>

          <article className="d-card" data-pp-role="card">
            <div className="d-card-head">
              <div>
                <span className="d-card-title" data-pp-role="card-title">Goals progress</span>
                <span className="d-card-sub" data-pp-role="card-sub">Q2 targets</span>
              </div>
            </div>
            <ul className="d-progress-list">
              {[
                { label: "Signups", pct: 72 },
                { label: "Activations", pct: 54 },
                { label: "Retention", pct: 88 },
                { label: "Expansion", pct: 31 },
              ].map((p) => (
                <li className="d-progress-item" key={p.label}>
                  <div className="d-progress-head">
                    <span data-pp-role="progress-label">{p.label}</span>
                    <span data-pp-role="progress-value">{p.pct}%</span>
                  </div>
                  <div className="d-progress-track">
                    <div className="d-progress-fill" style={{ width: `${p.pct}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </article>

          <article className="d-card" data-pp-role="card">
            <div className="d-card-head">
              <div>
                <span className="d-card-title" data-pp-role="card-title">Recent activity</span>
                <span className="d-card-sub" data-pp-role="card-sub">Last 24h</span>
              </div>
            </div>
            <ul className="d-activity">
              {[
                { who: "Maria K.", what: "published report Q2-Overview", when: "4m ago" },
                { who: "Jon B.", what: "added a segment: Enterprise leads", when: "22m ago" },
                { who: "Sara L.", what: "invited 3 teammates", when: "1h ago" },
                { who: "Alex M.", what: "connected Stripe integration", when: "3h ago" },
              ].map((a, i) => (
                <li className="d-activity-item" key={i}>
                  <span className="d-activity-dot" aria-hidden />
                  <div className="d-activity-body">
                    <span data-pp-role="activity-text">
                      <strong data-pp-role="activity-who">{a.who}</strong> {a.what}
                    </span>
                    <span className="d-activity-time" data-pp-role="activity-time">{a.when}</span>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </section>

        {/* Table */}
        <section className="d-card" data-pp-role="card">
          <div className="d-card-head">
            <div>
              <span className="d-card-title" data-pp-role="card-title">Top campaigns</span>
              <span className="d-card-sub" data-pp-role="card-sub">Sorted by conversions</span>
            </div>
            <button type="button" className="d-btn" data-pp-role="btn-secondary">View all</button>
          </div>
          <table className="d-table" data-pp-role="table">
            <thead>
              <tr>
                <th data-pp-role="th">Campaign</th>
                <th data-pp-role="th">Channel</th>
                <th data-pp-role="th">Spend</th>
                <th data-pp-role="th">Conversions</th>
                <th data-pp-role="th">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Spring launch", ch: "Email", spend: "$4,200", conv: 312, s: "Active" },
                { name: "Retarget Q1 leads", ch: "Ads", spend: "$8,120", conv: 248, s: "Active" },
                { name: "Content partnerships", ch: "Referral", spend: "$2,800", conv: 196, s: "Paused" },
                { name: "Product Hunt", ch: "Social", spend: "$1,450", conv: 142, s: "Active" },
                { name: "Webinar series", ch: "Direct", spend: "$3,600", conv: 98, s: "Ended" },
              ].map((r) => (
                <tr key={r.name}>
                  <td data-pp-role="td">{r.name}</td>
                  <td data-pp-role="td">{r.ch}</td>
                  <td data-pp-role="td">{r.spend}</td>
                  <td data-pp-role="td">{r.conv}</td>
                  <td data-pp-role="td">
                    <span className="d-status" data-pp-role="status">
                      <span className="d-status-dot" aria-hidden />
                      <span>{r.s}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
});

/* ── Chart primitives (structural, no styling) ──────────── */

function BarChart() {
  const groups = [
    [28, 44], [36, 52], [24, 38], [48, 60], [32, 46],
    [54, 70], [40, 58], [30, 42], [58, 74], [44, 62],
    [36, 52], [62, 82],
  ];
  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const max = 100;
  return (
    <div>
      <div className="d-chart">
        {groups.map(([a, b], i) => (
          <div className="d-bar-group" key={i}>
            <div className="d-bar-stack">
              <div className="d-bar" style={{ height: `${(a / max) * 100}%` }} />
              <div className="d-bar d-bar--alt" style={{ height: `${(b / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="d-chart" style={{ height: "auto", paddingTop: 0 }}>
        {labels.map((l) => (
          <div className="d-bar-group" key={l}>
            <span className="d-bar-label" data-pp-role="chart-label">{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Sparkline() {
  // Simple SVG sparkline
  const points = [10, 18, 14, 28, 22, 34, 30, 42, 38, 50, 46, 58];
  const w = 280;
  const h = 120;
  const max = 60;
  const step = w / (points.length - 1);
  const coords = points.map((p, i) => [i * step, h - (p / max) * h - 6]);
  const linePath = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${w},${h} L0,${h} Z`;
  return (
    <svg className="d-sparkline" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" data-pp-role="sparkline">
      <path className="area" d={areaPath} />
      <path className="line" d={linePath} />
      {coords.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2} />
      ))}
    </svg>
  );
}

function Donut() {
  // 120×120 donut — 4 segments
  const segs = [
    { pct: 42, cls: "accent" },
    { pct: 28, cls: "a" },
    { pct: 18, cls: "b" },
    { pct: 12, cls: "c" },
  ];
  const r = 46;
  const cx = 60;
  const cy = 60;
  const C = 2 * Math.PI * r;
  let offset = 0;
  const colors: Record<string, string> = {
    accent: "var(--d-color-accent)",
    a: "currentColor",
    b: "currentColor",
    c: "currentColor",
  };
  const opacities: Record<string, number> = { accent: 1, a: 0.7, b: 0.4, c: 0.2 };
  return (
    <svg className="d-donut-svg" viewBox="0 0 120 120" data-pp-role="donut">
      {segs.map((s, i) => {
        const len = (s.pct / 100) * C;
        const circle = (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={colors[s.cls]}
            strokeOpacity={opacities[s.cls]}
            strokeWidth={16}
            strokeDasharray={`${len} ${C - len}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        );
        offset += len;
        return circle;
      })}
    </svg>
  );
}
