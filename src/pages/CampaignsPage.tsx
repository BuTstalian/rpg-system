import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, Crown, Copy } from 'lucide-react';
import { useCampaigns } from '@/hooks/useCampaigns';

export function CampaignsPage() {
  const { campaigns, loading, createCampaign, joinCampaign } = useCampaigns();
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [joinId, setJoinId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    setError(null);
    const result = await createCampaign(name.trim(), description.trim() || undefined);
    if (result.error) setError(result.error);
    else { setShowCreate(false); setName(''); setDescription(''); }
    setBusy(false);
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinId.trim()) return;
    setBusy(true);
    setError(null);
    const result = await joinCampaign(joinId.trim());
    if (result.error) setError(result.error);
    else { setShowJoin(false); setJoinId(''); }
    setBusy(false);
  };

  const copyId = (id: string) => {
    navigator.clipboard.writeText(id);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-parchment-400">Loading campaigns...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-parchment-100 font-bold tracking-wide">Campaigns</h1>
        <div className="flex gap-2">
          <button onClick={() => { setShowJoin(true); setShowCreate(false); }} className="btn-secondary text-sm">
            <Users className="w-4 h-4 inline mr-1" /> Join
          </button>
          <button onClick={() => { setShowCreate(true); setShowJoin(false); }} className="btn-primary text-sm">
            <Plus className="w-4 h-4 inline mr-1" /> Create
          </button>
        </div>
      </div>

      {error && (
        <div className="text-blood-400 text-sm bg-blood-900/20 border border-blood-800/30 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {/* Create Form */}
      {showCreate && (
        <form onSubmit={handleCreate} className="card space-y-3">
          <h3 className="card-header">New Campaign</h3>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            placeholder="Campaign name"
            required
            autoFocus
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field min-h-[80px]"
            placeholder="Description (optional)"
          />
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setShowCreate(false)} className="btn-ghost text-sm">Cancel</button>
            <button type="submit" disabled={busy} className="btn-primary text-sm">
              {busy ? 'Creating...' : 'Create Campaign'}
            </button>
          </div>
        </form>
      )}

      {/* Join Form */}
      {showJoin && (
        <form onSubmit={handleJoin} className="card space-y-3">
          <h3 className="card-header">Join Campaign</h3>
          <input
            type="text"
            value={joinId}
            onChange={(e) => setJoinId(e.target.value)}
            className="input-field font-mono text-sm"
            placeholder="Paste campaign ID"
            required
            autoFocus
          />
          <p className="text-xs text-parchment-500">Ask your GM for the campaign ID.</p>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setShowJoin(false)} className="btn-ghost text-sm">Cancel</button>
            <button type="submit" disabled={busy} className="btn-primary text-sm">
              {busy ? 'Joining...' : 'Join'}
            </button>
          </div>
        </form>
      )}

      {/* Campaign List */}
      {campaigns.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-parchment-400">No campaigns yet.</p>
          <p className="text-parchment-500 text-sm mt-1">Create one or join with a campaign ID.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {campaigns.map((c) => (
            <Link
              key={c.id}
              to={`/campaign/${c.id}`}
              className="card block hover:border-arcane-500/30 transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-parchment-100 font-medium group-hover:text-arcane-300 transition-colors">
                      {c.name}
                    </h3>
                    {c.role === 'gm' && (
                      <span className="badge bg-yellow-900/30 text-yellow-400 text-[10px]">
                        <Crown className="w-3 h-3 mr-0.5 inline" /> GM
                      </span>
                    )}
                  </div>
                  {c.description && (
                    <p className="text-sm text-parchment-400 mt-1 line-clamp-2">{c.description}</p>
                  )}
                  <p className="text-xs text-parchment-500 mt-2">
                    Tier {c.current_tier} • {c.session_count} sessions
                  </p>
                </div>
                <button
                  onClick={(e) => { e.preventDefault(); copyId(c.id); }}
                  className="btn-ghost p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Copy campaign ID"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
