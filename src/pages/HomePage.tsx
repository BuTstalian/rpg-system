import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Sword, BookOpen, FlaskConical, Plus, ScrollText } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import type { Character } from '@/types';

const NAV_ITEMS = [
  { to: '/character/create', icon: Plus, label: 'New Character', desc: 'Create via 8-step wizard', ready: true },
  { to: '/campaigns', icon: ScrollText, label: 'Campaigns', desc: 'Create or join a campaign', ready: true },
  { to: '/character/demo', icon: User, label: 'Demo Sheet', desc: 'View Sera Vane (demo data)', ready: true },
  { to: '#', icon: Sword, label: 'Combat Table', desc: 'Hex grid, initiative, real-time', ready: false },
  { to: '#', icon: BookOpen, label: 'Spellbook', desc: '8 schools, spell management', ready: false },
  { to: '#', icon: FlaskConical, label: 'GM Dashboard', desc: 'Encounters, bestiary, session tools', ready: false },
];

export function HomePage() {
  const { user } = useAuth();
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('characters')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('updated_at', { ascending: false })
      .then(({ data }) => setCharacters((data ?? []) as Character[]));
  }, [user]);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2 pt-4">
        <h1 className="font-display text-4xl text-parchment-100 font-bold tracking-wider">AETHERMOOR</h1>
        <p className="text-parchment-400">Digital TTRPG Platform</p>
      </div>

      {/* My Characters */}
      {characters.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-display text-sm text-parchment-400 uppercase tracking-wider">Your Characters</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {characters.map((c) => (
              <Link
                key={c.id}
                to={`/character/${c.id}`}
                className="card hover:border-arcane-500/30 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-ink-700/50">
                    <User className="w-4 h-4 text-parchment-300" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-parchment-200 group-hover:text-arcane-300 transition-colors">
                      {c.name}
                    </span>
                    <p className="text-xs text-parchment-500">
                      Tier {c.tier} <span className="capitalize">{c.path}</span> • {c.hp_current}/{c.hp_max} HP
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

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
                    <h3 className="text-sm font-medium text-parchment-200 group-hover:text-parchment-100">{item.label}</h3>
                    {!item.ready && <span className="badge bg-ink-700 text-parchment-500 text-[10px]">Coming</span>}
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

      <div className="text-center text-xs text-parchment-600 space-y-1">
        <p>v0.3.0 — Character Creator + Auth + Campaigns + Branch Selection</p>
      </div>
    </div>
  );
}
