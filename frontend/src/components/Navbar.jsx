import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User, Home } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="public-nav bg-white text-slate-900 border-b border-slate-200 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex flex-col justify-center">
                            <span className="font-extrabold text-3xl tracking-widest text-black leading-none font-sans" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                                MITRA
                            </span>
                            <span className="text-[0.6rem] font-bold tracking-[0.15em] text-slate-500 uppercase mt-0.5">
                                Vishnu Institute of Technology
                            </span>
                        </Link>
                    </div>
                    <div className="public-nav-links flex items-center space-x-6 text-sm font-semibold">
                        <Link to="/" className="hover:text-black text-slate-600 flex items-center gap-1 transition-colors">
                            <Home size={18} /> <span>Home</span>
                        </Link>
                        {user ? (
                            <>
                                <Link to="/dashboard" className="hover:text-black text-slate-600 flex items-center gap-1 transition-colors">
                                    <User size={18} /> <span>Dashboard</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="bg-black hover:bg-slate-800 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-1"
                                >
                                    <LogOut size={18} /> <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/student-login" className="hover:text-black text-slate-600 transition-colors">Student Login</Link>
                                <Link to="/admin-login" className="hover:text-black text-slate-600 transition-colors">Admin Login</Link>
                                <Link
                                    to="/register"
                                    className="bg-black hover:bg-slate-800 text-white px-5 py-2 rounded-md transition-colors font-medium shadow-sm hover:shadow-md"
                                >
                                    Join Now
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
