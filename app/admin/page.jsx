"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Users,
  FileText,
  Code2,
  BarChart3,
  Briefcase,
  Crown,
  UserCheck,
  Activity,
  TrendingUp,
  Search,
  RefreshCw,
  ChevronLeft,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  MessageSquare,
} from "lucide-react";

const ADMIN_EMAIL = "nitinambiger11@gmail.com";

// ── Animated counter hook ──────────────────────────────────────────────────
function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

// ── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color, delay = 0 }) {
  const animated = useCountUp(value, 1000 + delay);
  return (
    <div
      className="stat-card"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`stat-icon-wrap ${color}`}>
        <Icon size={22} />
      </div>
      <div className="stat-body">
        <p className="stat-label">{label}</p>
        <p className="stat-value">{animated.toLocaleString()}</p>
        {sub && <p className="stat-sub">{sub}</p>}
      </div>
    </div>
  );
}

// ── Skeleton loader ─────────────────────────────────────────────────────────
function Skeleton({ w = "100%", h = "18px", r = "6px" }) {
  return (
    <div
      className="skeleton"
      style={{ width: w, height: h, borderRadius: r }}
    />
  );
}

// ── Badge ──────────────────────────────────────────────────────────────────
function Badge({ plan }) {
  return plan === "pro" ? (
    <span className="badge badge-pro">
      <Crown size={10} /> Pro
    </span>
  ) : (
    <span className="badge badge-free">Free</span>
  );
}

