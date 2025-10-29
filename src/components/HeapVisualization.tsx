import { useEffect, useState } from 'react';
import type { DataStructure } from '../types';

export default function HeapVisualization({ data }: { data: DataStructure }) {
  const [heap, setHeap] = useState<number[]>([5, 9, 12]); // min-heap
  const [val, setVal] = useState('');
  const [message, setMessage] = useState('');
  const [notes, setNotes] = useState<string[]>([]);
  const [noteInput, setNoteInput] = useState('');

  useEffect(() => { const k = `${data.id}-notes`; const raw = localStorage.getItem(k); if (raw) setNotes(JSON.parse(raw)); }, [data.id]);
  useEffect(() => { const k = `${data.id}-notes`; localStorage.setItem(k, JSON.stringify(notes)); }, [data.id, notes]);

  const flash = (m: string) => { setMessage(m); setTimeout(() => setMessage(''), 1600); };

  const insert = () => {
    const x = parseInt(val, 10); if (Number.isNaN(x)) return flash('Enter a number');
    const h = [...heap, x]; bubbleUp(h, h.length - 1); setHeap(h); setVal(''); flash('Inserted');
  };
  const extractMin = () => {
    if (heap.length === 0) return; const h = [...heap]; const root = h[0]; const last = h.pop()!; if (h.length) { h[0] = last; heapify(h, 0); }
    setHeap(h); flash(`Deleted root ${root}`);
  };

  function bubbleUp(h: number[], i: number) {
    while (i > 0) { const p = Math.floor((i - 1) / 2); if (h[p] <= h[i]) break; [h[p], h[i]] = [h[i], h[p]]; i = p; }
  }
  function heapify(h: number[], i: number) {
    while (true) { const l = 2*i+1, r = 2*i+2; let s = i; if (l < h.length && h[l] < h[s]) s = l; if (r < h.length && h[r] < h[s]) s = r; if (s === i) break; [h[i], h[s]] = [h[s], h[i]]; i = s; }
  }

  return (
    <div className="space-y">
      <div className="center"><h2 style={{ fontSize: 28, margin: 0 }}>{data.name}</h2><p className="muted" style={{ marginTop: 6 }}>{data.description}</p></div>

      <div className="form">
        <input className="input" placeholder="Value" value={val} onChange={(e) => setVal(e.target.value)} />
        <button className="btn btn-primary" onClick={insert}>Insert</button>
        <button className="btn btn-danger" onClick={extractMin}>Delete Root</button>
      </div>
      {message && <div className="center" style={{ color: 'var(--pink-700)', fontWeight: 600 }}>{message}</div>}

      <section className="section">
        <h2>Heap Array</h2>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          {heap.map((n, i) => (
            <div key={i} className="node-box">{n}</div>
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
          <li>Efficient for priority queues.</li>
          <li>Stored as array; children at 2i+1 and 2i+2.</li>
          <li>Root is min (min-heap) or max (max-heap).</li>
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
