import { useEffect, useMemo, useState } from 'react';
import type { DataStructure } from '../types';

type NodeId = string;
interface Edge { from: NodeId; to: NodeId }

export default function GraphVisualization({ data }: { data: DataStructure }) {
  const [nodes, setNodes] = useState<NodeId[]>(['A', 'B', 'C']);
  const [edges, setEdges] = useState<Edge[]>([{ from: 'A', to: 'B' }, { from: 'B', to: 'C' }]);
  const [nName, setNName] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [start, setStart] = useState('');
  const [goal, setGoal] = useState('');
  const [message, setMessage] = useState('');
  const [notes, setNotes] = useState<string[]>([]);
  const [noteInput, setNoteInput] = useState('');

  useEffect(() => { const k = `${data.id}-notes`; const raw = localStorage.getItem(k); if (raw) setNotes(JSON.parse(raw)); }, [data.id]);
  useEffect(() => { const k = `${data.id}-notes`; localStorage.setItem(k, JSON.stringify(notes)); }, [data.id, notes]);

  const flash = (m: string) => { setMessage(m); setTimeout(() => setMessage(''), 1600); };

  const addNode = () => {
    const name = nName.trim(); if (!name) return flash('Enter node name');
    if (nodes.includes(name)) return flash('Node exists');
    setNodes([...nodes, name]); setNName(''); flash('Node added');
  };
  const addEdge = () => {
    const u = from.trim(), v = to.trim(); if (!u || !v) return flash('Enter from/to');
    if (!nodes.includes(u) || !nodes.includes(v)) return flash('Node missing');
    setEdges([...edges, { from: u, to: v }]); setFrom(''); setTo(''); flash('Edge added');
  };
  const bfs = () => {
    const s = start.trim(), g = goal.trim(); if (!s || !g) return flash('Enter start/goal');
    if (!nodes.includes(s) || !nodes.includes(g)) return flash('Node missing');
    const adj = buildAdjacency(nodes, edges);
    const q: NodeId[] = [s]; const seen = new Set<NodeId>([s]); const parent: Record<NodeId, NodeId | null> = { [s]: null } as any;
    while (q.length) {
      const u = q.shift()!; if (u === g) break;
      for (const v of adj[u] || []) if (!seen.has(v)) { seen.add(v); parent[v] = u; q.push(v); }
    }
    if (!(g in parent)) return flash('No path found');
    const path: NodeId[] = []; let cur: NodeId | null = g; while (cur) { path.push(cur); cur = parent[cur]!; } path.reverse();
    flash(`BFS path: ${path.join(' -> ')}`);
  };

  const adjList = useMemo(() => buildAdjacency(nodes, edges), [nodes, edges]);

  return (
    <div className="space-y">
      <div className="center"><h2 style={{ fontSize: 28, margin: 0 }}>{data.name}</h2><p className="muted" style={{ marginTop: 6 }}>{data.description}</p></div>

      <div className="form">
        <input className="input" placeholder="New node" value={nName} onChange={(e) => setNName(e.target.value)} />
        <button className="btn btn-primary" onClick={addNode}>Add Node</button>
        <input className="input" placeholder="From" value={from} onChange={(e) => setFrom(e.target.value)} />
        <input className="input" placeholder="To" value={to} onChange={(e) => setTo(e.target.value)} />
        <button className="btn btn-primary" onClick={addEdge}>Add Edge</button>
        <input className="input" placeholder="BFS start" value={start} onChange={(e) => setStart(e.target.value)} />
        <input className="input" placeholder="BFS goal" value={goal} onChange={(e) => setGoal(e.target.value)} />
        <button className="btn btn-info" onClick={bfs}>BFS</button>
      </div>

      {message && <div className="center" style={{ color: 'var(--pink-700)', fontWeight: 600 }}>{message}</div>}

      <section className="section">
        <h2>Adjacency List</h2>
        <div className="card"><div className="card-body">
          {nodes.length === 0 && <div className="muted">(no nodes)</div>}
          <ul className="space-y" style={{ paddingLeft: 18, margin: 0 }}>
            {nodes.map((u) => (
              <li key={u}><strong>{u}</strong>: {(adjList[u] || []).join(', ') || '—'}</li>
            ))}
          </ul>
        </div></div>
      </section>

      <section className="section">
        <h2>Time Complexity</h2>
        <table className="table"><thead><tr><th>Operation</th><th>Time</th></tr></thead><tbody>
          {data.operations.map(op => (
            <tr key={op.name}><td><div style={{ fontWeight: 600 }}>{op.name}</div><div className="muted" style={{ fontSize: 13 }}>{op.description}</div></td><td><span className="badge">{op.complexity}</span></td></tr>
          ))}
        </tbody></table>
      </section>

      <section className="section">
        <h2>Key Points</h2>
        <ul className="space-y" style={{ paddingLeft: 18 }}>
          <li>Can be directed or undirected; weighted or unweighted.</li>
          <li>Adjacency lists are space-efficient for sparse graphs.</li>
          <li>BFS finds shortest paths in unweighted graphs.</li>
        </ul>
      </section>

      <section className="section">
        <h2>Your Notes</h2>
        <div className="space-y">
          <div className="form" style={{ justifyContent: 'stretch' }}>
            <textarea className="input" style={{ minHeight: 90, width: '100%' }} value={noteInput} onChange={(e) => setNoteInput(e.target.value)} placeholder="Add a note..." />
          </div>
          <div className="actions" style={{ justifyContent: 'flex-end' }}>
            <button className="btn btn-primary" onClick={() => { const t = noteInput.trim(); if (!t) return; setNotes([t, ...notes]); setNoteInput(''); }}>Add Note</button>
          </div>
          {notes.length > 0 && (
            <div className="card"><div className="card-body"><ul className="space-y" style={{ paddingLeft: 18, margin: 0 }}>
              {notes.map((n, i) => (
                <li key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <span>{n}</span>
                  <button className="btn" onClick={() => setNotes(notes.filter((_, idx) => idx !== i))}>Delete</button>
                </li>
              ))}
            </ul></div></div>
          )}
        </div>
      </section>
    </div>
  );
}

function buildAdjacency(nodes: NodeId[], edges: Edge[]): Record<NodeId, NodeId[]> {
  const adj: Record<NodeId, NodeId[]> = {};
  for (const u of nodes) adj[u] = [];
  for (const e of edges) adj[e.from].push(e.to);
  return adj;
}