export default function AdminPanel() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("users");
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error || "Failed to fetch");
      }
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    if (!user || user.primaryEmailAddress?.emailAddress !== ADMIN_EMAIL) {
      router.push("/dashboard");
      return;
    }
    fetchStats();
  }, [user, isLoaded, fetchStats, router]);

  const filteredUsers = (data?.userList ?? []).filter((u) =>
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const proPercent =
    data && data.totalUsers > 0
      ? Math.round((data.proUsers / data.totalUsers) * 100)
      : 0;

  // ── Loading State ───────────────────────────────────────────────────────
  if (!isLoaded || loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="admin-wrap">
          <div className="admin-header">
            <Skeleton w="200px" h="32px" r="8px" />
            <Skeleton w="120px" h="36px" r="8px" />
          </div>
          <div className="stats-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="stat-card">
                <Skeleton w="48px" h="48px" r="12px" />
                <div className="stat-body">
                  <Skeleton w="80px" h="14px" />
                  <Skeleton w="60px" h="28px" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  // ── Error State ────────────────────────────────────────────────────────
  if (error) {
    return (
      <>
        <style>{styles}</style>
        <div className="admin-wrap" style={{ alignItems: "center", justifyContent: "center", display: "flex", minHeight: "60vh" }}>
          <div className="error-box">
            <XCircle size={40} color="#ef4444" />
            <p className="error-title">Failed to load admin data</p>
            <p className="error-desc">{error}</p>
            <button className="btn-refresh" onClick={fetchStats}>
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="admin-wrap">

        {/* ── Header ── */}
        <div className="admin-header">
          <div className="header-left">
            <button className="back-btn" onClick={() => router.push("/dashboard")}>
              <ChevronLeft size={16} /> Dashboard
            </button>
            <div>
              <h1 className="admin-title">Admin Panel</h1>
              <p className="admin-subtitle">Placify AI — Real-time overview</p>
            </div>
          </div>
          <button
            className="btn-refresh"
            onClick={fetchStats}
            disabled={refreshing}
          >
            <RefreshCw size={14} className={refreshing ? "spin" : ""} />
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
        </div>

        {/* ── Stat Cards ── */}
        <div className="stats-grid">
          <StatCard icon={Users}      label="Total Users"         value={data.totalUsers}        color="blue"   delay={0} />
          <StatCard icon={Crown}      label="Pro Users"           value={data.proUsers}          color="amber"  delay={60}  sub={`${proPercent}% of users`} />
          <StatCard icon={UserCheck}  label="Free Users"          value={data.freeUsers}         color="green"  delay={120} />
          <StatCard icon={FileText}   label="Mock Interviews"     value={data.totalInterviews}   color="purple" delay={180} />
          <StatCard icon={Code2}      label="Coding Submissions"  value={data.totalCoding}       color="cyan"   delay={240} />
          <StatCard icon={BarChart3}  label="Resume Analyses"     value={data.totalResumes}      color="pink"   delay={300} />
          <StatCard icon={TrendingUp} label="Skill Gap Analyses"  value={data.totalSkillGap}     color="orange" delay={360} />
          <StatCard icon={Briefcase}  label="Job Applications"    value={data.totalJobApps}      color="teal"   delay={420} />
          <StatCard icon={MessageSquare} label="AI Answers Given" value={data.totalAnswers}      color="indigo" delay={480} />
        </div>

        {/* ── Plan Breakdown Bar ── */}
        <div className="breakdown-card">
          <div className="breakdown-header">
            <Zap size={16} />
            <span>Plan Breakdown</span>
          </div>
          <div className="breakdown-bar-wrap">
            <div className="breakdown-bar">
              <div
                className="breakdown-fill-pro"
                style={{ width: `${proPercent}%` }}
              />
              <div
                className="breakdown-fill-free"
                style={{ width: `${100 - proPercent}%` }}
              />
            </div>
            <div className="breakdown-legend">
              <span className="legend-dot dot-pro" />
              <span>Pro — {data.proUsers} users ({proPercent}%)</span>
              <span className="legend-dot dot-free" />
              <span>Free — {data.freeUsers} users ({100 - proPercent}%)</span>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === "users" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <Users size={14} /> All Users ({data.totalUsers})
          </button>
          <button
            className={`tab ${activeTab === "interviews" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("interviews")}
          >
            <FileText size={14} /> Recent Interviews
          </button>
          <button
            className={`tab ${activeTab === "coding" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("coding")}
          >
            <Code2 size={14} /> Recent Coding
          </button>
        </div>

        {/* ── Users Table ── */}
        {activeTab === "users" && (
          <div className="table-card">
            <div className="table-toolbar">
              <div className="search-wrap">
                <Search size={14} />
                <input
                  className="search-input"
                  placeholder="Search by email…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <p className="table-count">{filteredUsers.length} users</p>
            </div>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Email</th>
                    <th>Plan</th>
                    <th>Interviews</th>
                    <th>Coding</th>
                    <th>Resumes</th>
                    <th>Skill Gap</th>
                    <th>Jobs</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: "center", padding: "32px", color: "#6b7280" }}>
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u, i) => (
                      <tr key={u.email}>
                        <td className="td-muted">{i + 1}</td>
                        <td className="td-email">{u.email}</td>
                        <td><Badge plan={u.plan} /></td>
                        <td className="td-num">{Number(u.interviews)}</td>
                        <td className="td-num">{Number(u.coding)}</td>
                        <td className="td-num">{Number(u.resumes)}</td>
                        <td className="td-num">{Number(u.skillgap)}</td>
                        <td className="td-num">{Number(u.jobs)}</td>
                        <td className="td-muted">
                          {u.first_seen
                            ? new Date(u.first_seen).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Recent Interviews ── */}
        {activeTab === "interviews" && (
          <div className="table-card">
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>User</th>
                    <th>Job Position</th>
                    <th>Experience</th>
                    <th>Round</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.recentInterviews ?? []).map((r, i) => (
                    <tr key={r.id}>
                      <td className="td-muted">{i + 1}</td>
                      <td className="td-email">{r.createdBy}</td>
                      <td>{r.jobPosition}</td>
                      <td className="td-muted">{r.jobExperience} yrs</td>
                      <td>
                        <span className="round-badge">{r.interviewRound}</span>
                      </td>
                      <td className="td-muted">
                        {r.createdAt
                          ? new Date(r.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Recent Coding Submissions ── */}
        {activeTab === "coding" && (
          <div className="table-card">
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>User</th>
                    <th>Challenge</th>
                    <th>Difficulty</th>
                    <th>Language</th>
                    <th>Solved</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.recentCoding ?? []).map((r, i) => (
                    <tr key={r.id}>
                      <td className="td-muted">{i + 1}</td>
                      <td className="td-email">{r.userEmail}</td>
                      <td>{r.challengeTitle}</td>
                      <td>
                        <span
                          className={`diff-badge diff-${r.difficulty?.toLowerCase()}`}
                        >
                          {r.difficulty}
                        </span>
                      </td>
                      <td className="td-muted">{r.language}</td>
                      <td>
                        {r.solved === "true" ? (
                          <CheckCircle2 size={16} color="#22c55e" />
                        ) : (
                          <XCircle size={16} color="#ef4444" />
                        )}
                      </td>
                      <td className="td-muted">
                        {r.createdAt
                          ? new Date(r.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <p className="footer-note">
          <Clock size={12} /> Data pulled live from Neon DB · Clerk Auth
        </p>
      </div>
    </>
  );
}

// ── CSS ────────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  .admin-wrap {
    font-family: 'Inter', sans-serif;
    min-height: 100vh;
    background: #0a0a0f;
    color: #e2e8f0;
    padding: 32px 24px 64px;
    max-width: 1400px;
    margin: 0 auto;
  }

  /* Header */
  .admin-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 32px;
    flex-wrap: wrap;
    gap: 12px;
  }
  .header-left { display: flex; align-items: flex-start; gap: 16px; flex-direction: column; }
  .back-btn {
    display: flex; align-items: center; gap: 6px;
    background: #1e1e2e; border: 1px solid #2d2d44;
    color: #94a3b8; border-radius: 8px; padding: 6px 14px;
    font-size: 13px; cursor: pointer; transition: all .2s;
  }
  .back-btn:hover { background: #2d2d44; color: #e2e8f0; }
  .admin-title { font-size: 28px; font-weight: 800; margin: 0; background: linear-gradient(135deg, #a78bfa, #60a5fa, #34d399); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .admin-subtitle { font-size: 13px; color: #475569; margin: 4px 0 0; }

  .btn-refresh {
    display: flex; align-items: center; gap: 6px;
    background: #1e1e2e; border: 1px solid #3730a3;
    color: #a78bfa; border-radius: 8px; padding: 8px 16px;
    font-size: 13px; font-weight: 500; cursor: pointer; transition: all .2s;
  }
  .btn-refresh:hover:not(:disabled) { background: #3730a3; color: #fff; }
  .btn-refresh:disabled { opacity: .6; cursor: not-allowed; }
  .spin { animation: spin 1s linear infinite; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

  /* Stat Cards */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }
  .stat-card {
    background: #12121f;
    border: 1px solid #1e1e3a;
    border-radius: 16px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    animation: fadeUp .4s ease both;
    transition: border-color .2s, transform .2s;
  }
  .stat-card:hover { border-color: #3730a3; transform: translateY(-2px); }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .stat-icon-wrap {
    width: 48px; height: 48px;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .stat-icon-wrap.blue   { background: rgba(96,165,250,.12); color: #60a5fa; }
  .stat-icon-wrap.amber  { background: rgba(251,191,36,.12);  color: #fbbf24; }
  .stat-icon-wrap.green  { background: rgba(52,211,153,.12);  color: #34d399; }
  .stat-icon-wrap.purple { background: rgba(167,139,250,.12); color: #a78bfa; }
  .stat-icon-wrap.cyan   { background: rgba(34,211,238,.12);  color: #22d3ee; }
  .stat-icon-wrap.pink   { background: rgba(244,114,182,.12); color: #f472b6; }
  .stat-icon-wrap.orange { background: rgba(251,146,60,.12);  color: #fb923c; }
  .stat-icon-wrap.teal   { background: rgba(45,212,191,.12);  color: #2dd4bf; }
  .stat-icon-wrap.indigo { background: rgba(99,102,241,.12);  color: #6366f1; }
  .stat-body { flex: 1; min-width: 0; }
  .stat-label { font-size: 12px; color: #64748b; font-weight: 500; margin: 0 0 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .stat-value { font-size: 26px; font-weight: 800; margin: 0; color: #f1f5f9; line-height: 1; }
  .stat-sub   { font-size: 11px; color: #475569; margin: 4px 0 0; }

  /* Plan Breakdown */
  .breakdown-card {
    background: #12121f;
    border: 1px solid #1e1e3a;
    border-radius: 16px;
    padding: 20px 24px;
    margin-bottom: 24px;
  }
  .breakdown-header {
    display: flex; align-items: center; gap: 8px;
    font-size: 14px; font-weight: 600; color: #94a3b8; margin-bottom: 16px;
  }
  .breakdown-bar-wrap {}
  .breakdown-bar {
    display: flex; height: 10px; border-radius: 10px; overflow: hidden;
    background: #1e1e3a; margin-bottom: 12px;
  }
  .breakdown-fill-pro  { background: linear-gradient(90deg, #a78bfa, #7c3aed); transition: width 1s ease; }
  .breakdown-fill-free { background: #1e293b; transition: width 1s ease; }
  .breakdown-legend { display: flex; align-items: center; gap: 20px; font-size: 13px; color: #94a3b8; flex-wrap: wrap; }
  .legend-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
  .dot-pro  { background: #a78bfa; }
  .dot-free { background: #334155; }

  /* Tabs */
  .tabs {
    display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap;
  }
  .tab {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 16px; border-radius: 8px; border: 1px solid #1e1e3a;
    background: #12121f; color: #64748b; font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all .2s;
  }
  .tab:hover { border-color: #3730a3; color: #a78bfa; }
  .tab-active { background: #1e1e3a; border-color: #4f46e5; color: #a78bfa; }

  /* Tables */
  .table-card {
    background: #12121f;
    border: 1px solid #1e1e3a;
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 24px;
  }
  .table-toolbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 20px; border-bottom: 1px solid #1e1e3a;
    flex-wrap: wrap; gap: 12px;
  }
  .search-wrap {
    display: flex; align-items: center; gap: 8px;
    background: #0a0a0f; border: 1px solid #2d2d44;
    border-radius: 8px; padding: 7px 14px; flex: 1; max-width: 360px;
  }
  .search-wrap svg { color: #475569; flex-shrink: 0; }
  .search-input {
    background: none; border: none; outline: none;
    color: #e2e8f0; font-size: 13px; width: 100%;
  }
  .search-input::placeholder { color: #475569; }
  .table-count { font-size: 12px; color: #475569; white-space: nowrap; }
  .table-scroll { overflow-x: auto; }
  .data-table {
    width: 100%; border-collapse: collapse; font-size: 13px;
  }
  .data-table th {
    padding: 12px 16px; text-align: left;
    font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .05em;
    color: #475569; border-bottom: 1px solid #1e1e3a; white-space: nowrap;
    background: #0d0d1a;
  }
  .data-table td {
    padding: 12px 16px; border-bottom: 1px solid #13131f;
    vertical-align: middle;
  }
  .data-table tr:last-child td { border-bottom: none; }
  .data-table tr:hover td { background: #1a1a2e; }
  .td-email { font-family: monospace; font-size: 12px; color: #94a3b8; max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .td-muted { color: #475569; font-size: 12px; }
  .td-num   { color: #e2e8f0; font-weight: 600; text-align: center; }

  /* Badges */
  .badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600;
  }
  .badge-pro  { background: rgba(167,139,250,.15); color: #a78bfa; border: 1px solid rgba(167,139,250,.3); }
  .badge-free { background: rgba(71,85,105,.2);    color: #64748b; border: 1px solid rgba(71,85,105,.3); }
  .round-badge {
    background: rgba(99,102,241,.15); color: #818cf8;
    padding: 3px 8px; border-radius: 6px; font-size: 11px;
  }
  .diff-badge { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
  .diff-easy   { background: rgba(34,197,94,.12); color: #22c55e; }
  .diff-medium { background: rgba(234,179,8,.12);  color: #eab308; }
  .diff-hard   { background: rgba(239,68,68,.12);  color: #ef4444; }

  /* Skeleton */
  .skeleton {
    background: linear-gradient(90deg, #1e1e2e 25%, #2d2d44 50%, #1e1e2e 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  @keyframes shimmer {
    from { background-position: 200% 0; }
    to   { background-position: -200% 0; }
  }

  /* Error */
  .error-box { display: flex; flex-direction: column; align-items: center; gap: 12px; text-align: center; }
  .error-title { font-size: 18px; font-weight: 700; color: #f1f5f9; }
  .error-desc  { font-size: 13px; color: #64748b; }

  /* Footer */
  .footer-note {
    display: flex; align-items: center; gap: 6px;
    font-size: 12px; color: #334155; margin-top: 8px;
  }
`;
