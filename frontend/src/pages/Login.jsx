import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../services/firebaseClient';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Mail, Lock, ArrowRight, ShieldCheck, GraduationCap } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Login = ({ portal = 'student' }) => {
    const isAdminPortal = portal === 'admin';
    const expectedRole = isAdminPortal ? 'admin' : 'student';
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            const role = String(user.role || 'student').toLowerCase();
            navigate(role === 'admin' || role === 'administrator' ? '/admin-portal' : '/student-portal');
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const credentials = await signInWithEmailAndPassword(auth, formData.email, formData.password);
            const profileRequest = getDoc(doc(db, 'users', credentials.user.uid));
            const profileTimeout = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Profile request timed out')), 2500);
            });
            let profile;
            try {
                const profileSnapshot = await Promise.race([profileRequest, profileTimeout]);
                profile = profileSnapshot.data() || { role: 'Student' };
            } catch {
                profile = JSON.parse(localStorage.getItem(`mitra-profile-${credentials.user.uid}`) || '{"role":"Student"}');
            }
            localStorage.setItem(`mitra-profile-${credentials.user.uid}`, JSON.stringify(profile));
            const role = String(profile.role || 'student').toLowerCase();

            if (role !== expectedRole && !(isAdminPortal && role === 'administrator')) {
                await signOut(auth);
                throw new Error(`This account is registered as a ${role === 'admin' || role === 'administrator' ? 'administrator' : 'student'}. Please use the ${role === 'admin' || role === 'administrator' ? 'Admin' : 'Student'} login.`);
            }

            navigate(isAdminPortal ? '/admin-portal' : '/student-portal');
        } catch (err) {
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-brand-900 p-8 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-brand-700 rounded-full opacity-20 blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-brand-500 rounded-full opacity-20 blur-2xl"></div>
                        <div className="relative z-10 flex justify-center mb-4">{isAdminPortal ? <ShieldCheck size={38} className="text-white" /> : <GraduationCap size={38} className="text-white" />}</div>
                        <h2 className="relative z-10 text-3xl font-extrabold text-white">{isAdminPortal ? 'Admin eCAP Login' : 'Student eCAP Login'}</h2>
                        <p className="relative z-10 mt-2 text-brand-100">{isAdminPortal ? 'Access attendance controls and student performance.' : 'View your attendance and academic analysis.'}</p>
                    </div>
                    
                    <div className="p-8">
                        {error && (
                            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                                <p className="text-red-700 text-sm font-medium">{error}</p>
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail size={18} className="text-slate-400" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-all"
                                        placeholder="you@vit.edu.in"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock size={18} className="text-slate-400" />
                                    </div>
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-all"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors shadow-md ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Signing in...' : (
                                    <>Sign in <ArrowRight size={18} /></>
                                )}
                            </button>
                        </form>
                    </div>
                    
                    <div className="bg-slate-50 px-8 py-6 text-center border-t border-slate-100">
                        <p className="mb-3"><Link to="/" className="font-semibold text-brand-600 hover:text-brand-500 transition-colors">← Back to Home</Link></p>
                        <p className="text-sm text-slate-600">
                            {isAdminPortal ? 'Are you a student?' : 'Are you an administrator?'}{' '}
                            <Link to={isAdminPortal ? '/student-login' : '/admin-login'} className="font-semibold text-brand-600 hover:text-brand-500 transition-colors">
                                {isAdminPortal ? 'Student login' : 'Admin login'}
                            </Link>
                            <span className="mx-2">·</span><Link to={isAdminPortal ? '/admin-register' : '/register'} className="font-semibold text-brand-600 hover:text-brand-500 transition-colors">{isAdminPortal ? 'Create admin account' : 'Register'}</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
