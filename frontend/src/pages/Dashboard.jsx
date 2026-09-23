import { useEffect, useMemo, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, CalendarDays, Check, CheckCircle2, ChevronDown, ClipboardCheck, FileText, LayoutDashboard, Search, ShieldCheck, TrendingUp, Users, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import mitraLogo from '../assets/frontpage.jpg.jpeg';

const today = new Date().toISOString().slice(0, 10);
const StatCard = ({ icon: Icon, label, value, note, tone }) => <div className="portal-stat-card"><div className={`portal-stat-icon ${tone}`}><Icon size={19} /></div><div className="portal-stat-copy"><span>{label}</span><strong>{value}</strong><small>{note}</small></div></div>;
const EmptyState = ({ title, copy }) => <div className="portal-empty-state"><CalendarDays size={24} /><strong>{title}</strong><span>{copy}</span></div>;
const PanelTitle = ({ title, copy }) => <div className="portal-panel-heading"><div><h2>{title}</h2><p>{copy}</p></div></div>;

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const role = String(user?.role || 'student').toLowerCase();
    const isAdmin = role === 'admin' || role === 'administrator';
    const [activeView, setActiveView] = useState(isAdmin ? 'overview' : 'my-attendance');
    const [date, setDate] = useState(today);
    const [search, setSearch] = useState('');
    const [records, setRecords] = useState(() => {
        try { return JSON.parse(localStorage.getItem('mitra-attendance-records')) || []; } catch { return []; }
    });
    useEffect(() => { localStorage.setItem('mitra-attendance-records', JSON.stringify(records)); }, [records]);
    const visibleRecords = useMemo(() => records.filter((record) => `${record.name} ${record.roll}`.toLowerCase().includes(search.toLowerCase())), [records, search]);
    const present = records.filter((record) => record.present).length;
    const average = records.length ? Math.round(records.reduce((total, record) => total + (record.percentage || 0), 0) / records.length) : 0;
    const displayName = user?.firstName || (isAdmin ? 'Admin' : 'Student');
    const tabs = isAdmin ? [['overview', LayoutDashboard, 'Overview'], ['attendance', ClipboardCheck, 'Mark attendance'], ['students', Users, 'Students'], ['reports', BarChart3, 'Reports']] : [['my-attendance', LayoutDashboard, 'My attendance'], ['analysis', BarChart3, 'My analysis'], ['history', CalendarDays, 'Attendance history']];
    const toggleRecord = (id) => setRecords((current) => current.map((record) => record.id === id ? { ...record, present: !record.present } : record));
    const markAll = (value) => setRecords((current) => current.map((record) => ({ ...record, present: value })));

    return <div className="portal-shell">
        <aside className="portal-sidebar"><Link to="/" className="portal-brand"><img src={mitraLogo} alt="MITRA - Vishnu Institute of Technology" /></Link><div className="portal-workspace"><span className="portal-eyebrow">WORKSPACE</span><div className="portal-workspace-select"><span className="portal-mini-logo">V</span><span>Vishnu Institute</span><ChevronDown size={15} /></div></div><nav className="portal-nav"><span className="portal-eyebrow">MENU</span>{tabs.map(([key, Icon, label]) => <button key={key} className={`portal-nav-item ${activeView === key ? 'active' : ''}`} onClick={() => setActiveView(key)}><Icon size={18} /><span>{label}</span></button>)}</nav></aside>
        <section className="portal-main"><header className="portal-topbar"><div className="portal-mobile-brand">MITRA</div><div className="portal-top-actions"><div className="portal-user"><div className="portal-avatar">{displayName[0]?.toUpperCase()}</div><div><strong>{displayName} {user?.lastName || ''}</strong><span>{isAdmin ? 'Administrator' : `${user?.rollNumber || 'Student'} · ${user?.branch || 'Student'}`}</span></div></div><button className="portal-button secondary small" onClick={logout}>Log out</button></div></header>
            <main className="portal-content"><div className="portal-page-heading"><div><div className="portal-breadcrumb">MITRA <span>/</span> {isAdmin ? 'Admin workspace' : 'Student portal'} <span>/</span> {tabs.find(([key]) => key === activeView)?.[2]}</div><h1>{isAdmin && activeView === 'overview' ? <>Good morning, <em>{displayName}</em></> : tabs.find(([key]) => key === activeView)?.[2]}</h1><p>{isAdmin ? 'Manage attendance without fabricated records.' : 'Your attendance will appear here after classes are recorded.'}</p></div><button className="portal-button primary"><CalendarDays size={16} /> {isAdmin ? 'Today' : 'Academic year 2025–26'}</button></div>{isAdmin ? <AdminView activeView={activeView} records={records} visibleRecords={visibleRecords} present={present} average={average} date={date} setDate={setDate} search={search} setSearch={setSearch} markAll={markAll} toggleRecord={toggleRecord} /> : <StudentView activeView={activeView} />}</main>
        </section>
    </div>;
};

