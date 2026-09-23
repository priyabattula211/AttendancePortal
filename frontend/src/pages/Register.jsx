import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../services/firebaseClient';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { User, Mail, Lock, BookOpen, Fingerprint, ShieldCheck } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Register = ({ portal = 'student' }) => {
    const isAdmin = portal === 'admin';
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', rollNumber: '', employeeId: '', branch: '', department: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    useEffect(() => { if (user) navigate('/dashboard'); }, [user, navigate]);
    const handleChange = (event) => setFormData({ ...formData, [event.target.name]: event.target.value });
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);
        try {
            const credentials = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const profile = {
                firstName: formData.firstName, lastName: formData.lastName, email: formData.email,
                role: isAdmin ? 'Admin' : 'Student',
                ...(isAdmin ? { employeeId: formData.employeeId, department: formData.department } : { rollNumber: formData.rollNumber, branch: formData.branch }),
                createdAt: serverTimestamp()
            };
            await setDoc(doc(db, 'users', credentials.user.uid), profile);
            localStorage.setItem(`mitra-profile-${credentials.user.uid}`, JSON.stringify({ ...profile, createdAt: undefined }));
            navigate(isAdmin ? '/admin-portal' : '/student-portal');
        } catch (err) { setError(err.message || 'Registration failed. Please try again.'); } finally { setLoading(false); }
    };

    return <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8"><div className="max-w-md w-full"><div className="bg-white rounded-2xl shadow-xl overflow-hidden"><div className="bg-brand-900 p-8 text-center relative overflow-hidden"><div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div><div className="relative z-10 flex justify-center mb-3">{isAdmin ? <ShieldCheck size={34} className="text-white" /> : <User size={34} className="text-white" />}</div><h2 className="relative z-10 text-3xl font-extrabold text-white">{isAdmin ? 'Create Admin Account' : 'Create Student Account'}</h2><p className="relative z-10 mt-2 text-brand-100">{isAdmin ? 'Set up an administrator profile for the eCAP portal.' : 'Create your student profile to access attendance.'}</p></div><div className="p-8"><p className="mb-4"><Link to="/" className="font-semibold text-brand-600 hover:text-brand-500">← Back to Home</Link></p>{error && <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md"><p className="text-red-700 text-sm font-medium">{error}</p></div>}<form onSubmit={handleSubmit} className="space-y-5"><div className="grid grid-cols-2 gap-4"><Field label="First name" name="firstName" value={formData.firstName} onChange={handleChange} icon={User} /><Field label="Last name" name="lastName" value={formData.lastName} onChange={handleChange} /></div><Field label={isAdmin ? 'Official email' : 'College email'} name="email" type="email" placeholder="you@vit.edu.in" value={formData.email} onChange={handleChange} icon={Mail} />{isAdmin ? <div className="grid grid-cols-2 gap-4"><Field label="Employee ID" name="employeeId" value={formData.employeeId} onChange={handleChange} icon={Fingerprint} /><Field label="Department" name="department" value={formData.department} onChange={handleChange} icon={BookOpen} /></div> : <div className="grid grid-cols-2 gap-4"><Field label="Roll number" name="rollNumber" value={formData.rollNumber} onChange={handleChange} icon={Fingerprint} /><label className="block text-sm font-medium text-slate-700">Branch<select name="branch" required className="mt-1 w-full py-2 px-3 border border-slate-300 rounded-lg text-sm bg-white" value={formData.branch} onChange={handleChange}><option value="">Select branch</option><option>CSE</option><option>IT</option><option>ECE</option><option>AI&amp;DS</option><option>Other</option></select></label></div>}<Field label="Password" name="password" type="password" value={formData.password} onChange={handleChange} icon={Lock} /><button type="submit" disabled={loading} className="w-full py-3 px-4 rounded-lg text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 transition-colors shadow-md">{loading ? 'Creating account...' : `Create ${isAdmin ? 'admin' : 'student'} account`}</button></form></div><div className="bg-slate-50 px-8 py-6 text-center border-t border-slate-100"><p className="text-sm text-slate-600">Already have an account? <Link to={isAdmin ? '/admin-login' : '/student-login'} className="font-semibold text-brand-600 hover:text-brand-500">{isAdmin ? 'Admin login' : 'Student login'}</Link></p>{!isAdmin && <p className="text-sm text-slate-600 mt-2">Need admin access? <Link to="/admin-register" className="font-semibold text-brand-600 hover:text-brand-500">Create admin account</Link></p>}</div></div></div></div>;
};

const Field = ({ label, name, type = 'text', placeholder, value, onChange, icon: Icon }) => <label className="block text-sm font-medium text-slate-700">{label}<div className="relative mt-1">{Icon && <Icon size={16} className="absolute left-3 top-2.5 text-slate-400" />}<input type={type} name={name} required minLength={type === 'password' ? 6 : undefined} placeholder={placeholder} className={`${Icon ? 'pl-9' : 'px-3'} w-full py-2 border border-slate-300 rounded-lg text-sm`} value={value} onChange={onChange} /></div></label>;

export default Register;
