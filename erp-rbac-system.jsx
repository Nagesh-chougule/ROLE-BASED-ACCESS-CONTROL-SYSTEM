import { useState, useEffect } from "react";

const roles = [
  {
    id: "super_admin",
    title: "Super Admin",
    subtitle: "Institute Level",
    icon: "⚙",
    color: "#c9a227",
    bg: "from-amber-900/40 to-amber-800/20",
    border: "#c9a227",
    badge: "LEVEL 1",
    badgeColor: "#c9a227",
    description: "Apex authority over the entire ERP ecosystem. Full system sovereignty across all modules, users, and configurations.",
    modules: ["Academic", "Finance", "HR", "Hostel", "Exam", "Store", "Library", "Admin"],
    responsibilities: [
      "Overall ERP system governance and control",
      "Institute-wide policy and structure configuration",
      "Cross-department coordination and oversight",
      "Audit and compliance monitoring",
    ],
    permissions: [
      { category: "User Management", items: ["Create all user accounts", "Assign and revoke roles", "Reset credentials", "Deactivate/reactivate users", "Bulk user import/export"] },
      { category: "Institute Configuration", items: ["Configure institute settings", "Create and manage departments", "Define academic year structure", "Set up grading systems", "Configure ERP modules"] },
      { category: "Academic Control", items: ["Approve academic structures", "Manage courses & subjects", "Manage semesters & batches", "Approve admissions", "Academic calendar management"] },
      { category: "Finance & HR", items: ["Manage student fee structures", "Approve payroll processing", "Financial reports access", "Budget allocation", "Scholarship management"] },
      { category: "Module Administration", items: ["Configure hostel module", "Configure library module", "Configure store/inventory", "Configure exam module", "Enable/disable ERP features"] },
      { category: "Reports & Analytics", items: ["Access all system reports", "Export any data set", "View audit trails", "System health dashboard", "Performance analytics"] },
    ],
  },
  {
    id: "registrar",
    title: "Registrar",
    subtitle: "Academic Admin",
    icon: "📋",
    color: "#6c9bd2",
    bg: "from-blue-900/40 to-blue-800/20",
    border: "#6c9bd2",
    badge: "LEVEL 2",
    badgeColor: "#6c9bd2",
    description: "Central coordinator of all academic processes from admissions to transcript generation, ensuring academic integrity.",
    modules: ["Academic", "Exam", "Admin"],
    responsibilities: [
      "Academic record custodianship",
      "Admission process management",
      "Result publication oversight",
      "Academic calendar enforcement",
    ],
    permissions: [
      { category: "Admissions", items: ["Process student admissions", "Verify admission documents", "Approve/reject applications", "Generate enrollment numbers", "Manage admission quotas"] },
      { category: "Subject Management", items: ["Approve subject registrations", "Manage course prerequisites", "Handle subject change requests", "Configure credit structures"] },
      { category: "Academic Calendar", items: ["Create academic calendar", "Schedule examination dates", "Define semester start/end", "Declare holidays", "Set registration deadlines"] },
      { category: "Examination", items: ["Generate hall tickets", "Approve result publication", "Process certificate requests", "Manage revaluation workflow"] },
      { category: "Records", items: ["Maintain student academic records", "Issue transcripts", "Issue bonafide certificates", "Migration certificate processing", "Alumni record management"] },
    ],
  },
  {
    id: "hod",
    title: "Head of Department",
    subtitle: "HOD",
    icon: "🏛",
    color: "#8b5cf6",
    bg: "from-violet-900/40 to-violet-800/20",
    border: "#8b5cf6",
    badge: "LEVEL 3",
    badgeColor: "#8b5cf6",
    description: "Department-level academic leader overseeing faculty, curriculum delivery, and outcome-based education metrics.",
    modules: ["Academic", "Exam", "HR"],
    responsibilities: [
      "Departmental academic quality assurance",
      "Faculty performance oversight",
      "NBA/NAAC accreditation compliance",
      "Department-level strategic planning",
    ],
    permissions: [
      { category: "Faculty Management", items: ["View faculty profiles", "Assign subjects to faculty", "Approve faculty workload", "Monitor faculty performance", "Initiate faculty appraisals"] },
      { category: "Curriculum", items: ["Approve course files", "Review course outcomes (COs)", "Approve timetable", "Manage department electives", "Review syllabus compliance"] },
      { category: "Student Oversight", items: ["Monitor class attendance", "Approve internal marks", "Approve student project topics", "Review student progress", "Approve academic waivers"] },
      { category: "OBE & Accreditation", items: ["Review CO-PO attainment", "Approve PO mapping", "NBA documentation review", "Department accreditation reports"] },
      { category: "Reports", items: ["Department performance reports", "Faculty attendance reports", "Student result analysis", "Placement statistics", "Research activity reports"] },
    ],
  },
  {
    id: "faculty",
    title: "Faculty",
    subtitle: "Professor / Lecturer",
    icon: "👨‍🏫",
    color: "#10b981",
    bg: "from-emerald-900/40 to-emerald-800/20",
    border: "#10b981",
    badge: "LEVEL 4",
    badgeColor: "#10b981",
    description: "Core academic delivery engine responsible for teaching, assessment, and student mentoring within assigned subjects.",
    modules: ["Academic", "Exam"],
    responsibilities: [
      "Subject content delivery and assessment",
      "Student attendance and performance tracking",
      "Course outcome attainment measurement",
      "Project and thesis guidance",
    ],
    permissions: [
      { category: "Teaching", items: ["View assigned subjects", "Upload course materials", "Create lecture notes", "Share reference resources", "Manage course structure"] },
      { category: "Attendance", items: ["Mark daily attendance", "View attendance summary", "Request attendance correction", "Generate attendance reports"] },
      { category: "Assessment", items: ["Enter internal assessment marks", "Upload assignment questions", "Evaluate submitted assignments", "Enter lab/practical marks", "Submit final internal marks"] },
      { category: "Student Engagement", items: ["Communicate with students", "Guide student projects", "Provide feedback", "Respond to student queries", "Issue course completion status"] },
      { category: "OBE", items: ["Submit CO attainment data", "Map assessments to COs", "Update CO-PO mapping", "Review student outcome gaps"] },
    ],
  },
  {
    id: "student",
    title: "Student",
    subtitle: "Enrolled Learner",
    icon: "🎓",
    color: "#f472b6",
    bg: "from-pink-900/40 to-pink-800/20",
    border: "#f472b6",
    badge: "LEVEL 5",
    badgeColor: "#f472b6",
    description: "The primary beneficiary of the ERP system — accessing academics, hostel, finance, and personal services through a unified portal.",
    modules: ["Academic", "Hostel", "Finance", "Exam"],
    responsibilities: [
      "Self-service academic management",
      "Timely fee payment and financial compliance",
      "Assignment submission and academic engagement",
      "Hostel and campus service utilization",
    ],
    permissions: [
      { category: "Profile & Academics", items: ["View personal profile", "View timetable", "Register for subjects", "View attendance records", "Download study materials"] },
      { category: "Assignments", items: ["Submit assignments", "View assignment grades", "Download assignment sheets", "Track submission deadlines"] },
      { category: "Examination", items: ["View exam schedule", "Download hall ticket", "View semester results", "Apply for revaluation", "Track academic progress"] },
      { category: "Finance", items: ["View fee structure", "Pay fees online", "Download fee receipts", "Apply for scholarship", "View payment history"] },
      { category: "Services", items: ["Apply for hostel", "Apply for leave", "Request certificates", "Track complaint status", "Library book borrowing"] },
    ],
  },
  {
    id: "exam_cell",
    title: "Examination Cell",
    subtitle: "Exam Controller",
    icon: "📝",
    color: "#f97316",
    bg: "from-orange-900/40 to-orange-800/20",
    border: "#f97316",
    badge: "LEVEL 3",
    badgeColor: "#f97316",
    description: "Dedicated exam governance unit controlling scheduling, result processing, and academic integrity enforcement.",
    modules: ["Exam", "Academic"],
    responsibilities: [
      "End-to-end examination lifecycle management",
      "Secure question paper management",
      "Result tabulation and publication",
      "Revaluation and appeals processing",
    ],
    permissions: [
      { category: "Exam Scheduling", items: ["Create exam timetables", "Define exam venues", "Assign invigilators", "Generate seating arrangements", "Send exam notifications"] },
      { category: "Question Papers", items: ["Upload encrypted question papers", "Manage paper security", "Distribute papers to centers", "Manage paper sets/versions"] },
      { category: "Marks & Results", items: ["Enter/import marks", "Tabulate results", "Apply grace marks rules", "Generate result sheets", "Publish semester results"] },
      { category: "Documents", items: ["Generate hall tickets", "Issue transcripts", "Produce mark sheets", "Generate consolidated grade cards"] },
      { category: "Revaluation", items: ["Receive revaluation requests", "Assign revaluation faculty", "Process revaluation results", "Update revised marks"] },
    ],
  },
  {
    id: "hostel_warden",
    title: "Hostel Warden",
    subtitle: "Residential Manager",
    icon: "🏠",
    color: "#14b8a6",
    bg: "from-teal-900/40 to-teal-800/20",
    border: "#14b8a6",
    badge: "LEVEL 4",
    badgeColor: "#14b8a6",
    description: "Residential facility manager ensuring student welfare, discipline, and smooth hostel operations across all blocks.",
    modules: ["Hostel", "Finance"],
    responsibilities: [
      "Hostel accommodation lifecycle management",
      "Student welfare and discipline oversight",
      "Mess and facility service coordination",
      "Emergency and complaint resolution",
    ],
    permissions: [
      { category: "Room Management", items: ["View room inventory", "Allocate rooms to students", "Handle room change requests", "Mark vacant/occupied rooms", "Manage room maintenance"] },
      { category: "Attendance", items: ["Take hostel attendance", "View attendance reports", "Mark absentees", "Generate attendance summaries"] },
      { category: "Leave Management", items: ["Review leave applications", "Approve/reject hostel leave", "Track student movement", "Generate leave reports"] },
      { category: "Complaints", items: ["Receive complaints", "Assign to maintenance staff", "Track resolution status", "Escalate critical issues"] },
      { category: "Finance", items: ["Track mess bills", "Generate hostel fee invoices", "View payment status", "Manage caution deposits"] },
    ],
  },
  {
    id: "store_manager",
    title: "Store Manager",
    subtitle: "Inventory Controller",
    icon: "🏪",
    color: "#a78bfa",
    bg: "from-purple-900/40 to-purple-800/20",
    border: "#a78bfa",
    badge: "LEVEL 4",
    badgeColor: "#a78bfa",
    description: "Central procurement and inventory authority managing institute assets, consumables, and vendor relationships.",
    modules: ["Store", "Finance"],
    responsibilities: [
      "Inventory lifecycle management",
      "Procurement process coordination",
      "Vendor relationship management",
      "Asset tracking and audit compliance",
    ],
    permissions: [
      { category: "Inventory", items: ["Add/update item catalog", "Track stock levels", "Set reorder alerts", "Manage item categories", "Conduct stock audits"] },
      { category: "Issuance", items: ["Issue items to departments", "Receive returned items", "Track item usage", "Generate issue receipts", "Manage item reservations"] },
      { category: "Procurement", items: ["Create purchase requisitions", "Get quotations", "Raise purchase orders", "Track delivery status", "Receive and verify goods"] },
      { category: "Vendor Management", items: ["Maintain vendor database", "Evaluate vendor performance", "Manage vendor contracts", "Process vendor payments"] },
      { category: "Reports", items: ["Stock reports", "Consumption reports", "Pending PO reports", "Asset depreciation reports", "Audit trail reports"] },
    ],
  },
  {
    id: "library_admin",
    title: "Library Admin",
    subtitle: "Knowledge Resource Manager",
    icon: "📚",
    color: "#60a5fa",
    bg: "from-blue-900/40 to-blue-800/20",
    border: "#60a5fa",
    badge: "LEVEL 4",
    badgeColor: "#60a5fa",
    description: "Curator of the institute's knowledge ecosystem — managing physical and digital resources for the academic community.",
    modules: ["Library", "Academic"],
    responsibilities: [
      "Library resource acquisition and cataloging",
      "Circulation and membership management",
      "Digital resource and e-journal management",
      "NAAC library documentation",
    ],
    permissions: [
      { category: "Book Management", items: ["Add/remove books from catalog", "Classify and catalog books", "Manage book series/editions", "Track book conditions"] },
      { category: "Circulation", items: ["Issue books to members", "Process book returns", "Renew issued books", "Manage reservations", "Handle inter-library loans"] },
      { category: "Overdue & Fines", items: ["Track overdue books", "Generate fine notices", "Process fine payments", "Send reminder notifications"] },
      { category: "Digital Resources", items: ["Manage e-journals", "Configure digital library access", "Upload e-books", "Manage NPTEL/SWAYAM links"] },
      { category: "Reports", items: ["Issue/return reports", "Library usage analytics", "Member activity reports", "Collection development reports"] },
    ],
  },
  {
    id: "accounts",
    title: "Accounts & Finance",
    subtitle: "Financial Controller",
    icon: "💰",
    color: "#34d399",
    bg: "from-green-900/40 to-green-800/20",
    border: "#34d399",
    badge: "LEVEL 3",
    badgeColor: "#34d399",
    description: "Financial backbone of the institute managing all monetary flows — fees, salaries, budgets, and financial compliance.",
    modules: ["Finance", "HR", "Admin"],
    responsibilities: [
      "Institute financial lifecycle management",
      "Fee collection and reconciliation",
      "Payroll processing and compliance",
      "Financial reporting and audit support",
    ],
    permissions: [
      { category: "Fee Management", items: ["Configure fee structures", "Generate fee invoices", "Process fee payments", "Issue fee receipts", "Manage late fee/waivers"] },
      { category: "Scholarships", items: ["Register scholarship schemes", "Process scholarship applications", "Disburse scholarships", "Track scholarship utilization"] },
      { category: "Payroll", items: ["Process monthly payroll", "Calculate deductions (PF/ESI/TDS)", "Generate payslips", "Year-end salary reconciliation", "Manage advance/loan deductions"] },
      { category: "Accounting", items: ["Maintain ledger accounts", "Journal entries", "Bank reconciliation", "Budget allocation tracking", "Vendor payment processing"] },
      { category: "Reports", items: ["Daily collection reports", "Fee defaulter lists", "Financial statements", "Tax compliance reports", "Audit support reports"] },
    ],
  },
];

