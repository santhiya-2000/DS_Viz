import { useEffect, useMemo, useState } from 'react';
import type { DataStructure } from '../types';

// For this demo, we reuse BST behavior to focus on operations and learning UI.
interface Node { v: number; left: Node | null; right: Node | null }
const insert = (r: Node | null, v: number): Node => {
  if (!r) return { v, left: null, right: null };
  if (v < r.v) r.left = insert(r.left, v); else r.right = insert(r.right, v);
  return r; // (Rotations omitted for brevity in this visualization)
};
const search = (r: Node | null, v: number): boolean => {
  while (r) { if (v === r.v) return true; r = v < r.v ? r.left : r.right; }
  return false;
};
const remove = (r: Node | null, v: number): Node | null => {
  if (!r) return r;
  if (v < r.v) r.left = remove(r.left, v);
  else if (v > r.v) r.right = remove(r.right, v);
  else {
    if (!r.left) return r.right;
    if (!r.right) return r.left;
    let p = r, m = r.right; while (m!.left) { p = m!; m = m!.left; }
    r.v = m!.v; if (p.left === m) p.left = m!.right; else p.right = m!.right;
  }
  return r; // (Rebalancing omitted)
};

function toLevels(r: Node | null): (number | null)[][] {
  const levels: (number | null)[][] = [];
  if (!r) return levels;
  const q: (Node | null)[] = [r];
  while (q.length) {
    const size = q.length; const lvl: (number | null)[] = []; let hasChild = false;
    for (let i = 0; i < size; i++) {
      const n = q.shift()!;
      if (n) { lvl.push(n.v); q.push(n.left); q.push(n.right); if (n.left || n.right) hasChild = true; }
      else { lvl.push(null); q.push(null); q.push(null); }
    }
    levels.push(lvl);
    if (!hasChild) break;
  }
  return levels;
}

export default function AVLTreeVisualization({ data }: { data: DataStructure }) {
  const [root, setRoot] = useState<Node | null>(null);
  const [val, setVal] = useState('');
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');
  const [notes, setNotes] = useState<string[]>([]);
  const [noteInput, setNoteInput] = useState('');

  useEffect(() => { const k = `${data.id}-notes`; const raw = localStorage.getItem(k); if (raw) setNotes(JSON.parse(raw)); }, [data.id]);
  useEffect(() => { const k = `${data.id}-notes`; localStorage.setItem(k, JSON.stringify(notes)); }, [data.id, notes]);

  const flash = (m: string) => { setMessage(m); setTimeout(() => setMessage(''), 1600); };

  const onInsert = () => { const x = parseInt(val, 10); if (Number.isNaN(x)) return flash('Enter a number'); setRoot(prev => insert(prev, x)); setVal(''); flash('Inserted'); };
  const onDelete = () => { const x = parseInt(val, 10); if (Number.isNaN(x)) return flash('Enter a number'); setRoot(prev => remove(prev, x)); setVal(''); flash('Deleted (if existed)'); };
  const onSearch = () => { const x = parseInt(query, 10); if (Number.isNaN(x)) return flash('Enter a number'); flash(search(root, x) ? 'Found' : 'Not found'); };

  const levels = useMemo(() => toLevels(root), [root]);

  return (
    <div className="space-y">
      <div className="center"><h2 style={{ fontSize: 28, margin: 0 }}>{data.name}</h2><p className="muted" style={{ marginTop: 6 }}>{data.description}</p></div>

      <div className="form">
        <input className="input" placeholder="Value" value={val} onChange={(e) => setVal(e.target.value)} />
        <button className="btn btn-primary" onClick={onInsert}>Insert</button>
        <button className="btn btn-danger" onClick={onDelete}>Delete</button>
        <input className="input" placeholder="Search value" value={query} onChange={(e) => setQuery(e.target.value)} />
        <button className="btn btn-info" onClick={onSearch}>Search</button>
      </div>
      {message && <div className="center" style={{ color: 'var(--pink-700)', fontWeight: 600 }}>{message}</div>}

      <section className="section">
        <h2>Tree (Conceptual)</h2>
        <div className="space-y">
          {levels.length === 0 && <div className="center muted">(empty)</div>}
          {levels.map((lvl, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
              {lvl.map((n, j) => (
                <div key={j} className="node-box">{n === null ? '·' : n}</div>
              ))}
            </div>
          ))}
        </div>
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
          <li>Self-balancing BST: keeps height O(log n).</li>
          <li>Rotations restore balance after insert/delete (not visualized here).</li>
          <li>Guarantees O(log n) search/insertion/deletion.</li>
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
