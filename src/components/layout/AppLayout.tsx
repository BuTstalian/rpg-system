import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut, User, Home, ScrollText, Sword } from 'lucide-react';
import { useAuth } from '@/lib/auth';

const NAV_LINKS = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/campaigns', icon: ScrollText, label: 'Campaigns' },
  { to: '/character/demo', icon: Sword, label: 'Demo' },
];

export function AppLayout() {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const showBack = location.pathname !== '/';

  return (
    <div className="min-h-screen bg-ink-900 flex flex-col">
      {/* Header */}
      <header className="border-b border-ink-700/50 bg-ink-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBack && (
              <button
                onClick={() => navigate(-1)}
                className="p-1.5 rounded-lg text-parchment-500 hover:text-parchment-200 hover:bg-ink-700/50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <Link to="/" className="font-display text-lg text-parchment-100 font-bold tracking-wider hover:text-arcane-300 transition-colors">
              AETHERMOOR
            </Link>
          </div>

          <nav className="hidden sm:flex items-center gap-1">
            {NAV_LINKS.map(({ to, icon: Icon, label }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    active
                      ? 'text-arcane-300 bg-arcane-900/20'
                      : 'text-parchment-400 hover:text-parchment-200 hover:bg-ink-700/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </Link>
              );
            })}
          </nav>

          {profile && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-sm text-parchment-400">
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{profile.display_name ?? profile.username}</span>
              </div>
              <button
                onClick={signOut}
                className="p-1.5 rounded-lg text-parchment-500 hover:text-blood-400 hover:bg-ink-700/50 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      <nav className="sm:hidden border-t border-ink-700/50 bg-ink-900/95 backdrop-blur-sm sticky bottom-0 z-50">
        <div className="flex justify-around py-2">
          {NAV_LINKS.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                  active ? 'text-arcane-300' : 'text-parchment-500'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px]">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
