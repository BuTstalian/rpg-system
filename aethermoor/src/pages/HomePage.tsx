import { Link } from 'react-router-dom';
import { User, Map, Sword, BookOpen, Hammer, FlaskConical } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/character/demo', icon: User, label: 'Character Sheet', desc: 'View Sera Vane (demo)', ready: true },
  { to: '#', icon: Sword, label: 'Combat Table', desc: 'Hex grid, initiative, real-time', ready: false },
  { to: '#', icon: Map, label: 'World Map', desc: 'Campaign map & exploration', ready: false },
  { to: '#', icon: BookOpen, label: 'Spellbook', desc: '8 schools, spell management', ready: false },
  { to: '#', icon: Hammer, label: 'Crafting Bench', desc: '4 disciplines, recipes, materials', ready: false },
  { to: '#', icon: FlaskConical, label: 'GM Dashboard', desc: 'Encounters, bestiary, session tools', ready: false },
];

export function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Title */}
        <div className="text-center space-y-3">
          <h1 className="font-display text-5xl text-parchment-100 font-bold tracking-wider">
            AETHERMOOR
          </h1>
          <p className="text-parchment-400 text-lg">
            Tabletop RPG System — Digital Platform
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-parchment-500">
            <span>d20 Resolution</span>
            <span className="text-ink-600">•</span>
            <span>10 Paths</span>
            <span className="text-ink-600">•</span>
            <span>8 Magic Schools</span>
            <span className="text-ink-600">•</span>
            <span>Hex Grid Combat</span>
          </div>
        </div>

        {/* Nav Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const content = (
              <div className={`card hover:border-arcane-500/30 transition-all group cursor-pointer ${!item.ready ? 'opacity-40' : ''}`}>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-ink-700/50 group-hover:bg-arcane-900/30 transition-colors">
                    <Icon className="w-5 h-5 text-parchment-300 group-hover:text-arcane-400 transition-colors" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-parchment-200 group-hover:text-parchment-100">
                        {item.label}
                      </h3>
                      {!item.ready && (
                        <span className="badge bg-ink-700 text-parchment-500 text-[10px]">Coming</span>
                      )}
                    </div>
                    <p className="text-xs text-parchment-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              </div>
            );

            return item.ready ? (
              <Link key={item.label} to={item.to}>{content}</Link>
            ) : (
              <div key={item.label}>{content}</div>
            );
          })}
        </div>

        {/* Status */}
        <div className="text-center text-xs text-parchment-600 space-y-1">
          <p>v0.1.0 — Foundation scaffold</p>
          <p>React + TypeScript + Supabase + Cloudflare</p>
        </div>
      </div>
    </div>
  );
}
