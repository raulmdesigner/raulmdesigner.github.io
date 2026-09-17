import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, LayoutTemplate, Package, Settings, LogOut } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Leads CRM', path: '/admin/leads', icon: Users, end: false },
  { label: 'Serviços CMS', path: '/admin/services', icon: LayoutTemplate, end: false },
  { label: 'Pacotes', path: '/admin/packages', icon: Package, end: false },
  { label: 'Configurações', path: '/admin/settings', icon: Settings, end: false },
];

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-bg flex flex-col md:flex-row font-body text-text">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-surface border-r border-border flex flex-col md:min-h-screen">
        <div className="h-20 flex items-center px-6 border-b border-border">
          <span className="text-xl font-display font-bold tracking-tight">IAMUREL Admin</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.end ? location.pathname === item.path : location.pathname.startsWith(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                  isActive 
                    ? 'bg-action/10 text-action' 
                    : 'text-muted hover:bg-bg hover:text-text'
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <button className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted hover:text-action transition-colors">
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="h-20 bg-surface border-b border-border flex items-center px-8 shrink-0">
          <h1 className="text-lg font-medium text-text">Visão Geral</h1>
        </header>
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
