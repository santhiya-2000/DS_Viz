import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DataStructure } from '../types';

interface NodeItem { value: number }

export default function LinkedListVisualization({ data }: { data: DataStructure }) {
  const [list, setList] = useState<NodeItem[]>([{ value: 3 }, { value: 7 }, { value: 1 }]);
  const [message, setMessage] = useState('');

  const [insertVal, setInsertVal] = useState('');
  const [deleteVal, setDeleteVal] = useState('');
  const [searchVal, setSearchVal] = useState('');
  const [notes, setNotes] = useState<string[]>([]);
  const [noteInput, setNoteInput] = useState('');

  // Load notes from localStorage
  useEffect(() => {
    const key = `${data.id}-notes`;
    try {
      const raw = localStorage.getItem(key);
      if (raw) setNotes(JSON.parse(raw));
    } catch {}
  }, [data.id]);

  // Save notes on change
  useEffect(() => {
    const key = `${data.id}-notes`;
    try {
      localStorage.setItem(key, JSON.stringify(notes));
    } catch {}
  }, [data.id, notes]);

  const flash = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 1800);
  };

  const insertHead = () => {
    const v = parseInt(insertVal, 10);
    if (Number.isNaN(v)) return flash('Enter a valid number to insert');
    setList([{ value: v }, ...list]);
    setInsertVal('');
    flash(`Inserted ${v} at head`);
  };

  const deleteByValue = () => {
    const v = parseInt(deleteVal, 10);
    if (Number.isNaN(v)) return flash('Enter a valid number to delete');
    const idx = list.findIndex(n => n.value === v);
    if (idx === -1) return flash(`${v} not found`);
    setList(list.filter((_, i) => i !== idx));
    setDeleteVal('');
    flash(`Deleted ${v} from position ${idx}`);
  };

  const searchByValue = () => {
    const v = parseInt(searchVal, 10);
    if (Number.isNaN(v)) return flash('Enter a valid number to search');
    const idx = list.findIndex(n => n.value === v);
    flash(idx === -1 ? `${v} not found` : `Found ${v} at position ${idx}`);
  };

  return (
    <div className="space-y">
      <div className="center">
        <h2 style={{ fontSize: 28, margin: 0 }}>{data.name}</h2>
        <p className="muted" style={{ marginTop: 6 }}>{data.description}</p>
      </div>

      <div className="viz-row" style={{ alignItems: 'center', minHeight: 120 }}>
        <AnimatePresence>
          {list.map((node, i) => (
            <motion.div
              key={`${i}-${node.value}`}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              className="node"
            >
              <div className="node-box">{node.value}</div>
              {i < list.length - 1 && <div className="arrow">→</div>}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {message && (
        <div className="center" style={{ color: 'var(--pink-700)', fontWeight: 600 }}>{message}</div>
      )}

      <div className="form">
        <input className="input" value={insertVal} onChange={(e) => setInsertVal(e.target.value)} placeholder="Insert value (head)" />
        <button className="btn btn-primary" onClick={insertHead}>Insert</button>

        <input className="input" value={deleteVal} onChange={(e) => setDeleteVal(e.target.value)} placeholder="Delete by value" />
        <button className="btn btn-danger" onClick={deleteByValue}>Delete</button>

        <input className="input" value={searchVal} onChange={(e) => setSearchVal(e.target.value)} placeholder="Search value" />
        <button className="btn btn-info" onClick={searchByValue}>Search</button>
      </div>

      <section className="section">
        <h2>Time Complexity</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Operation</th>
              <th>Time Complexity</th>
            </tr>
          </thead>
          <tbody>
            {data.operations.map((op) => (
              <tr key={op.name}>
                <td>
                  <div style={{ fontWeight: 600 }}>{op.name}</div>
                  <div className="muted" style={{ fontSize: 13 }}>{op.description}</div>
                </td>
                <td><span className="badge">{op.complexity}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="section">
        <h2>Key Points</h2>
        <ul className="space-y" style={{ paddingLeft: 18 }}>
          <li>Dynamic size with node-based allocation.</li>
          <li>Efficient insertions/deletions at head.</li>
          <li>Poor random access; must traverse nodes.</li>
        </ul>
      </section>

      <section className="section">
        <h2>Your Notes</h2>
        <div className="space-y">
          <div className="form" style={{ justifyContent: 'stretch' }}>
            <textarea
              className="input"
              style={{ minHeight: 90, width: '100%' }}
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="Add a note..."
            />
          </div>
          <div className="actions" style={{ justifyContent: 'flex-end' }}>
            <button
              className="btn btn-primary"
              onClick={() => {
                const t = noteInput.trim();
                if (!t) return;
                setNotes((prev) => [t, ...prev]);
                setNoteInput('');
              }}
            >
              Add Note
            </button>
          </div>

          {notes.length > 0 && (
            <div className="card">
              <div className="card-body">
                <ul className="space-y" style={{ paddingLeft: 18, margin: 0 }}>
                  {notes.map((n, i) => (
                    <li key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                      <span>{n}</span>
                      <button
                        className="btn"
                        onClick={() => setNotes((prev) => prev.filter((_, idx) => idx !== i))}
                        aria-label={`Delete note ${i + 1}`}
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
