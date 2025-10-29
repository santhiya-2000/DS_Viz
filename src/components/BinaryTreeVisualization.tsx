import { useEffect, useMemo, useState } from 'react';
import type { DataStructure } from '../types';

interface TreeNode { v: number; left: TreeNode | null; right: TreeNode | null }

function insertBST(root: TreeNode | null, v: number): TreeNode {
  if (!root) return { v, left: null, right: null };
  if (v < root.v) root.left = insertBST(root.left, v); else root.right = insertBST(root.right, v);
  return root;
}
function searchBST(root: TreeNode | null, v: number): boolean {
  while (root) { if (v === root.v) return true; root = v < root.v ? root.left : root.right; }
  return false;
}
function deleteBST(root: TreeNode | null, v: number): TreeNode | null {
  if (!root) return root;
  if (v < root.v) root.left = deleteBST(root.left, v);
  else if (v > root.v) root.right = deleteBST(root.right, v);
  else {
    if (!root.left) return root.right;
    if (!root.right) return root.left;
    let minParent = root, min = root.right;
    while (min!.left) { minParent = min!; min = min!.left; }
    root.v = min!.v;
    if (minParent.left === min) minParent.left = min!.right; else minParent.right = min!.right;
  }
  return root;
}

function toLevels(root: TreeNode | null): (number | null)[][] {
  const res: (number | null)[][] = [];
  if (!root) return res;
  const q: (TreeNode | null)[] = [root];
  while (q.length) {
    const n = q.length; const level: (number | null)[] = []; let hasNonNull = false;
    for (let i = 0; i < n; i++) {
      const node = q.shift()!;
      if (node) {
        level.push(node.v); q.push(node.left); q.push(node.right); if (node.left || node.right) hasNonNull = true;
      } else { level.push(null); q.push(null); q.push(null); }
    }
    res.push(level);
    if (!hasNonNull) break;
  }
  return res;
}

export default function BinaryTreeVisualization({ data }: { data: DataStructure }) {
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [val, setVal] = useState('');
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');
  const [notes, setNotes] = useState<string[]>([]);
  const [noteInput, setNoteInput] = useState('');

  useEffect(() => { const k = `${data.id}-notes`; const raw = localStorage.getItem(k); if (raw) setNotes(JSON.parse(raw)); }, [data.id]);
  useEffect(() => { const k = `${data.id}-notes`; localStorage.setItem(k, JSON.stringify(notes)); }, [data.id, notes]);

  const flash = (m: string) => { setMessage(m); setTimeout(() => setMessage(''), 1600); };

  const onInsert = () => { const x = parseInt(val, 10); if (Number.isNaN(x)) return flash('Enter a number'); setRoot(prev => insertBST(prev, x)); setVal(''); flash('Inserted'); };
  const onDelete = () => { const x = parseInt(val, 10); if (Number.isNaN(x)) return flash('Enter a number'); setRoot(prev => deleteBST(prev, x)); setVal(''); flash('Deleted (if existed)'); };
  const onSearch = () => { const x = parseInt(query, 10); if (Number.isNaN(x)) return flash('Enter a number'); flash(searchBST(root, x) ? 'Found' : 'Not found'); };

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
        <h2>Tree</h2>
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
          <li>Nodes have at most two children.</li>
          <li>Depth impacts search/insertion time.</li>
          <li>BST property (if used): left &lt; root &lt; right.</li>
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
