import { useEffect, useMemo, useState } from 'react';
import type { DataStructure } from '../types';

interface KV { key: string; value: string }

export default function HashMapVisualization({ data }: { data: DataStructure }) {
  const [entries, setEntries] = useState<KV[]>([{ key: 'a', value: '1' }, { key: 'b', value: '2' }]);
  const [k, setK] = useState('');
  const [v, setV] = useState('');
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');
  const [notes, setNotes] = useState<string[]>([]);
  const [noteInput, setNoteInput] = useState('');

  // simple hash buckets for visualization only
  const buckets = useMemo(() => {
    const size = 6;
    const arr: KV[][] = Array.from({ length: size }, () => []);
    entries.forEach(e => {
      const idx = Math.abs(hash(e.key)) % size;
      arr[idx].push(e);
    });
    return arr;
  }, [entries]);

  useEffect(() => {
    const key = `${data.id}-notes`;
    try { const raw = localStorage.getItem(key); if (raw) setNotes(JSON.parse(raw)); } catch {}
  }, [data.id]);
  useEffect(() => {
    const key = `${data.id}-notes`;
    try { localStorage.setItem(key, JSON.stringify(notes)); } catch {}
  }, [data.id, notes]);

  function hash(s: string) {
    let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return h;
  }

  const insert = () => {
    if (!k) return flash('Enter key');
    const idx = entries.findIndex(e => e.key === k);
    let next = [...entries];
    if (idx >= 0) next[idx] = { key: k, value: v };
    else next.push({ key: k, value: v });
    setEntries(next); setK(''); setV(''); flash('Inserted/Updated');
  };
  const del = () => {
    if (!k) return flash('Enter key');
    const next = entries.filter(e => e.key !== k);
    setEntries(next); setK(''); flash('Deleted if existed');
  };
  const search = () => {
    if (!query) return flash('Enter key');
    const idx = entries.findIndex(e => e.key === query);
    flash(idx === -1 ? 'Not found' : `Found: ${entries[idx].value}`);
  };
  const flash = (m: string) => { setMessage(m); setTimeout(() => setMessage(''), 1600); };

  return (
    <div className="space-y">
      <div className="center">
        <h2 style={{ fontSize: 28, margin: 0 }}>{data.name}</h2>
        <p className="muted" style={{ marginTop: 6 }}>{data.description}</p>
      </div>

      <div className="form">
        <input className="input" placeholder="Key" value={k} onChange={(e) => setK(e.target.value)} />
        <input className="input" placeholder="Value" value={v} onChange={(e) => setV(e.target.value)} />
        <button className="btn btn-primary" onClick={insert}>Insert/Update</button>
        <button className="btn btn-danger" onClick={del}>Delete</button>
        <input className="input" placeholder="Search key" value={query} onChange={(e) => setQuery(e.target.value)} />
        <button className="btn btn-info" onClick={search}>Search</button>
      </div>

      {message && <div className="center" style={{ color: 'var(--pink-700)', fontWeight: 600 }}>{message}</div>}

      <section className="section">
        <h2>Buckets</h2>
        <div className="space-y">
          {buckets.map((b, i) => (
            <div key={i} className="card">
              <div className="card-body">
                <div style={{ fontWeight: 700, marginBottom: 6 }}>Bucket {i}</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {b.length === 0 ? <span className="muted">(empty)</span> : b.map((e, j) => (
                    <div key={j} className="node-box">{e.key}:{e.value}</div>
                  ))}
                </div>
              </div>
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
          <li>Handles collisions via separate chaining (demo).</li>
          <li>Good hash functions minimize collisions.</li>
          <li>Load factor impacts performance.</li>
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