const AdminView = ({ activeView, records, visibleRecords, present, average, date, setDate, search, setSearch, markAll, toggleRecord }) => {
    if (activeView === 'students') return <section className="portal-panel"><PanelTitle title="Student directory" copy="Students will appear after they are registered." /><EmptyState title="No students yet" copy="Register student accounts to start managing attendance." /></section>;
    if (activeView === 'reports') return <><div className="portal-stat-grid"><StatCard icon={Users} label="Students tracked" value={records.length} note="No fabricated records" tone="blue" /><StatCard icon={TrendingUp} label="Average attendance" value={`${average}%`} note="Calculated from records" tone="violet" /><StatCard icon={ShieldCheck} label="Above requirement" value="0" note="Awaiting attendance" tone="green" /><StatCard icon={FileText} label="Reports" value="0" note="No reports yet" tone="orange" /></div><section className="portal-panel"><PanelTitle title="Reports" copy="Reports become available after attendance is recorded." /><EmptyState title="Nothing to report yet" copy="Mark attendance for a class to generate performance data." /></section></>;
    return <><div className="portal-stat-grid"><StatCard icon={Users} label="Students tracked" value={records.length} note="Across active classes" tone="blue" /><StatCard icon={CheckCircle2} label="Present today" value={`${present} / ${records.length}`} note="Selected class" tone="green" /><StatCard icon={TrendingUp} label="Average attendance" value={`${average}%`} note="From saved records" tone="violet" /><StatCard icon={ClipboardCheck} label="Pending classes" value="0" note="No sessions created" tone="orange" /></div><section className="portal-panel attendance-panel"><PanelTitle title="Today's attendance" copy="Mark attendance for a registered class." /><div className="attendance-toolbar"><label><span>Date</span><input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label><label className="attendance-search"><span>Search students</span><div><Search size={15} /><input placeholder="Name or roll number" value={search} onChange={(event) => setSearch(event.target.value)} /></div></label><div className="attendance-quick"><button disabled={!records.length} onClick={() => markAll(true)}><Check size={15} /> Mark all present</button><button disabled={!records.length} onClick={() => markAll(false)}><X size={15} /> Clear all</button></div></div>{records.length ? <AttendanceTable records={visibleRecords} toggleRecord={toggleRecord} /> : <EmptyState title="No attendance records yet" copy="Register students and create a class session before marking attendance." />}</section></>;
};

const AttendanceTable = ({ records, toggleRecord }) => <div className="portal-table-wrap"><table className="portal-table"><thead><tr><th>Student</th><th>Roll number</th><th>Branch</th><th>Status</th></tr></thead><tbody>{records.map((record) => <tr key={record.id}><td><strong>{record.name}</strong></td><td>{record.roll}</td><td><span className="branch-pill">{record.branch}</span></td><td><button className={`status-toggle ${record.present ? 'present' : 'absent'}`} onClick={() => toggleRecord(record.id)}>{record.present ? <Check size={14} /> : <X size={14} />}{record.present ? 'Present' : 'Absent'}</button></td></tr>)}</tbody></table></div>;

const StudentView = ({ activeView }) => {
    if (activeView === 'history') return <section className="portal-panel"><PanelTitle title="Attendance history" copy="Your latest class records will appear here." /><EmptyState title="No attendance history yet" copy="Your attendance will be shown after an administrator marks your classes." /></section>;
    if (activeView === 'analysis') return <><StudentStats /><div className="student-dashboard-grid"><SubjectEmpty /><ScoreEmpty /></div><section className="portal-panel"><PanelTitle title="Attendance trend" copy="Trends are calculated from your class records." /><EmptyState title="No trend data yet" copy="Attend a class to begin building your analysis." /></section></>;
    return <><StudentStats /><div className="student-dashboard-grid"><SubjectEmpty /><ScoreEmpty /></div><section className="portal-panel"><PanelTitle title="Recent attendance" copy="Your latest class records will appear here." /><EmptyState title="No attendance recorded" copy="Your administrator has not marked any attendance yet." /></section></>;
};
const StudentStats = () => <div className="portal-stat-grid"><StatCard icon={CheckCircle2} label="Overall attendance" value="0%" note="No records yet" tone="green" /><StatCard icon={CalendarDays} label="Classes attended" value="0 / 0" note="This academic year" tone="blue" /><StatCard icon={TrendingUp} label="Current streak" value="0 days" note="No classes recorded" tone="violet" /><StatCard icon={ShieldCheck} label="Attendance status" value="Pending" note="Waiting for records" tone="orange" /></div>;
const SubjectEmpty = () => <section className="portal-panel"><PanelTitle title="Subject-wise analysis" copy="Subject performance appears after attendance is recorded." /><EmptyState title="No subject records yet" copy="Your subject attendance breakdown will appear here." /></section>;
const ScoreEmpty = () => <section className="portal-panel attendance-score"><PanelTitle title="Attendance score" copy="Based on your registered subjects." /><div className="score-ring"><div><strong>0%</strong><span>No records</span></div></div><div className="score-callout"><TrendingUp size={16} /><span>Your score will update after your first class.</span></div></section>;

export default Dashboard;
