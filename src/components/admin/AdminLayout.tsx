import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Products', icon: Package, path: '/admin/products' },
    { name: 'Site Content', icon: FileText, path: '/admin/content' },
    { name: 'Enquiries', icon: MessageSquare, path: '/admin/enquiries' },
    { name: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-stone-100 flex">
      {/* Sidebar */}
      <aside 
        className={`${isSidebarOpen ? 'w-72' : 'w-20'} bg-maroon-950 text-white transition-all duration-300 flex flex-col fixed h-full z-50`}
      >
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && (
            <div className="flex flex-col">
              <span className="text-xl font-serif font-bold text-gold-400">VANITHA</span>
              <span className="text-[8px] uppercase tracking-widest text-gold-200/50">Admin Panel</span>
            </div>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 hover:bg-white/10 rounded-lg text-gold-400"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center p-3 rounded-xl transition-all group ${
                  isActive 
                    ? 'bg-gold-600 text-maroon-950 font-bold shadow-lg' 
                    : 'text-stone-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon size={22} className={isActive ? 'text-maroon-950' : 'text-gold-500/70 group-hover:text-gold-400'} />
                {isSidebarOpen && (
                  <span className="ml-4 text-sm tracking-wide">{item.name}</span>
                )}
                {isActive && isSidebarOpen && (
                  <ChevronRight size={16} className="ml-auto" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
          >
            <LogOut size={22} />
            {isSidebarOpen && <span className="ml-4 text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-20'}`}>
        <header className="bg-white h-20 border-b border-stone-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <h2 className="text-xl font-serif font-bold text-stone-900">
            {menuItems.find(item => item.path === location.pathname)?.name || 'Admin'}
          </h2>
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-stone-900">Administrator</p>
              <p className="text-xs text-stone-500">Vanitha Covering</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center text-gold-700 font-bold border border-gold-200">
              A
            </div>
          </div>
        </header>

        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
