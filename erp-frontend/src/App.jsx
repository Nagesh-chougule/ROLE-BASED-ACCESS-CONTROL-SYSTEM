import { useState, useEffect, useCallback, useRef } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const ROLES_CONFIG = {
  super_admin: {
    id: "super_admin", title: "Super Admin", subtitle: "Institute Level", icon: "⚙", level: 1,
    color: "#d4a017", bg: "rgba(212,160,23,0.12)", border: "rgba(212,160,23,0.35)",
    description: "Apex authority with full system sovereignty across all ERP modules.",
    modules: ["academic", "finance", "hr", "hostel", "exam", "store", "library", "admin"],
    permissionCategories: [
      { id: "user_mgmt", label: "User Management", perms: ["Create Users", "Edit Users", "Delete Users", "Assign Roles", "Reset Passwords", "Bulk Import", "View All Users", "Deactivate Users"] },
      { id: "institute", label: "Institute Config", perms: ["Configure Institute", "Manage Departments", "Academic Year Setup", "Setup Grading System", "Configure Modules", "System Settings"] },
      { id: "academic_ctrl", label: "Academic Control", perms: ["Approve Academic Structure", "Manage Courses", "Manage Subjects", "Manage Semesters", "Approve Admissions", "Academic Calendar"] },
      { id: "finance_hr", label: "Finance & HR", perms: ["Manage Fee Structure", "Approve Payroll", "Financial Reports", "Budget Allocation", "Manage Scholarships", "HR Reports"] },
      { id: "reports_all", label: "Reports & Analytics", perms: ["All System Reports", "Export Any Data", "View Audit Trails", "System Health", "Performance Analytics", "Custom Reports"] },
      { id: "module_admin", label: "Module Administration", perms: ["Configure Hostel", "Configure Library", "Configure Store", "Configure Exam", "Enable/Disable Features", "API Access"] },
    ]
  },
  registrar: {
    id: "registrar", title: "Registrar", subtitle: "Academic Admin", icon: "📋", level: 2,
    color: "#5b9bd5", bg: "rgba(91,155,213,0.12)", border: "rgba(91,155,213,0.35)",
    description: "Central coordinator of all academic processes from admissions to transcripts.",
    modules: ["academic", "exam", "admin"],
    permissionCategories: [
      { id: "admissions", label: "Admissions", perms: ["Process Admissions", "Verify Documents", "Approve Applications", "Generate Enrollment Numbers", "Manage Quotas"] },
      { id: "subject_reg", label: "Subject Management", perms: ["Approve Subject Registrations", "Manage Prerequisites", "Handle Change Requests", "Configure Credits"] },
      { id: "calendar", label: "Academic Calendar", perms: ["Create Academic Calendar", "Schedule Exam Dates", "Define Semesters", "Declare Holidays", "Set Deadlines"] },
      { id: "exam_reg", label: "Examination", perms: ["Generate Hall Tickets", "Approve Results Publication", "Process Certificates", "Manage Revaluation"] },
      { id: "records", label: "Student Records", perms: ["Maintain Student Records", "Issue Transcripts", "Issue Bonafide Certificates", "Migration Certificates", "Alumni Records"] },
    ]
  },
  hod: {
    id: "hod", title: "Head of Department", subtitle: "HOD", icon: "🏛", level: 3,
    color: "#9b72cf", bg: "rgba(155,114,207,0.12)", border: "rgba(155,114,207,0.35)",
    description: "Department-level academic leader overseeing faculty, curriculum and OBE metrics.",
    modules: ["academic", "exam", "hr"],
    permissionCategories: [
      { id: "faculty_mgmt", label: "Faculty Management", perms: ["View Faculty Profiles", "Assign Subjects to Faculty", "Approve Faculty Workload", "Monitor Performance", "Initiate Appraisals"] },
      { id: "curriculum", label: "Curriculum", perms: ["Approve Course Files", "Review Course Outcomes", "Approve Timetable", "Manage Dept. Electives", "Review Syllabus Compliance"] },
      { id: "student_over", label: "Student Oversight", perms: ["Monitor Class Attendance", "Approve Internal Marks", "Approve Project Topics", "Review Student Progress", "Approve Academic Waivers"] },
      { id: "obe", label: "OBE & Accreditation", perms: ["Review CO-PO Attainment", "Approve PO Mapping", "NBA Documentation", "Department Reports"] },
    ]
  },
  faculty: {
    id: "faculty", title: "Faculty", subtitle: "Professor / Lecturer", icon: "👨‍🏫", level: 4,
    color: "#10b981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.35)",
    description: "Core academic delivery responsible for teaching, assessment, and student mentoring.",
    modules: ["academic", "exam"],
    permissionCategories: [
      { id: "teaching", label: "Teaching", perms: ["View Assigned Subjects", "Upload Course Materials", "Create Lecture Notes", "Share Reference Resources"] },
      { id: "attendance_f", label: "Attendance", perms: ["Mark Daily Attendance", "View Attendance Summary", "Request Correction", "Generate Attendance Reports"] },
      { id: "assessment", label: "Assessment", perms: ["Enter Internal Marks", "Upload Assignment Questions", "Evaluate Assignments", "Enter Lab Marks", "Submit Final Marks"] },
      { id: "engagement", label: "Student Engagement", perms: ["Communicate with Students", "Guide Student Projects", "Provide Feedback", "Respond to Queries"] },
      { id: "obe_f", label: "OBE", perms: ["Submit CO Attainment", "Map Assessments to COs", "Update CO-PO Mapping"] },
    ]
  },
  student: {
    id: "student", title: "Student", subtitle: "Enrolled Learner", icon: "🎓", level: 5,
    color: "#f472b6", bg: "rgba(244,114,182,0.12)", border: "rgba(244,114,182,0.35)",
    description: "Primary beneficiary accessing academics, hostel, finance, and campus services.",
    modules: ["academic", "hostel", "finance", "exam"],
    permissionCategories: [
      { id: "profile_s", label: "Profile & Academics", perms: ["View Personal Profile", "View Timetable", "Register Subjects", "View Attendance", "Download Study Materials"] },
      { id: "assignments_s", label: "Assignments", perms: ["Submit Assignments", "View Assignment Grades", "Download Assignment Sheets", "Track Submission Deadlines"] },
      { id: "exam_s", label: "Examination", perms: ["View Exam Schedule", "Download Hall Ticket", "View Semester Results", "Apply for Revaluation", "Track Academic Progress"] },
      { id: "finance_s", label: "Finance", perms: ["View Fee Structure", "Pay Fees Online", "Download Fee Receipts", "Apply for Scholarship", "View Payment History"] },
      { id: "services_s", label: "Services", perms: ["Apply for Hostel", "Apply for Leave", "Request Certificates", "Track Complaint Status", "Library Book Borrowing"] },
    ]
  },
  exam_cell: {
    id: "exam_cell", title: "Examination Cell", subtitle: "Exam Controller", icon: "📝", level: 3,
    color: "#f97316", bg: "rgba(249,115,22,0.12)", border: "rgba(249,115,22,0.35)",
    description: "Dedicated exam governance controlling scheduling, results, and academic integrity.",
    modules: ["exam", "academic"],
    permissionCategories: [
      { id: "scheduling", label: "Exam Scheduling", perms: ["Create Exam Timetables", "Define Exam Venues", "Assign Invigilators", "Generate Seating Arrangements", "Send Exam Notifications"] },
      { id: "papers", label: "Question Papers", perms: ["Upload Encrypted Papers", "Manage Paper Security", "Distribute to Centers", "Manage Paper Sets/Versions"] },
      { id: "marks", label: "Marks & Results", perms: ["Enter/Import Marks", "Tabulate Results", "Apply Grace Mark Rules", "Generate Result Sheets", "Publish Semester Results"] },
      { id: "docs_exam", label: "Documents", perms: ["Generate Hall Tickets", "Issue Transcripts", "Produce Mark Sheets", "Generate Grade Cards"] },
      { id: "reval", label: "Revaluation", perms: ["Receive Revaluation Requests", "Assign Revaluation Faculty", "Process Revaluation Results", "Update Revised Marks"] },
    ]
  },
  hostel_warden: {
    id: "hostel_warden", title: "Hostel Warden", subtitle: "Residential Manager", icon: "🏠", level: 4,
    color: "#14b8a6", bg: "rgba(20,184,166,0.12)", border: "rgba(20,184,166,0.35)",
    description: "Residential facility manager ensuring student welfare and smooth hostel operations.",
    modules: ["hostel", "finance"],
    permissionCategories: [
      { id: "rooms", label: "Room Management", perms: ["View Room Inventory", "Allocate Rooms to Students", "Handle Room Change Requests", "Mark Vacant/Occupied", "Manage Maintenance"] },
      { id: "hostel_att", label: "Attendance", perms: ["Take Hostel Attendance", "View Attendance Reports", "Mark Absentees", "Generate Summaries"] },
      { id: "leave_h", label: "Leave Management", perms: ["Review Leave Applications", "Approve/Reject Leave", "Track Student Movement", "Generate Leave Reports"] },
      { id: "complaints_h", label: "Complaints", perms: ["Receive Complaints", "Assign to Maintenance Staff", "Track Resolution Status", "Escalate Critical Issues"] },
      { id: "finance_h", label: "Finance", perms: ["Track Mess Bills", "Generate Hostel Invoices", "View Payment Status", "Manage Caution Deposits"] },
    ]
  },
  store_manager: {
    id: "store_manager", title: "Store Manager", subtitle: "Inventory Controller", icon: "🏪", level: 4,
    color: "#a78bfa", bg: "rgba(167,139,250,0.12)", border: "rgba(167,139,250,0.35)",
    description: "Central procurement and inventory authority managing assets and vendor relations.",
    modules: ["store", "finance"],
    permissionCategories: [
      { id: "inventory_s", label: "Inventory", perms: ["Add/Update Item Catalog", "Track Stock Levels", "Set Reorder Alerts", "Manage Item Categories", "Conduct Stock Audits"] },
      { id: "issuance_s", label: "Issuance", perms: ["Issue Items to Departments", "Receive Returned Items", "Track Item Usage", "Generate Issue Receipts", "Manage Reservations"] },
      { id: "procurement", label: "Procurement", perms: ["Create Purchase Requisitions", "Get Quotations", "Raise Purchase Orders", "Track Delivery Status", "Receive & Verify Goods"] },
      { id: "vendors", label: "Vendor Management", perms: ["Maintain Vendor Database", "Evaluate Vendor Performance", "Manage Vendor Contracts", "Process Vendor Payments"] },
    ]
  },
  library_admin: {
    id: "library_admin", title: "Library Admin", subtitle: "Knowledge Resource Manager", icon: "📚", level: 4,
    color: "#60a5fa", bg: "rgba(96,165,250,0.12)", border: "rgba(96,165,250,0.35)",
    description: "Curator of the institute's knowledge ecosystem — physical and digital resources.",
    modules: ["library", "academic"],
    permissionCategories: [
      { id: "books", label: "Book Management", perms: ["Add/Remove Books", "Classify & Catalog", "Manage Book Series/Editions", "Track Book Conditions"] },
      { id: "circulation", label: "Circulation", perms: ["Issue Books to Members", "Process Book Returns", "Renew Issued Books", "Manage Reservations", "Inter-Library Loans"] },
      { id: "overdue", label: "Overdue & Fines", perms: ["Track Overdue Books", "Generate Fine Notices", "Process Fine Payments", "Send Reminder Notifications"] },
      { id: "digital_r", label: "Digital Resources", perms: ["Manage E-Journals", "Configure Digital Library Access", "Upload E-Books", "Manage NPTEL/SWAYAM Links"] },
    ]
  },
  accounts: {
    id: "accounts", title: "Accounts & Finance", subtitle: "Financial Controller", icon: "💰", level: 3,
    color: "#34d399", bg: "rgba(52,211,153,0.12)", border: "rgba(52,211,153,0.35)",
    description: "Financial backbone managing all monetary flows — fees, salaries, budgets, compliance.",
    modules: ["finance", "hr", "admin"],
    permissionCategories: [
      { id: "fees", label: "Fee Management", perms: ["Configure Fee Structures", "Generate Fee Invoices", "Process Fee Payments", "Issue Fee Receipts", "Manage Late Fee/Waivers"] },
      { id: "scholar", label: "Scholarships", perms: ["Register Scholarship Schemes", "Process Applications", "Disburse Scholarships", "Track Utilization"] },
      { id: "payroll", label: "Payroll", perms: ["Process Monthly Payroll", "Calculate Deductions (PF/ESI/TDS)", "Generate Payslips", "Year-End Salary Reconciliation", "Manage Advance/Loan Deductions"] },
      { id: "accounting", label: "Accounting", perms: ["Maintain Ledger Accounts", "Journal Entries", "Bank Reconciliation", "Budget Allocation Tracking", "Vendor Payment Processing"] },
      { id: "fin_reports", label: "Reports", perms: ["Daily Collection Reports", "Fee Defaulter Lists", "Financial Statements", "Tax Compliance Reports", "Audit Support Reports"] },
    ]
  },
};