const moduleColors = {
  Academic: "#6c9bd2",
  Finance: "#34d399",
  HR: "#f97316",
  Hostel: "#14b8a6",
  Exam: "#f472b6",
  Store: "#a78bfa",
  Library: "#60a5fa",
  Admin: "#c9a227",
};

const allModules = ["Academic", "Finance", "HR", "Hostel", "Exam", "Store", "Library", "Admin"];

export default function ERPRoleSystem() {
  const [activeRole, setActiveRole] = useState(null);
  const [activeTab, setActiveTab] = useState("roles");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterModule, setFilterModule] = useState("All");
  const [matrixHover, setMatrixHover] = useState(null);
  const [expandedPerm, setExpandedPerm] = useState({});

  const filtered = roles.filter((r) => {
    const matchSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchModule = filterModule === "All" || r.modules.includes(filterModule);
    return matchSearch && matchModule;
  });

  const togglePerm = (roleId, cat) => {
    const key = `${roleId}-${cat}`;
    setExpandedPerm((p) => ({ ...p, [key]: !p[key] }));
  };

  const stats = {
    totalRoles: roles.length,
    totalPermissions: roles.reduce((acc, r) => acc + r.permissions.reduce((a, p) => a + p.items.length, 0), 0),
    totalModules: allModules.length,
    accessLevels: 5,
  };

  return (
    <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif", background: "#0a0e1a", minHeight: "100vh", color: "#e2e8f0" }}>
      {/* Background texture */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(108,155,210,0.07) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(201,162,39,0.05) 0%, transparent 50%)",
        pointerEvents: "none"
      }} />
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, opacity: 0.03,
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.5) 40px, rgba(255,255,255,0.5) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.5) 40px, rgba(255,255,255,0.5) 41px)",
        pointerEvents: "none"
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <header style={{ borderBottom: "1px solid rgba(201,162,39,0.3)", padding: "24px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(10,14,26,0.8)", backdropFilter: "blur(12px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #c9a227, #8b6914)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, boxShadow: "0 0 20px rgba(201,162,39,0.4)" }}>⚙</div>
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.3em", color: "#c9a227", textTransform: "uppercase", fontFamily: "'Georgia', serif" }}>Engineering College</div>
              <div style={{ fontSize: 18, fontWeight: "bold", letterSpacing: "0.05em", color: "#f1f5f9" }}>Enterprise Resource Planning</div>
              <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "#64748b", textTransform: "uppercase" }}>Role-Based Access Control System</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "24px" }}>
            {[
              { label: "Roles", value: stats.totalRoles },
              { label: "Permissions", value: stats.totalPermissions },
              { label: "Modules", value: stats.totalModules },
              { label: "Access Levels", value: stats.accessLevels },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center", borderLeft: "1px solid rgba(255,255,255,0.1)", paddingLeft: 20 }}>
                <div style={{ fontSize: 22, fontWeight: "bold", color: "#c9a227", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 10, color: "#64748b", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </header>

        {/* Nav Tabs */}
        <div style={{ padding: "0 40px", background: "rgba(10,14,26,0.6)", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 0 }}>
          {["roles", "matrix", "hierarchy"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: "14px 28px", border: "none", background: "transparent", cursor: "pointer", fontSize: 12,
              letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "Georgia, serif",
              color: activeTab === tab ? "#c9a227" : "#64748b",
              borderBottom: activeTab === tab ? "2px solid #c9a227" : "2px solid transparent",
              transition: "all 0.2s"
            }}>
              {tab === "roles" ? "Role Directory" : tab === "matrix" ? "Permission Matrix" : "Access Hierarchy"}
            </button>
          ))}
        </div>

        {activeTab === "roles" && (
          <div style={{ padding: "32px 40px" }}>
            {/* Search & Filter */}
            <div style={{ display: "flex", gap: 12, marginBottom: 32, alignItems: "center" }}>
              <div style={{ position: "relative", flex: 1, maxWidth: 400 }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#64748b", fontSize: 14 }}>⌕</span>
                <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search roles..." style={{
                  width: "100%", padding: "10px 12px 10px 36px", background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "#e2e8f0",
                  fontSize: 13, fontFamily: "Georgia, serif", outline: "none", boxSizing: "border-box"
                }} />
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {["All", ...allModules].map((m) => (
                  <button key={m} onClick={() => setFilterModule(m)} style={{
                    padding: "8px 14px", borderRadius: 4, border: "1px solid",
                    borderColor: filterModule === m ? (moduleColors[m] || "#c9a227") : "rgba(255,255,255,0.1)",
                    background: filterModule === m ? `${moduleColors[m] || "#c9a227"}20` : "transparent",
                    color: filterModule === m ? (moduleColors[m] || "#c9a227") : "#64748b",
                    cursor: "pointer", fontSize: 11, letterSpacing: "0.1em", fontFamily: "Georgia, serif",
                    transition: "all 0.2s"
                  }}>{m}</button>
                ))}
              </div>
            </div>

            {/* Role Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 20 }}>
              {filtered.map((role) => (
                <div key={role.id} onClick={() => setActiveRole(activeRole?.id === role.id ? null : role)}
                  style={{
                    borderRadius: 10, border: `1px solid ${activeRole?.id === role.id ? role.border : "rgba(255,255,255,0.08)"}`,
                    background: activeRole?.id === role.id ? `linear-gradient(135deg, ${role.border}15, rgba(10,14,26,0.9))` : "rgba(255,255,255,0.03)",
                    cursor: "pointer", transition: "all 0.25s", overflow: "hidden",
                    boxShadow: activeRole?.id === role.id ? `0 0 30px ${role.border}20` : "none"
                  }}>
                  {/* Card Header */}
                  <div style={{ padding: "18px 20px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 8,
                        background: `${role.border}20`, border: `1px solid ${role.border}40`,
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0
                      }}>{role.icon}</div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: "bold", color: "#f1f5f9", letterSpacing: "0.02em" }}>{role.title}</div>
                        <div style={{ fontSize: 11, color: role.color, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 2 }}>{role.subtitle}</div>
                      </div>
                    </div>
                    <span style={{
                      fontSize: 9, padding: "3px 8px", borderRadius: 3, letterSpacing: "0.15em",
                      border: `1px solid ${role.badgeColor}50`, color: role.badgeColor,
                      background: `${role.badgeColor}10`, fontFamily: "Georgia, serif"
                    }}>{role.badge}</span>
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: "14px 20px" }}>
                    <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6, margin: "0 0 14px" }}>{role.description}</p>

                    {/* Modules */}
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                      {role.modules.map((m) => (
                        <span key={m} style={{
                          fontSize: 10, padding: "3px 8px", borderRadius: 3,
                          background: `${moduleColors[m]}15`, border: `1px solid ${moduleColors[m]}30`,
                          color: moduleColors[m], letterSpacing: "0.08em"
                        }}>{m}</span>
                      ))}
                    </div>

                    {/* Responsibilities preview */}
                    <div style={{ fontSize: 11, color: "#64748b" }}>
                      {role.responsibilities.slice(0, 2).map((r, i) => (
                        <div key={i} style={{ display: "flex", gap: 6, marginBottom: 4, alignItems: "flex-start" }}>
                          <span style={{ color: role.color, marginTop: 1 }}>◆</span>
                          <span>{r}</span>
                        </div>
                      ))}
                      {role.responsibilities.length > 2 && (
                        <div style={{ color: role.color, fontSize: 10, marginTop: 4 }}>+{role.responsibilities.length - 2} more responsibilities</div>
                      )}
                    </div>

                    {/* Permission count */}
                    <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontSize: 11, color: "#475569" }}>
                        <span style={{ color: role.color, fontWeight: "bold" }}>
                          {role.permissions.reduce((a, p) => a + p.items.length, 0)}
                        </span> permissions across <span style={{ color: role.color }}>{role.permissions.length}</span> categories
                      </div>
                      <div style={{ fontSize: 10, color: role.color, letterSpacing: "0.1em" }}>
                        {activeRole?.id === role.id ? "▲ COLLAPSE" : "▼ EXPAND"}
                      </div>
                    </div>
                  </div>

                  {/* Expanded permissions */}
                  {activeRole?.id === role.id && (
                    <div style={{ borderTop: `1px solid ${role.border}30`, padding: "16px 20px", background: "rgba(0,0,0,0.2)" }}>
                      <div style={{ fontSize: 11, letterSpacing: "0.2em", color: role.color, textTransform: "uppercase", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                        <span>●</span> Full Permission Set
                      </div>

                      {/* Responsibilities */}
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 10, letterSpacing: "0.15em", color: "#475569", textTransform: "uppercase", marginBottom: 8 }}>Core Responsibilities</div>
                        {role.responsibilities.map((r, i) => (
                          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5, alignItems: "flex-start" }}>
                            <span style={{ color: role.color, fontSize: 10, marginTop: 2 }}>▸</span>
                            <span style={{ fontSize: 12, color: "#94a3b8" }}>{r}</span>
                          </div>
                        ))}
                      </div>

                      {/* Permission Categories */}
                      {role.permissions.map((perm) => {
                        const key = `${role.id}-${perm.category}`;
                        const isOpen = expandedPerm[key];
                        return (
                          <div key={perm.category} style={{ marginBottom: 8, borderRadius: 6, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
                            <div onClick={(e) => { e.stopPropagation(); togglePerm(role.id, perm.category); }} style={{
                              padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center",
                              cursor: "pointer", background: `${role.border}10`
                            }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ width: 6, height: 6, borderRadius: "50%", background: role.color, display: "inline-block" }} />
                                <span style={{ fontSize: 11, fontWeight: "bold", color: "#cbd5e1", letterSpacing: "0.05em" }}>{perm.category}</span>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ fontSize: 10, color: role.color }}>{perm.items.length} perms</span>
                                <span style={{ fontSize: 10, color: "#475569" }}>{isOpen ? "▲" : "▼"}</span>
                              </div>
                            </div>
                            {isOpen && (
                              <div style={{ padding: "10px 12px", background: "rgba(0,0,0,0.15)" }}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                                  {perm.items.map((item, i) => (
                                    <div key={i} style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                                      <span style={{ color: role.color, fontSize: 8, marginTop: 4, flexShrink: 0 }}>✓</span>
                                      <span style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.4 }}>{item}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "matrix" && (
          <div style={{ padding: "32px 40px" }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#64748b", textTransform: "uppercase", marginBottom: 4 }}>Module Access Matrix</div>
              <div style={{ fontSize: 13, color: "#94a3b8" }}>Cross-reference of roles and module access across the ERP system</div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr>
                    <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(201,162,39,0.4)", color: "#c9a227", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", minWidth: 180 }}>Role</th>
                    {allModules.map((m) => (
                      <th key={m} style={{ padding: "12px 10px", textAlign: "center", borderBottom: "2px solid rgba(201,162,39,0.4)", minWidth: 90 }}>
                        <div style={{ fontSize: 9, letterSpacing: "0.1em", color: moduleColors[m], textTransform: "uppercase", writingMode: "vertical-rl", transform: "rotate(180deg)", height: 70, display: "flex", alignItems: "center" }}>{m}</div>
                      </th>
                    ))}
                    <th style={{ padding: "12px 10px", textAlign: "center", borderBottom: "2px solid rgba(201,162,39,0.4)", color: "#64748b", fontSize: 10, letterSpacing: "0.1em", minWidth: 80 }}>TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((role, ri) => (
                    <tr key={role.id} onMouseEnter={() => setMatrixHover(role.id)} onMouseLeave={() => setMatrixHover(null)}
                      style={{ background: matrixHover === role.id ? `${role.border}08` : ri % 2 === 0 ? "rgba(255,255,255,0.015)" : "transparent", transition: "background 0.15s" }}>
                      <td style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 16 }}>{role.icon}</span>
                          <div>
                            <div style={{ color: role.color, fontWeight: "bold", fontSize: 12 }}>{role.title}</div>
                            <div style={{ color: "#475569", fontSize: 10 }}>{role.subtitle}</div>
                          </div>
                        </div>
                      </td>
                      {allModules.map((m) => {
                        const hasAccess = role.modules.includes(m);
                        return (
                          <td key={m} style={{ padding: "10px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                            {hasAccess ? (
                              <div style={{
                                width: 28, height: 28, borderRadius: 6, margin: "0 auto",
                                background: `${moduleColors[m]}20`, border: `1px solid ${moduleColors[m]}50`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: moduleColors[m], fontSize: 13, fontWeight: "bold"
                              }}>✓</div>
                            ) : (
                              <div style={{ width: 28, height: 28, borderRadius: 6, margin: "0 auto", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", color: "#1e293b", fontSize: 12 }}>—</div>
                            )}
                          </td>
                        );
                      })}
                      <td style={{ padding: "10px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <span style={{ fontWeight: "bold", color: role.color, fontSize: 14 }}>{role.modules.length}</span>
                        <span style={{ color: "#475569", fontSize: 10 }}>/{allModules.length}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td style={{ padding: "10px 16px", color: "#c9a227", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", borderTop: "1px solid rgba(201,162,39,0.3)" }}>Module Coverage</td>
                    {allModules.map((m) => {
                      const count = roles.filter((r) => r.modules.includes(m)).length;
                      return (
                        <td key={m} style={{ textAlign: "center", padding: "10px", borderTop: "1px solid rgba(201,162,39,0.3)" }}>
                          <div style={{ color: moduleColors[m], fontWeight: "bold", fontSize: 13 }}>{count}</div>
                          <div style={{ color: "#475569", fontSize: 9 }}>roles</div>
                        </td>
                      );
                    })}
                    <td style={{ borderTop: "1px solid rgba(201,162,39,0.3)" }} />
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Legend */}
            <div style={{ marginTop: 28, display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ fontSize: 10, color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase" }}>Module Legend:</div>
              {allModules.map((m) => (
                <div key={m} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: moduleColors[m] }} />
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>{m}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "hierarchy" && (
          <div style={{ padding: "32px 40px" }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#64748b", textTransform: "uppercase", marginBottom: 4 }}>Authority Hierarchy</div>
              <div style={{ fontSize: 13, color: "#94a3b8" }}>Organizational authority chain and inter-role relationships</div>
            </div>

            {/* Hierarchy Visual */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, maxWidth: 900, margin: "0 auto" }}>
              {/* Level 1 */}
              <HierarchyLevel level="LEVEL 1 — INSTITUTE APEX" roles={[roles[0]]} color="#c9a227" />
              <Connector />
              {/* Level 2 */}
              <HierarchyLevel level="LEVEL 2 — ACADEMIC ADMINISTRATION" roles={[roles[1], roles[5]]} color="#6c9bd2" />
              <Connector />
              {/* Level 3 */}
              <HierarchyLevel level="LEVEL 3 — DEPARTMENT / OPERATIONS MANAGEMENT" roles={[roles[2], roles[9]]} color="#8b5cf6" />
              <Connector />
              {/* Level 4 */}
              <HierarchyLevel level="LEVEL 4 — FUNCTIONAL SPECIALISTS" roles={[roles[3], roles[6], roles[7], roles[8]]} color="#10b981" />
              <Connector />
              {/* Level 5 */}
              <HierarchyLevel level="LEVEL 5 — END USERS" roles={[roles[4]]} color="#f472b6" />
            </div>

            {/* Interaction Map */}
            <div style={{ marginTop: 48 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#64748b", textTransform: "uppercase", marginBottom: 20 }}>Role Interaction Map</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
                {[
                  { from: "Super Admin", to: "All Roles", type: "Manages", desc: "Creates, configures, and oversees all system users" },
                  { from: "Registrar", to: "Faculty, Students", type: "Coordinates", desc: "Academic records, admissions, and exam coordination" },
                  { from: "HOD", to: "Faculty", type: "Supervises", desc: "Assigns subjects, monitors performance, approves marks" },
                  { from: "Faculty", to: "Students", type: "Instructs", desc: "Delivers courses, marks attendance, evaluates assignments" },
                  { from: "Exam Cell", to: "Registrar, Faculty", type: "Coordinates", desc: "Hall tickets, results, and revaluation workflow" },
                  { from: "Hostel Warden", to: "Students", type: "Manages", desc: "Room allocation, attendance, leave, and mess billing" },
                  { from: "Accounts", to: "Students, Faculty", type: "Services", desc: "Fee collection, payroll, scholarships, and receipts" },
                  { from: "Store Manager", to: "All Departments", type: "Supplies", desc: "Equipment issue, stock management, procurement" },
                  { from: "Library Admin", to: "Students, Faculty", type: "Services", desc: "Book issuance, digital resources, overdue tracking" },
                ].map((rel, i) => (
                  <div key={i} style={{ padding: "14px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: "bold", color: "#c9a227" }}>{rel.from}</span>
                      <span style={{ fontSize: 10, color: "#475569" }}>→</span>
                      <span style={{ fontSize: 11, color: "#94a3b8" }}>{rel.to}</span>
                    </div>
                    <span style={{ fontSize: 9, letterSpacing: "0.15em", color: "#3b82f6", textTransform: "uppercase", background: "rgba(59,130,246,0.1)", padding: "2px 6px", borderRadius: 3 }}>{rel.type}</span>
                    <p style={{ fontSize: 11, color: "#64748b", marginTop: 8, lineHeight: 1.5 }}>{rel.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer style={{ padding: "20px 40px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 11, color: "#334155" }}>Engineering College ERP — Role-Based Access Control v2.0</div>
          <div style={{ display: "flex", gap: 20 }}>
            {["ISO 27001 Compliant", "AICTE Guidelines", "NBA/NAAC Ready"].map((tag) => (
              <span key={tag} style={{ fontSize: 10, color: "#475569", letterSpacing: "0.1em", borderLeft: "1px solid rgba(255,255,255,0.08)", paddingLeft: 12 }}>{tag}</span>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}

function HierarchyLevel({ level, roles, color }) {
  return (
    <div style={{ width: "100%", marginBottom: 4 }}>
      <div style={{ textAlign: "center", fontSize: 9, letterSpacing: "0.2em", color: color, textTransform: "uppercase", marginBottom: 10 }}>{level}</div>
      <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
        {roles.map((role) => (
          <div key={role.id} style={{
            padding: "12px 18px", borderRadius: 8, border: `1px solid ${role.border}50`,
            background: `${role.border}10`, display: "flex", alignItems: "center", gap: 10,
            minWidth: 180, flex: "0 1 auto"
          }}>
            <span style={{ fontSize: 20 }}>{role.icon}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: "bold", color: role.color }}>{role.title}</div>
              <div style={{ fontSize: 10, color: "#475569" }}>{role.subtitle}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Connector() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "4px 0" }}>
      <div style={{ width: 1, height: 20, background: "linear-gradient(to bottom, rgba(201,162,39,0.4), rgba(201,162,39,0.1))" }} />
      <div style={{ fontSize: 10, color: "rgba(201,162,39,0.4)" }}>▼</div>
    </div>
  );
}