const MODULES = {
  academic: { id: "academic", label: "Academic", icon: "🎓", color: "#5b9bd5" },
  finance: { id: "finance", label: "Finance", icon: "💳", color: "#34d399" },
  hr: { id: "hr", label: "HR", icon: "👥", color: "#f97316" },
  hostel: { id: "hostel", label: "Hostel", icon: "🏠", color: "#14b8a6" },
  exam: { id: "exam", label: "Exam", icon: "📝", color: "#f472b6" },
  store: { id: "store", label: "Store", icon: "📦", color: "#a78bfa" },
  library: { id: "library", label: "Library", icon: "📚", color: "#60a5fa" },
  admin: { id: "admin", label: "Admin", icon: "⚙", color: "#d4a017" },
};

const DEPARTMENTS = ["Computer Engineering", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering", "Electronics & Telecom", "Information Technology", "Applied Sciences", "MBA", "MCA", "PhD Research", "Administration", "Examination Cell", "Accounts & Finance", "Library", "Hostel Administration", "Store & Purchase"];

const initialUsers = [
  { id: "U001", name: "Dr. Rajesh Patil", email: "rajesh.patil@coep.ac.in", role: "super_admin", dept: "Administration", status: "active", phone: "9876543210", joinDate: "2010-06-01", lastLogin: "2024-01-15 09:23", avatar: "RP", gender: "Male" },
  { id: "U002", name: "Dr. Sunita Kulkarni", email: "sunita.kulkarni@coep.ac.in", role: "registrar", dept: "Administration", status: "active", phone: "9876543211", joinDate: "2012-08-15", lastLogin: "2024-01-15 08:45", avatar: "SK", gender: "Female" },
  { id: "U003", name: "Prof. Anil Chougule", email: "anil.chougule@coep.ac.in", role: "hod", dept: "Mechanical Engineering", status: "active", phone: "9876543212", joinDate: "2008-07-01", lastLogin: "2024-01-14 17:30", avatar: "AC", gender: "Male" },
  { id: "U004", name: "Prof. Meera Joshi", email: "meera.joshi@coep.ac.in", role: "hod", dept: "Computer Engineering", status: "active", phone: "9876543213", joinDate: "2009-06-15", lastLogin: "2024-01-15 10:00", avatar: "MJ", gender: "Female" },
  { id: "U005", name: "Dr. Vikram Desai", email: "vikram.desai@coep.ac.in", role: "faculty", dept: "Mechanical Engineering", status: "active", phone: "9876543214", joinDate: "2015-07-01", lastLogin: "2024-01-15 08:00", avatar: "VD", gender: "Male" },
  { id: "U006", name: "Prof. Priya Sharma", email: "priya.sharma@coep.ac.in", role: "faculty", dept: "Computer Engineering", status: "active", phone: "9876543215", joinDate: "2018-07-01", lastLogin: "2024-01-14 16:45", avatar: "PS", gender: "Female" },
  { id: "U007", name: "Dr. Ramesh Nair", email: "ramesh.nair@coep.ac.in", role: "faculty", dept: "Civil Engineering", status: "active", phone: "9876543216", joinDate: "2014-08-01", lastLogin: "2024-01-13 11:00", avatar: "RN", gender: "Male" },
  { id: "U008", name: "Prof. Kavita Wagh", email: "kavita.wagh@coep.ac.in", role: "faculty", dept: "Electrical Engineering", status: "inactive", phone: "9876543217", joinDate: "2020-01-10", lastLogin: "2024-01-10 09:30", avatar: "KW", gender: "Female" },
  { id: "U009", name: "Amit Patil", email: "amit.patil@student.coep.ac.in", role: "student", dept: "Mechanical Engineering", status: "active", phone: "9876543218", joinDate: "2022-07-15", lastLogin: "2024-01-15 07:55", avatar: "AP", gender: "Male" },
  { id: "U010", name: "Sneha Kulkarni", email: "sneha.kulkarni@student.coep.ac.in", role: "student", dept: "Computer Engineering", status: "active", phone: "9876543219", joinDate: "2022-07-15", lastLogin: "2024-01-15 08:10", avatar: "SK", gender: "Female" },
  { id: "U011", name: "Rahul Deshmukh", email: "rahul.deshmukh@student.coep.ac.in", role: "student", dept: "Civil Engineering", status: "active", phone: "9876543220", joinDate: "2021-07-15", lastLogin: "2024-01-14 19:00", avatar: "RD", gender: "Male" },
  { id: "U012", name: "Pooja Gaikwad", email: "pooja.gaikwad@student.coep.ac.in", role: "student", dept: "Electrical Engineering", status: "active", phone: "9876543221", joinDate: "2023-07-15", lastLogin: "2024-01-15 06:45", avatar: "PG", gender: "Female" },
  { id: "U013", name: "Mr. Sanjay Mane", email: "sanjay.mane@coep.ac.in", role: "exam_cell", dept: "Examination Cell", status: "active", phone: "9876543222", joinDate: "2011-03-01", lastLogin: "2024-01-15 09:00", avatar: "SM", gender: "Male" },
  { id: "U014", name: "Mrs. Lata Bhosale", email: "lata.bhosale@coep.ac.in", role: "hostel_warden", dept: "Hostel Administration", status: "active", phone: "9876543223", joinDate: "2013-09-01", lastLogin: "2024-01-15 07:00", avatar: "LB", gender: "Female" },
  { id: "U015", name: "Mr. Dilip Sawant", email: "dilip.sawant@coep.ac.in", role: "store_manager", dept: "Store & Purchase", status: "active", phone: "9876543224", joinDate: "2016-04-01", lastLogin: "2024-01-15 08:30", avatar: "DS", gender: "Male" },
  { id: "U016", name: "Mrs. Anita Jadhav", email: "anita.jadhav@coep.ac.in", role: "library_admin", dept: "Library", status: "active", phone: "9876543225", joinDate: "2014-06-01", lastLogin: "2024-01-15 09:15", avatar: "AJ", gender: "Female" },
  { id: "U017", name: "Mr. Nitin More", email: "nitin.more@coep.ac.in", role: "accounts", dept: "Accounts & Finance", status: "active", phone: "9876543226", joinDate: "2012-10-01", lastLogin: "2024-01-15 09:45", avatar: "NM", gender: "Male" },
  { id: "U018", name: "Dr. Suresh Kadam", email: "suresh.kadam@coep.ac.in", role: "faculty", dept: "Applied Sciences", status: "active", phone: "9876543227", joinDate: "2017-07-01", lastLogin: "2024-01-14 14:00", avatar: "SK", gender: "Male" },
  { id: "U019", name: "Prof. Deepa Rao", email: "deepa.rao@coep.ac.in", role: "hod", dept: "Electronics & Telecom", status: "active", phone: "9876543228", joinDate: "2010-06-15", lastLogin: "2024-01-15 10:30", avatar: "DR", gender: "Female" },
  { id: "U020", name: "Arjun Pawar", email: "arjun.pawar@student.coep.ac.in", role: "student", dept: "Information Technology", status: "active", phone: "9876543229", joinDate: "2023-07-15", lastLogin: "2024-01-15 08:20", avatar: "AP", gender: "Male" },
  { id: "U021", name: "Dr. Ashish Deshpande", email: "ashish.deshpande@coep.ac.in", role: "registrar", dept: "Administration", status: "active", phone: "9876543230", joinDate: "2015-08-01", lastLogin: "2024-01-13 16:00", avatar: "AD", gender: "Male" },
  { id: "U022", name: "Preethi Naik", email: "preethi.naik@student.coep.ac.in", role: "student", dept: "Mechanical Engineering", status: "inactive", phone: "9876543231", joinDate: "2021-07-15", lastLogin: "2024-01-05 12:00", avatar: "PN", gender: "Female" },
  { id: "U023", name: "Mr. Santosh Jagtap", email: "santosh.jagtap@coep.ac.in", role: "exam_cell", dept: "Examination Cell", status: "active", phone: "9876543232", joinDate: "2019-02-01", lastLogin: "2024-01-15 09:30", avatar: "SJ", gender: "Male" },
  { id: "U024", name: "Prof. Rekha Patil", email: "rekha.patil@coep.ac.in", role: "faculty", dept: "MBA", status: "active", phone: "9876543233", joinDate: "2016-07-01", lastLogin: "2024-01-14 15:30", avatar: "RP", gender: "Female" },
];

const ACTIVITY_LOG = [
  { id: 1, user: "Dr. Rajesh Patil", action: "Created new user account", target: "Prof. Rekha Patil", time: "2024-01-15 09:23", type: "create", module: "Admin" },
  { id: 2, user: "Dr. Sunita Kulkarni", action: "Approved admission application", target: "Arjun Pawar (2023-IT-045)", time: "2024-01-15 09:10", type: "approve", module: "Academic" },
  { id: 3, user: "Prof. Priya Sharma", action: "Uploaded course material", target: "Data Structures - Unit 3", time: "2024-01-15 08:55", type: "upload", module: "Academic" },
  { id: 4, user: "Amit Patil", action: "Submitted assignment", target: "Thermodynamics Assignment 2", time: "2024-01-15 08:40", type: "submit", module: "Academic" },
  { id: 5, user: "Mr. Nitin More", action: "Generated fee invoice", target: "Batch 2022-ME — Semester 4", time: "2024-01-15 09:45", type: "generate", module: "Finance" },
  { id: 6, user: "Mrs. Lata Bhosale", action: "Allocated hostel room", target: "Sneha Kulkarni → Room B-204", time: "2024-01-14 17:00", type: "allocate", module: "Hostel" },
  { id: 7, user: "Mr. Sanjay Mane", action: "Generated hall tickets", target: "End-Sem Exam Jan 2024 — 1240 students", time: "2024-01-14 16:30", type: "generate", module: "Exam" },
  { id: 8, user: "Mrs. Anita Jadhav", action: "Issued book", target: "Strength of Materials — Rahul Deshmukh", time: "2024-01-14 15:00", type: "issue", module: "Library" },
  { id: 9, user: "Dr. Rajesh Patil", action: "Deactivated user account", target: "Prof. Kavita Wagh", time: "2024-01-14 14:00", type: "delete", module: "Admin" },
  { id: 10, user: "Mr. Dilip Sawant", action: "Created purchase order", target: "Lab Equipment — Mechanical Dept", time: "2024-01-14 13:30", type: "create", module: "Store" },
  { id: 11, user: "Prof. Anil Chougule", action: "Approved internal marks", target: "ME 4001 — Theory of Machines", time: "2024-01-14 12:00", type: "approve", module: "Academic" },
  { id: 12, user: "Dr. Vikram Desai", action: "Marked attendance", target: "ME 3002 — Fluid Mechanics (42 students)", time: "2024-01-15 08:00", type: "update", module: "Academic" },
  { id: 13, user: "Sneha Kulkarni", action: "Paid semester fees", target: "₹45,000 — Semester 5 Fees", time: "2024-01-15 08:10", type: "payment", module: "Finance" },
  { id: 14, user: "Mr. Santosh Jagtap", action: "Published semester results", target: "Nov-Dec 2023 Exam Results", time: "2024-01-13 18:00", type: "publish", module: "Exam" },
  { id: 15, user: "Prof. Meera Joshi", action: "Approved project topic", target: "IoT Smart Campus — Team CE-07", time: "2024-01-13 15:00", type: "approve", module: "Academic" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const S = (obj) => Object.assign({}, obj);
const roleList = Object.values(ROLES_CONFIG);
const moduleList = Object.values(MODULES);

const logType = {
  create: { color: "#34d399", label: "Created", icon: "＋" },
  approve: { color: "#60a5fa", label: "Approved", icon: "✓" },
  upload: { color: "#a78bfa", label: "Uploaded", icon: "↑" },
  submit: { color: "#f472b6", label: "Submitted", icon: "→" },
  generate: { color: "#f97316", label: "Generated", icon: "◈" },
  allocate: { color: "#14b8a6", label: "Allocated", icon: "⊙" },
  issue: { color: "#d4a017", label: "Issued", icon: "⬡" },
  delete: { color: "#ef4444", label: "Removed", icon: "✕" },
  update: { color: "#94a3b8", label: "Updated", icon: "⟳" },
  payment: { color: "#34d399", label: "Payment", icon: "₹" },
  publish: { color: "#60a5fa", label: "Published", icon: "◉" },
};

function uid() { return "U" + String(Date.now()).slice(-6); }
function initials(name) { return name.split(" ").filter(w => !/^(Dr|Prof|Mr|Mrs|Ms)\.?$/.test(w)).slice(0, 2).map(w => w[0]).join("").toUpperCase(); }

// ─── STYLES ───────────────────────────────────────────────────────────────────

const BASE = {
  fontFamily: "'Palatino Linotype','Book Antiqua','Palatino',Georgia,serif",
  background: "#080c18", color: "#dde4f0", minHeight: "100vh", display: "flex",
};
const SIDEBAR_W = 228;

// ─── MICRO COMPONENTS ─────────────────────────────────────────────────────────

function Badge({ color, bg, children, small }) {
  return <span style={{ display: "inline-block", padding: small ? "2px 7px" : "3px 9px", borderRadius: 3, fontSize: small ? 9 : 10, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "inherit", background: bg || color + "20", color: color, border: `1px solid ${color}40`, fontWeight: "bold" }}>{children}</span>;
}

function Avatar({ name, color, size = 34 }) {
  return <div style={{ width: size, height: size, borderRadius: "50%", background: color + "30", border: `2px solid ${color}50`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.32, fontWeight: "bold", color, flexShrink: 0, letterSpacing: "0.05em" }}>{initials(name)}</div>;
}

function Tag({ color, children }) {
  return <span style={{ padding: "2px 8px", borderRadius: 3, fontSize: 10, background: color + "15", border: `1px solid ${color}30`, color, letterSpacing: "0.06em" }}>{children}</span>;
}

function StatusDot({ status }) {
  const c = status === "active" ? "#34d399" : "#64748b";
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: c }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: c, display: "inline-block", boxShadow: status === "active" ? `0 0 6px ${c}` : "none" }} />{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
}

function Toast({ msg, type, onClose }) {
  const col = type === "success" ? "#34d399" : type === "error" ? "#ef4444" : "#d4a017";
  useEffect(() => { const t = setTimeout(onClose, 3200); return () => clearTimeout(t); }, []);
  return <div style={{ position: "fixed", top: 20, right: 24, zIndex: 9999, padding: "12px 18px", background: "#0e1424", border: `1px solid ${col}50`, borderLeft: `3px solid ${col}`, borderRadius: 7, fontSize: 13, color: "#e2e8f0", maxWidth: 340, boxShadow: "0 8px 30px rgba(0,0,0,0.5)", display: "flex", alignItems: "center", gap: 10 }}>
    <span style={{ color: col, fontSize: 16 }}>{type === "success" ? "✓" : type === "error" ? "✕" : "!"}</span>
    <span>{msg}</span>
    <button onClick={onClose} style={{ marginLeft: "auto", background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 14, padding: "0 0 0 8px" }}>✕</button>
  </div>;
}

function Modal({ title, onClose, children, wide }) {
  return <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
    <div style={{ background: "#0d1222", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, width: "100%", maxWidth: wide ? 780 : 520, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>
      <div style={{ padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#0d1222", zIndex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: "bold", letterSpacing: "0.03em", color: "#e2e8f0" }}>{title}</div>
        <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", cursor: "pointer", borderRadius: 6, width: 28, height: 28, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
      </div>
      <div style={{ padding: 24 }}>{children}</div>
    </div>
  </div>;
}

function FormField({ label, children, required }) {
  return <div style={{ marginBottom: 16 }}>
    <label style={{ display: "block", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#64748b", marginBottom: 6 }}>{label}{required && <span style={{ color: "#ef4444", marginLeft: 3 }}>*</span>}</label>
    {children}
  </div>;
}

const inputStyle = { width: "100%", padding: "9px 12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "#e2e8f0", fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" };
const btnPrimary = { padding: "9px 20px", background: "linear-gradient(135deg,#d4a017,#a07810)", border: "none", borderRadius: 6, color: "#0a0e1a", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: "bold", cursor: "pointer", fontFamily: "inherit" };
const btnSecondary = { padding: "9px 20px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 6, color: "#94a3b8", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" };
const btnDanger = { padding: "9px 20px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 6, color: "#ef4444", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" };

// ─── USER FORM ────────────────────────────────────────────────────────────────

function UserForm({ user, onSave, onClose }) {
  const isEdit = !!user?.id;
  const [form, setForm] = useState({
    name: user?.name || "", email: user?.email || "", role: user?.role || "faculty",
    dept: user?.dept || DEPARTMENTS[0], phone: user?.phone || "", gender: user?.gender || "Male",
    status: user?.status || "active", joinDate: user?.joinDate || new Date().toISOString().slice(0, 10),
  });
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const handle = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    onSave({ ...user, ...form, id: user?.id || uid(), lastLogin: "Never", avatar: initials(form.name) });
  };

  const rc = ROLES_CONFIG[form.role];
  return <>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <FormField label="Full Name" required><input style={inputStyle} value={form.name} onChange={e => upd("name", e.target.value)} placeholder="e.g. Dr. Rajesh Patil" /></FormField>
      <FormField label="Email Address" required><input style={inputStyle} type="email" value={form.email} onChange={e => upd("email", e.target.value)} placeholder="user@coep.ac.in" /></FormField>
      <FormField label="Assign Role" required>
        <select style={inputStyle} value={form.role} onChange={e => upd("role", e.target.value)}>
          {roleList.map(r => <option key={r.id} value={r.id}>{r.icon} {r.title}</option>)}
        </select>
      </FormField>
      <FormField label="Department">
        <select style={inputStyle} value={form.dept} onChange={e => upd("dept", e.target.value)}>
          {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
        </select>
      </FormField>
      <FormField label="Phone Number"><input style={inputStyle} value={form.phone} onChange={e => upd("phone", e.target.value)} placeholder="10-digit mobile" /></FormField>
      <FormField label="Gender">
        <select style={inputStyle} value={form.gender} onChange={e => upd("gender", e.target.value)}>
          {["Male", "Female", "Other"].map(g => <option key={g}>{g}</option>)}
        </select>
      </FormField>
      <FormField label="Join Date"><input style={{ ...inputStyle }} type="date" value={form.joinDate} onChange={e => upd("joinDate", e.target.value)} /></FormField>
      <FormField label="Account Status">
        <select style={inputStyle} value={form.status} onChange={e => upd("status", e.target.value)}>
          <option value="active">Active</option><option value="inactive">Inactive</option>
        </select>
      </FormField>
    </div>

    {/* Role Preview */}
    <div style={{ marginTop: 4, padding: "14px 16px", borderRadius: 8, border: `1px solid ${rc.border}`, background: rc.bg }}>
      <div style={{ fontSize: 11, letterSpacing: "0.15em", color: rc.color, textTransform: "uppercase", marginBottom: 8 }}>Role Preview — {rc.title}</div>
      <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 10 }}>{rc.description}</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {rc.modules.map(m => <Tag key={m} color={MODULES[m]?.color || "#fff"}>{MODULES[m]?.icon} {MODULES[m]?.label}</Tag>)}
      </div>
      <div style={{ marginTop: 10, fontSize: 11, color: "#64748b" }}>
        {rc.permissionCategories.length} permission categories · {rc.permissionCategories.reduce((a, p) => a + p.perms.length, 0)} total permissions
      </div>
    </div>

    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
      <button style={btnSecondary} onClick={onClose}>Cancel</button>
      <button style={btnPrimary} onClick={handle}>{isEdit ? "Save Changes" : "Create User"}</button>
    </div>
  </>;
}

// ─── VIEWS ───────────────────────────────────────────────────────────────────

function Dashboard({ users, logs }) {
  const total = users.length;
  const active = users.filter(u => u.status === "active").length;
  const roleBreak = roleList.map(r => ({ ...r, count: users.filter(u => u.role === r.id).length })).filter(r => r.count > 0);
  const moduleUsage = moduleList.map(m => ({ ...m, count: roleList.filter(r => r.modules.includes(m.id)).length }));

  return <div>
    <PageHeader title="System Dashboard" subtitle="COEP Technological University — ERP Command Center" />

    {/* Stats Row */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
      {[
        { label: "Total Users", value: total, icon: "👤", color: "#d4a017", sub: `${active} active` },
        { label: "Defined Roles", value: roleList.length, icon: "🔐", color: "#5b9bd5", sub: "10 role types" },
        { label: "ERP Modules", value: moduleList.length, icon: "⬡", color: "#a78bfa", sub: "All configured" },
        { label: "Active Sessions", value: active, icon: "🟢", color: "#34d399", sub: `${total - active} inactive` },
      ].map(s => <StatCard key={s.label} {...s} />)}
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
      {/* Role Distribution */}
      <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "18px 20px" }}>
        <SectionTitle>Role Distribution</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
          {roleBreak.map(r => (
            <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 16, width: 24, textAlign: "center" }}>{r.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 12, color: "#cbd5e1" }}>{r.title}</span>
                  <span style={{ fontSize: 11, color: r.color, fontWeight: "bold" }}>{r.count}</span>
                </div>
                <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 2, background: r.color, width: `${Math.min(100, (r.count / total) * 100 * 3)}%`, transition: "width 0.5s" }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Module Coverage */}
      <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "18px 20px" }}>
        <SectionTitle>Module Access Coverage</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
          {moduleUsage.map(m => (
            <div key={m.id} style={{ padding: "10px 12px", borderRadius: 7, border: `1px solid ${m.color}25`, background: `${m.color}08`, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18 }}>{m.icon}</span>
              <div>
                <div style={{ fontSize: 11, fontWeight: "bold", color: m.color, letterSpacing: "0.05em" }}>{m.label}</div>
                <div style={{ fontSize: 10, color: "#475569" }}>{m.count} roles have access</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Recent Activity */}
    <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "18px 20px" }}>
      <SectionTitle>Recent System Activity</SectionTitle>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 2 }}>
        {logs.slice(0, 8).map(log => {
          const lt = logType[log.type] || { color: "#94a3b8", label: log.type, icon: "·" };
          return <div key={log.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 10px", borderRadius: 6, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <span style={{ width: 22, height: 22, borderRadius: 5, background: `${lt.color}20`, border: `1px solid ${lt.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: lt.color, flexShrink: 0 }}>{lt.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: 12, color: "#94a3b8" }}><strong style={{ color: "#cbd5e1" }}>{log.user}</strong> — {log.action}</span>
              <span style={{ fontSize: 11, color: "#475569", marginLeft: 8 }}>· {log.target}</span>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
              <Tag color={MODULES[log.module?.toLowerCase()]?.color || "#64748b"}>{log.module}</Tag>
              <span style={{ fontSize: 10, color: "#334155" }}>{log.time}</span>
            </div>
          </div>;
        })}
      </div>
    </div>
  </div>;
}

function StatCard({ label, value, icon, color, sub }) {
  return <div style={{ padding: "16px 18px", borderRadius: 10, background: "rgba(255,255,255,0.025)", border: `1px solid rgba(255,255,255,0.07)`, position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", right: 14, top: 14, fontSize: 26, opacity: 0.25 }}>{icon}</div>
    <div style={{ fontSize: 28, fontWeight: "bold", color, lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>{label}</div>
    <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{sub}</div>
  </div>;
}

function SectionTitle({ children }) {
  return <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#64748b", display: "flex", alignItems: "center", gap: 8 }}>
    <span style={{ width: 14, height: 1, background: "rgba(212,160,23,0.4)", display: "inline-block" }} />
    {children}
    <span style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)", display: "inline-block" }} />
  </div>;
}

function PageHeader({ title, subtitle, actions }) {
  return <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
    <div>
      <h1 style={{ margin: 0, fontSize: 22, fontWeight: "bold", color: "#f1f5f9", letterSpacing: "0.02em" }}>{title}</h1>
      <p style={{ margin: "4px 0 0", fontSize: 12, color: "#475569", letterSpacing: "0.05em" }}>{subtitle}</p>
    </div>
    {actions && <div style={{ display: "flex", gap: 10 }}>{actions}</div>}
  </div>;
}

// ─── USERS VIEW ───────────────────────────────────────────────────────────────

function UsersView({ users, setUsers, toast }) {
  const [search, setSearch] = useState("");
  const [roleF, setRoleF] = useState("all");
  const [statusF, setStatusF] = useState("all");
  const [deptF, setDeptF] = useState("all");
  const [modal, setModal] = useState(null); // null | {type:'create'|'edit'|'view'|'delete', user?}
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState(1);
  const [page, setPage] = useState(0);
  const PER_PAGE = 8;

  const filtered = users
    .filter(u => (!search || (u.name + u.email + u.dept).toLowerCase().includes(search.toLowerCase())))
    .filter(u => roleF === "all" || u.role === roleF)
    .filter(u => statusF === "all" || u.status === statusF)
    .filter(u => deptF === "all" || u.dept === deptF)
    .sort((a, b) => sortDir * (a[sortKey] || "").localeCompare(b[sortKey] || ""));

  const paged = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  const pages = Math.ceil(filtered.length / PER_PAGE);

  const handleSave = (user) => {
    setUsers(prev => {
      const idx = prev.findIndex(u => u.id === user.id);
      if (idx >= 0) { const n = [...prev]; n[idx] = user; return n; }
      return [...prev, user];
    });
    toast(modal.type === "edit" ? "User updated successfully." : "User created successfully.", "success");
    setModal(null);
  };

  const handleDelete = (u) => {
    setUsers(prev => prev.filter(x => x.id !== u.id));
    toast(`${u.name} has been removed.`, "success");
    setModal(null);
  };

  const toggleStatus = (u) => {
    setUsers(prev => prev.map(x => x.id === u.id ? { ...x, status: x.status === "active" ? "inactive" : "active" } : x));
    toast(`${u.name} — status toggled.`, "success");
  };

  const Th = ({ k, label }) => <th onClick={() => { if (sortKey === k) setSortDir(-sortDir); else { setSortKey(k); setSortDir(1); } }} style={{ padding: "10px 12px", textAlign: "left", cursor: "pointer", userSelect: "none", color: sortKey === k ? "#d4a017" : "#475569", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
    {label}{sortKey === k ? (sortDir === 1 ? " ▲" : " ▼") : ""}
  </th>;

  const uniqueDepts = [...new Set(users.map(u => u.dept))].sort();

  return <div>
    <PageHeader title="User Management" subtitle="Create, edit, and manage ERP system users"
      actions={<button style={btnPrimary} onClick={() => setModal({ type: "create" })}>＋ Add New User</button>} />

    {/* Filters */}
    <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
      <div style={{ position: "relative", flex: "1 1 200px", maxWidth: 320 }}>
        <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#475569", fontSize: 14 }}>⌕</span>
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} placeholder="Search users…" style={{ ...inputStyle, paddingLeft: 32 }} />
      </div>
      <select style={{ ...inputStyle, width: "auto", flex: "0 1 160px" }} value={roleF} onChange={e => { setRoleF(e.target.value); setPage(0); }}>
        <option value="all">All Roles</option>
        {roleList.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
      </select>
      <select style={{ ...inputStyle, width: "auto", flex: "0 1 140px" }} value={statusF} onChange={e => { setStatusF(e.target.value); setPage(0); }}>
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
      <select style={{ ...inputStyle, width: "auto", flex: "0 1 200px" }} value={deptF} onChange={e => { setDeptF(e.target.value); setPage(0); }}>
        <option value="all">All Departments</option>
        {uniqueDepts.map(d => <option key={d}>{d}</option>)}
      </select>
      <span style={{ fontSize: 11, color: "#475569", marginLeft: "auto", flexShrink: 0 }}>{filtered.length} user{filtered.length !== 1 ? "s" : ""} found</span>
    </div>

    {/* Table */}
    <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ background: "rgba(0,0,0,0.2)" }}>
          <tr>
            <Th k="name" label="User" />
            <Th k="role" label="Role" />
            <Th k="dept" label="Department" />
            <Th k="status" label="Status" />
            <Th k="lastLogin" label="Last Login" />
            <th style={{ padding: "10px 12px", fontSize: 10, letterSpacing: "0.15em", color: "#475569", textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,0.06)", textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paged.length === 0 && <tr><td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "#334155", fontSize: 13 }}>No users match the current filters.</td></tr>}
          {paged.map((u, i) => {
            const rc = ROLES_CONFIG[u.role];
            return <tr key={u.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <td style={{ padding: "10px 12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar name={u.name} color={rc?.color || "#64748b"} size={34} />
                  <div>
                    <div style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 500 }}>{u.name}</div>
                    <div style={{ fontSize: 11, color: "#475569" }}>{u.email}</div>
                  </div>
                </div>
              </td>
              <td style={{ padding: "10px 12px" }}>
                <Badge color={rc?.color || "#64748b"}>{rc?.icon} {rc?.title}</Badge>
              </td>
              <td style={{ padding: "10px 12px", fontSize: 12, color: "#94a3b8" }}>{u.dept}</td>
              <td style={{ padding: "10px 12px" }}><StatusDot status={u.status} /></td>
              <td style={{ padding: "10px 12px", fontSize: 11, color: "#475569" }}>{u.lastLogin}</td>
              <td style={{ padding: "10px 12px", textAlign: "right" }}>
                <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                  {["👁", "✏", "⟳", "✕"].map((ico, ii) => {
                    const actions = [() => setModal({ type: "view", user: u }), () => setModal({ type: "edit", user: u }), () => toggleStatus(u), () => setModal({ type: "delete", user: u })];
                    const colors = ["#60a5fa", "#d4a017", "#14b8a6", "#ef4444"];
                    return <button key={ii} title={["View", "Edit", "Toggle Status", "Delete"][ii]} onClick={actions[ii]}
                      style={{ width: 28, height: 28, borderRadius: 5, background: `${colors[ii]}15`, border: `1px solid ${colors[ii]}30`, color: colors[ii], cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>{ico}</button>;
                  })}
                </div>
              </td>
            </tr>;
          })}
        </tbody>
      </table>
    </div>

    {/* Pagination */}
    {pages > 1 && <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 14 }}>
      <button style={{ ...btnSecondary, padding: "6px 14px", opacity: page === 0 ? 0.4 : 1 }} disabled={page === 0} onClick={() => setPage(p => p - 1)}>‹ Prev</button>
      {Array.from({ length: pages }).map((_, i) => <button key={i} style={{ ...(i === page ? btnPrimary : btnSecondary), padding: "6px 12px", minWidth: 36 }} onClick={() => setPage(i)}>{i + 1}</button>)}
      <button style={{ ...btnSecondary, padding: "6px 14px", opacity: page === pages - 1 ? 0.4 : 1 }} disabled={page === pages - 1} onClick={() => setPage(p => p + 1)}>Next ›</button>
    </div>}

    {/* Modals */}
    {modal?.type === "create" && <Modal title="Create New User" onClose={() => setModal(null)} wide><UserForm onSave={handleSave} onClose={() => setModal(null)} /></Modal>}
    {modal?.type === "edit" && <Modal title="Edit User" onClose={() => setModal(null)} wide><UserForm user={modal.user} onSave={handleSave} onClose={() => setModal(null)} /></Modal>}
    {modal?.type === "view" && <Modal title="User Profile" onClose={() => setModal(null)} wide><UserProfile user={modal.user} onEdit={() => setModal({ type: "edit", user: modal.user })} onClose={() => setModal(null)} /></Modal>}
    {modal?.type === "delete" && <Modal title="Confirm Deletion" onClose={() => setModal(null)}>
      <div style={{ textAlign: "center", padding: "10px 0 20px" }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>⚠</div>
        <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.6 }}>You are about to permanently delete <strong style={{ color: "#e2e8f0" }}>{modal.user.name}</strong>.<br />This action cannot be undone.</p>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <button style={btnSecondary} onClick={() => setModal(null)}>Cancel</button>
        <button style={btnDanger} onClick={() => handleDelete(modal.user)}>Delete User</button>
      </div>
    </Modal>}
  </div>;
}

function UserProfile({ user, onEdit, onClose }) {
  const rc = ROLES_CONFIG[user.role];
  return <div>
    <div style={{ display: "flex", gap: 18, marginBottom: 20, alignItems: "center" }}>
      <Avatar name={user.name} color={rc?.color || "#64748b"} size={64} />
      <div>
        <div style={{ fontSize: 20, fontWeight: "bold", color: "#f1f5f9" }}>{user.name}</div>
        <div style={{ fontSize: 13, color: "#64748b", margin: "3px 0" }}>{user.email}</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
          <Badge color={rc?.color || "#64748b"}>{rc?.icon} {rc?.title}</Badge>
          <StatusDot status={user.status} />
        </div>
      </div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
      {[["Department", user.dept], ["Phone", user.phone], ["Gender", user.gender], ["Join Date", user.joinDate], ["User ID", user.id], ["Last Login", user.lastLogin]].map(([k, v]) => (
        <div key={k} style={{ padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 7, border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 10, color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>{k}</div>
          <div style={{ fontSize: 13, color: "#cbd5e1" }}>{v}</div>
        </div>
      ))}
    </div>

    <SectionTitle>Module Access</SectionTitle>
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "12px 0 18px" }}>
      {moduleList.map(m => {
        const has = rc?.modules?.includes(m.id);
        return <div key={m.id} style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${has ? m.color + "40" : "rgba(255,255,255,0.06)"}`, background: has ? `${m.color}10` : "rgba(255,255,255,0.02)", opacity: has ? 1 : 0.4, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 14 }}>{m.icon}</span>
          <span style={{ fontSize: 11, color: has ? m.color : "#475569" }}>{m.label}</span>
          {!has && <span style={{ fontSize: 9, color: "#334155" }}>✕</span>}
        </div>;
      })}
    </div>

    <SectionTitle>Permissions Summary</SectionTitle>
    <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
      {rc?.permissionCategories?.map(cat => (
        <div key={cat.id} style={{ padding: "8px 12px", borderRadius: 6, border: `1px solid ${rc.border}`, background: rc.bg }}>
          <div style={{ fontSize: 11, color: rc.color, fontWeight: "bold", marginBottom: 4 }}>{cat.label}</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {cat.perms.map(p => <span key={p} style={{ fontSize: 10, padding: "2px 7px", background: "rgba(255,255,255,0.04)", borderRadius: 3, color: "#94a3b8", border: "1px solid rgba(255,255,255,0.06)" }}>{p}</span>)}
          </div>
        </div>
      ))}
    </div>

    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
      <button style={btnSecondary} onClick={onClose}>Close</button>
      <button style={btnPrimary} onClick={onEdit}>Edit User</button>
    </div>
  </div>;
}

// ─── ROLES VIEW ───────────────────────────────────────────────────────────────

function RolesView({ users }) {
  const [selected, setSelected] = useState(null);
  const [expandCat, setExpandCat] = useState({});

  return <div>
    <PageHeader title="Roles & Permissions" subtitle="Role definitions, responsibilities, and permission sets" />
    <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 18 }}>
      {/* Role List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {roleList.map(r => {
          const count = users.filter(u => u.role === r.id).length;
          const active = selected?.id === r.id;
          return <div key={r.id} onClick={() => setSelected(active ? null : r)} style={{ padding: "12px 14px", borderRadius: 8, border: `1px solid ${active ? r.color + "50" : "rgba(255,255,255,0.07)"}`, background: active ? r.bg : "rgba(255,255,255,0.02)", cursor: "pointer", transition: "all 0.2s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>{r.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: "bold", color: active ? r.color : "#e2e8f0" }}>{r.title}</div>
                <div style={{ fontSize: 10, color: "#475569" }}>{r.subtitle}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 14, fontWeight: "bold", color: r.color }}>{count}</div>
                <div style={{ fontSize: 9, color: "#334155" }}>users</div>
              </div>
            </div>
            <div style={{ marginTop: 8, display: "flex", gap: 4, flexWrap: "wrap" }}>
              {r.modules.map(m => <span key={m} style={{ fontSize: 9, padding: "1px 5px", borderRadius: 2, background: `${MODULES[m]?.color || "#fff"}10`, color: MODULES[m]?.color || "#fff", border: `1px solid ${MODULES[m]?.color || "#fff"}25` }}>{MODULES[m]?.label}</span>)}
            </div>
          </div>;
        })}
      </div>

      {/* Detail Pane */}
      <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "20px 24px", minHeight: 400 }}>
        {!selected ? <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 10, color: "#334155", paddingTop: 60 }}>
          <div style={{ fontSize: 40 }}>🔐</div>
          <div style={{ fontSize: 14 }}>Select a role to view details</div>
        </div> : <>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 20 }}>
            <div style={{ width: 56, height: 56, borderRadius: 10, background: selected.bg, border: `1px solid ${selected.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{selected.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <h2 style={{ margin: 0, fontSize: 20, color: "#f1f5f9" }}>{selected.title}</h2>
                <Badge color={selected.color}>Level {selected.level}</Badge>
              </div>
              <div style={{ fontSize: 12, color: selected.color, letterSpacing: "0.08em", marginTop: 2 }}>{selected.subtitle}</div>
              <p style={{ fontSize: 13, color: "#94a3b8", margin: "8px 0 0", lineHeight: 1.6 }}>{selected.description}</p>
            </div>
          </div>

          <SectionTitle>Module Access ({selected.modules.length}/{moduleList.length})</SectionTitle>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "12px 0 20px" }}>
            {moduleList.map(m => {
              const has = selected.modules.includes(m.id);
              return <div key={m.id} style={{ padding: "7px 14px", borderRadius: 6, border: `1px solid ${has ? m.color + "40" : "rgba(255,255,255,0.05)"}`, background: has ? `${m.color}12` : "transparent", display: "flex", alignItems: "center", gap: 7, opacity: has ? 1 : 0.35 }}>
                <span>{m.icon}</span><span style={{ fontSize: 12, color: has ? m.color : "#475569" }}>{m.label}</span>
              </div>;
            })}
          </div>

          <SectionTitle>Permission Categories ({selected.permissionCategories.length})</SectionTitle>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            {selected.permissionCategories.map(cat => {
              const key = `${selected.id}-${cat.id}`;
              const open = expandCat[key];
              return <div key={cat.id} style={{ border: `1px solid ${open ? selected.border : "rgba(255,255,255,0.07)"}`, borderRadius: 8, overflow: "hidden" }}>
                <div onClick={() => setExpandCat(p => ({ ...p, [key]: !open }))} style={{ padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", background: open ? selected.bg : "transparent" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: selected.color, display: "inline-block" }} />
                    <span style={{ fontSize: 13, fontWeight: "bold", color: "#cbd5e1" }}>{cat.label}</span>
                  </div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={{ fontSize: 10, color: selected.color }}>{cat.perms.length} permissions</span>
                    <span style={{ fontSize: 12, color: "#475569", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
                  </div>
                </div>
                {open && <div style={{ padding: "12px 14px", background: "rgba(0,0,0,0.15)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  {cat.perms.map(p => <div key={p} style={{ display: "flex", gap: 7, alignItems: "flex-start" }}>
                    <span style={{ color: selected.color, fontSize: 11, marginTop: 1, flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.4 }}>{p}</span>
                  </div>)}
                </div>}
              </div>;
            })}
          </div>

          <div style={{ marginTop: 16, padding: "12px 14px", borderRadius: 7, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <span style={{ fontSize: 11, color: "#475569" }}>Total permissions: </span>
            <span style={{ fontSize: 14, fontWeight: "bold", color: selected.color }}>{selected.permissionCategories.reduce((a, p) => a + p.perms.length, 0)}</span>
            <span style={{ fontSize: 11, color: "#475569", marginLeft: 14 }}>Users with this role: </span>
            <span style={{ fontSize: 14, fontWeight: "bold", color: selected.color }}>{users.filter(u => u.role === selected.id).length}</span>
          </div>
        </>}
      </div>
    </div>
  </div>;
}

// ─── PERMISSION MATRIX ────────────────────────────────────────────────────────

function MatrixView() {
  const [hover, setHover] = useState(null);
  const [modHover, setModHover] = useState(null);

  return <div>
    <PageHeader title="Permission Matrix" subtitle="Module access cross-reference across all ERP roles" />
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: 700 }}>
        <thead>
          <tr>
            <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "2px solid rgba(212,160,23,0.3)", color: "#d4a017", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", minWidth: 180 }}>Role</th>
            {moduleList.map(m => <th key={m.id} onMouseEnter={() => setModHover(m.id)} onMouseLeave={() => setModHover(null)}
              style={{ padding: "12px 8px", textAlign: "center", borderBottom: "2px solid rgba(212,160,23,0.3)", minWidth: 82, background: modHover === m.id ? `${m.color}08` : "transparent", cursor: "default" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                <span style={{ fontSize: 16 }}>{m.icon}</span>
                <span style={{ fontSize: 9, letterSpacing: "0.08em", color: m.color, textTransform: "uppercase" }}>{m.label}</span>
              </div>
            </th>)}
            <th style={{ padding: "12px 10px", textAlign: "center", borderBottom: "2px solid rgba(212,160,23,0.3)", color: "#475569", fontSize: 10, letterSpacing: "0.1em", minWidth: 70 }}>Access</th>
            <th style={{ padding: "12px 10px", textAlign: "center", borderBottom: "2px solid rgba(212,160,23,0.3)", color: "#475569", fontSize: 10, letterSpacing: "0.1em", minWidth: 70 }}>Perms</th>
          </tr>
        </thead>
        <tbody>
          {roleList.map((r, ri) => {
            const isHov = hover === r.id;
            const totalPerms = r.permissionCategories.reduce((a, p) => a + p.perms.length, 0);
            return <tr key={r.id} onMouseEnter={() => setHover(r.id)} onMouseLeave={() => setHover(null)}
              style={{ background: isHov ? `${r.color}08` : ri % 2 === 0 ? "rgba(255,255,255,0.015)" : "transparent", transition: "background 0.15s" }}>
              <td style={{ padding: "11px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 18 }}>{r.icon}</span>
                  <div>
                    <div style={{ color: isHov ? r.color : "#cbd5e1", fontWeight: isHov ? "bold" : "normal", fontSize: 13, transition: "color 0.15s" }}>{r.title}</div>
                    <div style={{ color: "#334155", fontSize: 10 }}>{r.subtitle}</div>
                  </div>
                  <Badge color={r.color} small>L{r.level}</Badge>
                </div>
              </td>
              {moduleList.map(m => {
                const has = r.modules.includes(m.id);
                const hl = modHover === m.id;
                return <td key={m.id} style={{ padding: "11px 8px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)", background: hl ? `${m.color}06` : "transparent" }}>
                  {has ? <div style={{ width: 30, height: 30, borderRadius: 7, margin: "0 auto", background: `${m.color}20`, border: `1px solid ${m.color}45`, display: "flex", alignItems: "center", justifyContent: "center", color: m.color, fontSize: 14, boxShadow: isHov ? `0 0 8px ${m.color}30` : "none" }}>✓</div>
                    : <div style={{ width: 30, height: 30, borderRadius: 7, margin: "0 auto", background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", color: "#1e293b", fontSize: 12 }}>—</div>}
                </td>;
              })}
              <td style={{ padding: "11px 10px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ fontWeight: "bold", color: r.color, fontSize: 15 }}>{r.modules.length}</span>
                <span style={{ color: "#334155", fontSize: 10 }}>/{moduleList.length}</span>
              </td>
              <td style={{ padding: "11px 10px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ fontWeight: "bold", color: r.color, fontSize: 15 }}>{totalPerms}</span>
              </td>
            </tr>;
          })}
        </tbody>
        <tfoot>
          <tr style={{ background: "rgba(0,0,0,0.2)" }}>
            <td style={{ padding: "10px 16px", color: "#d4a017", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", borderTop: "1px solid rgba(212,160,23,0.2)" }}>Module Coverage</td>
            {moduleList.map(m => {
              const cnt = roleList.filter(r => r.modules.includes(m.id)).length;
              return <td key={m.id} style={{ textAlign: "center", padding: "10px 8px", borderTop: "1px solid rgba(212,160,23,0.2)" }}>
                <div style={{ fontWeight: "bold", color: m.color, fontSize: 13 }}>{cnt}</div>
                <div style={{ color: "#334155", fontSize: 9 }}>roles</div>
              </td>;
            })}
            <td colSpan={2} style={{ borderTop: "1px solid rgba(212,160,23,0.2)" }} />
          </tr>
        </tfoot>
      </table>
    </div>

    {/* Legend */}
    <div style={{ marginTop: 20, display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap", padding: "14px 16px", background: "rgba(255,255,255,0.02)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)" }}>
      <span style={{ fontSize: 10, color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase" }}>Legend:</span>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 20, height: 20, borderRadius: 5, background: "rgba(52,211,153,0.2)", border: "1px solid rgba(52,211,153,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#34d399" }}>✓</div><span style={{ fontSize: 11, color: "#94a3b8" }}>Has Access</span></div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 20, height: 20, borderRadius: 5, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#1e293b" }}>—</div><span style={{ fontSize: 11, color: "#94a3b8" }}>No Access</span></div>
      {moduleList.map(m => <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <span style={{ width: 10, height: 10, borderRadius: 2, background: m.color, display: "inline-block" }} />
        <span style={{ fontSize: 11, color: "#64748b" }}>{m.label}</span>
      </div>)}
    </div>
  </div>;
}

// ─── HIERARCHY VIEW ───────────────────────────────────────────────────────────

function HierarchyView() {
  const levels = [
    { level: 1, label: "LEVEL 1 — INSTITUTE APEX", color: "#d4a017", roles: [ROLES_CONFIG.super_admin] },
    { level: 2, label: "LEVEL 2 — ADMINISTRATION", color: "#5b9bd5", roles: [ROLES_CONFIG.registrar] },
    { level: 3, label: "LEVEL 3 — OPERATIONS MANAGEMENT", color: "#f97316", roles: [ROLES_CONFIG.hod, ROLES_CONFIG.exam_cell, ROLES_CONFIG.accounts] },
    { level: 4, label: "LEVEL 4 — FUNCTIONAL SPECIALISTS", color: "#10b981", roles: [ROLES_CONFIG.faculty, ROLES_CONFIG.hostel_warden, ROLES_CONFIG.store_manager, ROLES_CONFIG.library_admin] },
    { level: 5, label: "LEVEL 5 — END USERS", color: "#f472b6", roles: [ROLES_CONFIG.student] },
  ];

  const interactions = [
    { from: "Super Admin", to: "All Roles", type: "Governs", desc: "Creates, configures, and oversees all users and system settings.", color: "#d4a017" },
    { from: "Registrar", to: "Faculty, Students", type: "Coordinates", desc: "Academic records, admissions, and examination coordination.", color: "#5b9bd5" },
    { from: "HOD", to: "Faculty", type: "Supervises", desc: "Subject assignment, workload monitoring, marks approval.", color: "#9b72cf" },
    { from: "Faculty", to: "Students", type: "Instructs", desc: "Course delivery, attendance marking, assignment evaluation.", color: "#10b981" },
    { from: "Exam Cell", to: "Registrar, Faculty", type: "Partners", desc: "Hall tickets, seating, result publication, revaluation.", color: "#f97316" },
    { from: "Hostel Warden", to: "Students", type: "Manages", desc: "Room allocation, attendance, leave, mess billing.", color: "#14b8a6" },
    { from: "Accounts", to: "Students, Staff", type: "Services", desc: "Fee collection, payroll, scholarships, receipts.", color: "#34d399" },
    { from: "Store Manager", to: "All Departments", type: "Supplies", desc: "Equipment issuance, stock management, procurement.", color: "#a78bfa" },
    { from: "Library Admin", to: "Students, Faculty", type: "Serves", desc: "Book circulation, digital resources, fine management.", color: "#60a5fa" },
  ];

  return <div>
    <PageHeader title="Access Hierarchy" subtitle="Organizational authority chain and inter-role relationships" />

    {/* Pyramid */}
    <div style={{ marginBottom: 32 }}>
      {levels.map((lv, i) => <div key={lv.level} style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 0 }}>
        <div style={{ fontSize: 9, letterSpacing: "0.2em", color: lv.color, textTransform: "uppercase", marginBottom: 8, marginTop: i === 0 ? 0 : 4 }}>{lv.label}</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", width: "100%", padding: `0 ${i * 40}px`, boxSizing: "border-box" }}>
          {lv.roles.map(r => (
            <div key={r.id} style={{ padding: "11px 18px", borderRadius: 9, border: `1px solid ${r.color}45`, background: r.bg, display: "flex", alignItems: "center", gap: 11, minWidth: 160 }}>
              <span style={{ fontSize: 20 }}>{r.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: "bold", color: r.color }}>{r.title}</div>
                <div style={{ fontSize: 10, color: "#475569" }}>{r.subtitle}</div>
              </div>
            </div>
          ))}
        </div>
        {i < levels.length - 1 && <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "6px 0" }}>
          <div style={{ width: 1, height: 16, background: `linear-gradient(to bottom,${lv.color}60,${levels[i + 1].color}40)` }} />
          <div style={{ fontSize: 10, color: "rgba(212,160,23,0.5)" }}>▼</div>
        </div>}
      </div>)}
    </div>

    <SectionTitle>Role Interaction Map</SectionTitle>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 12, marginTop: 14 }}>
      {interactions.map((rel, i) => (
        <div key={i} style={{ padding: "13px 15px", borderRadius: 8, border: `1px solid ${rel.color}20`, background: `${rel.color}06` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
            <span style={{ fontSize: 12, fontWeight: "bold", color: rel.color }}>{rel.from}</span>
            <span style={{ fontSize: 11, color: "#334155" }}>→</span>
            <span style={{ fontSize: 11, color: "#94a3b8" }}>{rel.to}</span>
          </div>
          <span style={{ fontSize: 9, letterSpacing: "0.15em", color: rel.color, textTransform: "uppercase", background: `${rel.color}10`, padding: "2px 6px", borderRadius: 3, border: `1px solid ${rel.color}25` }}>{rel.type}</span>
          <p style={{ fontSize: 12, color: "#64748b", marginTop: 8, lineHeight: 1.5, margin: "8px 0 0" }}>{rel.desc}</p>
        </div>
      ))}
    </div>
  </div>;
}

// ─── AUDIT LOG ────────────────────────────────────────────────────────────────

function AuditView({ users, logs, addLog }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const filtered = logs.filter(l =>
    (filter === "all" || l.type === filter || l.module === filter) &&
    (!search || (l.user + l.action + l.target).toLowerCase().includes(search.toLowerCase()))
  );
  const types = ["all", ...new Set(logs.map(l => l.type))];

  return <div>
    <PageHeader title="Audit Trail" subtitle="Complete system activity log with user actions and timestamps" />
    <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search activity…" style={{ ...inputStyle, flex: "1 1 220px", maxWidth: 320 }} />
      <select style={{ ...inputStyle, width: "auto" }} value={filter} onChange={e => setFilter(e.target.value)}>
        {types.map(t => <option key={t} value={t}>{t === "all" ? "All Types" : t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
        {["Academic", "Finance", "Hostel", "Exam", "Store", "Library", "Admin"].map(m => <option key={m} value={m}>Module: {m}</option>)}
      </select>
      <span style={{ fontSize: 11, color: "#475569", alignSelf: "center", marginLeft: "auto" }}>{filtered.length} entries</span>
    </div>
    <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, overflow: "hidden" }}>
      {filtered.map((log, i) => {
        const lt = logType[log.type] || { color: "#94a3b8", label: log.type, icon: "·" };
        const mc = MODULES[log.module?.toLowerCase()]?.color || "#64748b";
        return <div key={log.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 16px", borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
          <div style={{ width: 30, height: 30, borderRadius: 7, background: `${lt.color}15`, border: `1px solid ${lt.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: lt.color, flexShrink: 0 }}>{lt.icon}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13 }}><strong style={{ color: "#e2e8f0" }}>{log.user}</strong> <span style={{ color: "#94a3b8" }}>{log.action}</span></div>
            <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{log.target}</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
            <Badge color={mc} small>{log.module}</Badge>
            <Badge color={lt.color} small>{lt.label}</Badge>
            <span style={{ fontSize: 10, color: "#334155", fontFamily: "monospace" }}>{log.time}</span>
          </div>
        </div>;
      })}
      {filtered.length === 0 && <div style={{ padding: "40px", textAlign: "center", color: "#334155", fontSize: 13 }}>No activity entries match the filter.</div>}
    </div>
  </div>;
}

// ─── MODULE CONFIG ────────────────────────────────────────────────────────────

function ModulesView() {
  const moduleDetails = [
    {
      id: "academic", label: "Academic", icon: "🎓", color: "#5b9bd5", status: "active",
      desc: "Core academic operations including course management, timetable generation, attendance tracking, assignment submissions, and CO-PO attainment measurement.",
      features: ["Course & Subject Management", "Timetable Generator", "Attendance System", "Assignment Module", "Internal Marks Entry", "CO-PO Attainment", "OBE Dashboard", "NAAC Reports"],
      roles: ["super_admin", "registrar", "hod", "faculty", "student", "exam_cell"], stats: { users: 18, actions: 1240 }
    },
    {
      id: "finance", label: "Finance", icon: "💳", color: "#34d399", status: "active",
      desc: "Complete financial management covering student fee collection, invoice generation, scholarship processing, payroll, and accounting ledger maintenance.",
      features: ["Fee Structure Config", "Invoice Generator", "Online Fee Payment", "Scholarship Management", "Payroll Processing", "Bank Reconciliation", "Financial Reports", "Tax Compliance"],
      roles: ["super_admin", "accounts", "student"], stats: { users: 4, actions: 560 }
    },
    {
      id: "hr", label: "HR", icon: "👥", color: "#f97316", status: "active",
      desc: "Human resource management for all institute staff including recruitment, leave management, appraisal workflows, and staff documentation.",
      features: ["Staff Profiles", "Leave Management", "Appraisal System", "Attendance (Biometric)", "Recruitment Module", "Training Records", "Salary History", "Staff Reports"],
      roles: ["super_admin", "hod", "accounts"], stats: { users: 3, actions: 180 }
    },
    {
      id: "hostel", label: "Hostel", icon: "🏠", color: "#14b8a6", status: "active",
      desc: "Residential facility management covering room allocation, student tracking, mess billing, complaint management, and leave approval workflows.",
      features: ["Room Allocation", "Hostel Attendance", "Leave Management", "Mess Billing", "Complaint System", "Room Maintenance", "Occupancy Reports", "Parent Notifications"],
      roles: ["super_admin", "hostel_warden", "student"], stats: { users: 3, actions: 320 }
    },
    {
      id: "exam", label: "Examination", icon: "📝", color: "#f472b6", status: "active",
      desc: "End-to-end examination management from scheduling and hall ticket generation to marks entry, result publication, and revaluation processing.",
      features: ["Exam Scheduling", "Seating Arrangement", "Hall Ticket Generator", "Question Paper Vault", "Marks Entry Portal", "Result Tabulation", "Revaluation Module", "Transcript Generator"],
      roles: ["super_admin", "registrar", "exam_cell", "faculty", "student"], stats: { users: 7, actions: 890 }
    },
    {
      id: "store", label: "Store", icon: "📦", color: "#a78bfa", status: "active",
      desc: "Inventory and procurement system managing institute assets, consumables, vendor relationships, purchase orders, and stock audits.",
      features: ["Item Catalog", "Stock Tracking", "Reorder Alerts", "Issue/Return System", "Purchase Orders", "Vendor Database", "Delivery Tracking", "Asset Register"],
      roles: ["super_admin", "store_manager"], stats: { users: 2, actions: 210 }
    },
    {
      id: "library", label: "Library", icon: "📚", color: "#60a5fa", status: "active",
      desc: "Knowledge resource management covering physical book circulation, digital resource access, NPTEL/e-journal integration, and fine management.",
      features: ["Book Catalog (OPAC)", "Issue/Return System", "Digital Resources", "E-Journal Access", "NPTEL Integration", "Overdue Alerts", "Fine Management", "Member Reports"],
      roles: ["super_admin", "library_admin", "student", "faculty"], stats: { users: 6, actions: 340 }
    },
    {
      id: "admin", label: "Admin", icon: "⚙", color: "#d4a017", status: "active",
      desc: "System administration module covering global configuration, user lifecycle management, audit trail, and ERP health monitoring.",
      features: ["User Management", "Role Configuration", "Institute Settings", "Audit Trail", "System Health", "Module Toggle", "API Management", "Backup & Restore"],
      roles: ["super_admin", "registrar", "accounts"], stats: { users: 3, actions: 480 }
    },
  ];

  const [sel, setSel] = useState(null);

  return <div>
    <PageHeader title="Module Configuration" subtitle="ERP module inventory, access roles, and feature overview" />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
      {moduleDetails.map(m => (
        <div key={m.id} onClick={() => setSel(sel?.id === m.id ? null : m)}
          style={{ borderRadius: 10, border: `1px solid ${sel?.id === m.id ? m.color + "50" : "rgba(255,255,255,0.07)"}`, background: sel?.id === m.id ? `${m.color}0d` : "rgba(255,255,255,0.025)", cursor: "pointer", transition: "all 0.2s", overflow: "hidden" }}>
          <div style={{ padding: "16px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: `${m.color}15`, border: `1px solid ${m.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{m.icon}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: "bold", color: sel?.id === m.id ? m.color : "#e2e8f0" }}>{m.label}</div>
                  <div style={{ fontSize: 10, color: "#334155" }}>{m.stats.users} roles · {m.stats.actions} actions/mo</div>
                </div>
              </div>
              <Badge color="#34d399" small>Active</Badge>
            </div>
            <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5, margin: "0 0 10px" }}>{m.desc}</p>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {m.features.slice(0, 4).map(f => <span key={f} style={{ fontSize: 10, padding: "2px 7px", borderRadius: 3, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#64748b" }}>{f}</span>)}
              {m.features.length > 4 && <span style={{ fontSize: 10, color: m.color }}>+{m.features.length - 4} more</span>}
            </div>
          </div>
          {sel?.id === m.id && <div style={{ borderTop: `1px solid ${m.color}20`, padding: "14px 18px", background: "rgba(0,0,0,0.15)" }}>
            <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: m.color, marginBottom: 10 }}>All Features</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, marginBottom: 12 }}>
              {m.features.map(f => <div key={f} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span style={{ color: m.color, fontSize: 9 }}>✓</span>
                <span style={{ fontSize: 11, color: "#94a3b8" }}>{f}</span>
              </div>)}
            </div>
            <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#475569", marginBottom: 8 }}>Roles with Access</div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {m.roles.map(r => { const rc = ROLES_CONFIG[r]; return rc ? <div key={r} style={{ padding: "3px 9px", borderRadius: 4, background: rc.bg, border: `1px solid ${rc.border}`, fontSize: 10, color: rc.color, display: "flex", alignItems: "center", gap: 5 }}><span>{rc.icon}</span>{rc.title}</div> : null; })}
            </div>
          </div>}
        </div>
      ))}
    </div>
  </div>;
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const CREDS = [
    { email: "admin@coep.ac.in", pwd: "admin123", role: "super_admin", name: "Dr. Rajesh Patil" },
    { email: "registrar@coep.ac.in", pwd: "reg123", role: "registrar", name: "Dr. Sunita Kulkarni" },
    { email: "hod@coep.ac.in", pwd: "hod123", role: "hod", name: "Prof. Anil Chougule" },
    { email: "faculty@coep.ac.in", pwd: "faculty123", role: "faculty", name: "Dr. Vikram Desai" },
    { email: "student@coep.ac.in", pwd: "student123", role: "student", name: "Amit Patil" },
  ];

  const handle = () => {
    setErr(""); setLoading(true);
    setTimeout(() => {
      const found = CREDS.find(c => c.email === email && c.pwd === pwd);
      if (found) onLogin(found);
      else { setErr("Invalid credentials. Try the demo accounts below."); setLoading(false); }
    }, 800);
  };

  return <div style={{ minHeight: "100vh", background: "#080c18", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Palatino Linotype',Georgia,serif", padding: 20 }}>
    <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse at 30% 40%,rgba(212,160,23,0.06) 0%,transparent 60%),radial-gradient(ellipse at 70% 60%,rgba(91,155,213,0.04) 0%,transparent 50%)", pointerEvents: "none" }} />
    <div style={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 1 }}>
      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{ width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg,#d4a017,#a07810)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 28, boxShadow: "0 0 30px rgba(212,160,23,0.3)", marginBottom: 16 }}>⚙</div>
        <div style={{ fontSize: 10, letterSpacing: "0.35em", color: "#d4a017", textTransform: "uppercase", marginBottom: 4 }}>COEP Technological University</div>
        <div style={{ fontSize: 22, fontWeight: "bold", color: "#f1f5f9", letterSpacing: "0.03em" }}>Enterprise Resource Planning</div>
        <div style={{ fontSize: 11, color: "#334155", letterSpacing: "0.15em", marginTop: 3 }}>ROLE-BASED ACCESS CONTROL SYSTEM</div>
      </div>

      <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 12, padding: "28px 30px", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
        <FormField label="Email Address"><input style={inputStyle} type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handle()} placeholder="Enter your ERP email" /></FormField>
        <FormField label="Password"><input style={inputStyle} type="password" value={pwd} onChange={e => setPwd(e.target.value)} onKeyDown={e => e.key === "Enter" && handle()} placeholder="Enter your password" /></FormField>
        {err && <div style={{ fontSize: 12, color: "#ef4444", marginBottom: 12, padding: "8px 12px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 6 }}>{err}</div>}
        <button style={{ ...btnPrimary, width: "100%", padding: "11px", fontSize: 13 }} onClick={handle} disabled={loading}>
          {loading ? "Authenticating…" : "Sign In to ERP"}
        </button>

        <div style={{ marginTop: 22, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 18 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.15em", color: "#475569", textTransform: "uppercase", marginBottom: 10 }}>Demo Credentials</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {CREDS.map(c => {
              const rc = ROLES_CONFIG[c.role];
              return <div key={c.email} onClick={() => { setEmail(c.email); setPwd(c.pwd); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 10px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)", cursor: "pointer", transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}>
                <span style={{ fontSize: 16 }}>{rc?.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: "#e2e8f0" }}>{c.name}</div>
                  <div style={{ fontSize: 10, color: "#475569" }}>{c.email}</div>
                </div>
                <Badge color={rc?.color || "#fff"} small>{rc?.title}</Badge>
              </div>;
            })}
          </div>
        </div>
      </div>
    </div>
  </div>;
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "dashboard", icon: "⬡", label: "Dashboard" },
  { id: "users", icon: "👤", label: "Users" },
  { id: "roles", icon: "🔐", label: "Roles & Perms" },
  { id: "matrix", icon: "⊞", label: "Access Matrix" },
  { id: "hierarchy", icon: "⬆", label: "Hierarchy" },
  { id: "modules", icon: "⬡", label: "Modules" },
  { id: "audit", icon: "📋", label: "Audit Log" },
];

export default function ERPApp() {
  const [session, setSession] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [users, setUsers] = useState(initialUsers);
  const [logs, setLogs] = useState(ACTIVITY_LOG);
  const [toast, setToastMsg] = useState(null);
  const [sideCollapsed, setSideCollapsed] = useState(false);

  const showToast = (msg, type = "success") => setToastMsg({ msg, type });
  const SIDE = sideCollapsed ? 62 : SIDEBAR_W;

  if (!session) return <LoginScreen onLogin={(s) => { setSession(s); setPage("dashboard"); }} />;

  const rc = ROLES_CONFIG[session.role];
  const activeUsers = users.filter(u => u.status === "active").length;

  return <div style={BASE}>
    {/* Background glow */}
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, background: "radial-gradient(ellipse at 15% 50%,rgba(212,160,23,0.04) 0%,transparent 55%),radial-gradient(ellipse at 85% 20%,rgba(91,155,213,0.03) 0%,transparent 50%)" }} />

    {/* SIDEBAR */}
    <div style={{ width: SIDE, minHeight: "100vh", background: "rgba(5,8,16,0.95)", borderRight: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", transition: "width 0.25s", flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflow: "hidden", zIndex: 10 }}>
      {/* Logo Area */}
      <div style={{ padding: sideCollapsed ? "14px 10px" : "16px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10, minHeight: 64 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#d4a017,#8b6010)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0, boxShadow: "0 0 15px rgba(212,160,23,0.25)" }}>⚙</div>
        {!sideCollapsed && <div>
          <div style={{ fontSize: 11, fontWeight: "bold", color: "#d4a017", letterSpacing: "0.05em", lineHeight: 1.2 }}>COEP ERP</div>
          <div style={{ fontSize: 9, color: "#334155", letterSpacing: "0.1em" }}>v2.0 RBAC System</div>
        </div>}
        <button onClick={() => setSideCollapsed(c => !c)} style={{ marginLeft: "auto", background: "none", border: "none", color: "#334155", cursor: "pointer", fontSize: 14, padding: 2, flexShrink: 0 }}>{sideCollapsed ? "▶" : "◀"}</button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
        {NAV_ITEMS.map(item => {
          const active = page === item.id;
          return <button key={item.id} onClick={() => setPage(item.id)} title={sideCollapsed ? item.label : undefined} style={{ width: "100%", padding: sideCollapsed ? "10px 0" : "9px 12px", display: "flex", alignItems: "center", gap: 10, borderRadius: 7, background: active ? "rgba(212,160,23,0.12)" : "transparent", border: active ? "1px solid rgba(212,160,23,0.25)" : "1px solid transparent", color: active ? "#d4a017" : "#475569", cursor: "pointer", fontSize: 13, fontFamily: "inherit", transition: "all 0.15s", marginBottom: 3, justifyContent: sideCollapsed ? "center" : "flex-start" }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
            {!sideCollapsed && <span style={{ fontSize: 12, letterSpacing: "0.03em", fontWeight: active ? "bold" : "normal" }}>{item.label}</span>}
          </button>;
        })}
      </nav>

      {/* User Profile in Sidebar */}
      <div style={{ padding: sideCollapsed ? "10px 6px" : "14px 14px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <Avatar name={session.name} color={rc?.color || "#d4a017"} size={32} />
          {!sideCollapsed && <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: "#cbd5e1", fontWeight: "bold", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{session.name}</div>
            <div style={{ fontSize: 9, color: rc?.color || "#d4a017" }}>{rc?.title}</div>
          </div>}
        </div>
        {!sideCollapsed && <button onClick={() => setSession(null)} style={{ ...btnSecondary, width: "100%", padding: "7px", fontSize: 11, marginTop: 10, letterSpacing: "0.08em" }}>Sign Out</button>}
      </div>
    </div>

    {/* MAIN */}
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, position: "relative", zIndex: 1 }}>
      {/* Top Bar */}
      <header style={{ padding: "0 28px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(8,12,24,0.8)", backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 5, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 12, color: "#334155" }}>
            {NAV_ITEMS.find(n => n.id === page)?.icon}{" "}
            <span style={{ color: "#64748b", marginLeft: 4 }}>{NAV_ITEMS.find(n => n.id === page)?.label}</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", gap: 12 }}>
            {[["👤", users.length, "Users", "#d4a017"], ["🟢", activeUsers, "Active", "#34d399"]].map(([icon, val, label, col]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ fontSize: 13 }}>{icon}</span>
                <span style={{ fontSize: 14, fontWeight: "bold", color: col }}>{val}</span>
                <span style={{ fontSize: 10, color: "#334155" }}>{label}</span>
              </div>
            ))}
          </div>
          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.06)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Avatar name={session.name} color={rc?.color || "#d4a017"} size={28} />
            <div>
              <div style={{ fontSize: 11, color: "#e2e8f0", lineHeight: 1.2 }}>{session.name}</div>
              <div style={{ fontSize: 9, color: rc?.color || "#d4a017" }}>{rc?.title}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main style={{ flex: 1, padding: "24px 28px", overflowY: "auto" }}>
        {page === "dashboard" && <Dashboard users={users} logs={logs} />}
        {page === "users" && <UsersView users={users} setUsers={setUsers} toast={showToast} />}
        {page === "roles" && <RolesView users={users} />}
        {page === "matrix" && <MatrixView />}
        {page === "hierarchy" && <HierarchyView />}
        {page === "modules" && <ModulesView />}
        {page === "audit" && <AuditView users={users} logs={logs} addLog={l => setLogs(p => [l, ...p])} />}
      </main>
    </div>

    {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToastMsg(null)} />}
  </div>;
}
