import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DataStructure } from '../types';

export default function ArrayVisualization({ data }: { data: DataStructure }) {
  const [array, setArray] = useState<number[]>([1, 4, 2, 8, 5]);
  const [operation, setOperation] = useState<string>('');
  const [insertValue, setInsertValue] = useState<string>('');
  const [deleteIndex, setDeleteIndex] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');
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

  const handleInsert = () => {
    const val = parseInt(insertValue, 10);
    if (Number.isNaN(val)) {
      setOperation('Enter a valid number to insert');
      return;
    }
    const newArray = [...array, val];
    setArray(newArray);
    setOperation(`Inserted ${val} at the end`);
    setInsertValue('');
    setTimeout(() => setOperation(''), 1800);
  };

  const handleDelete = () => {
    if (array.length === 0) return;
    if (deleteIndex.trim() === '') {
      const deletedValue = array[array.length - 1];
      const newArray = array.slice(0, -1);
      setArray(newArray);
      setOperation(`Deleted ${deletedValue} from the end`);
      setTimeout(() => setOperation(''), 1800);
      return;
    }
    const idx = parseInt(deleteIndex, 10);
    if (Number.isNaN(idx) || idx < 0 || idx >= array.length) {
      setOperation('Enter a valid index to delete');
      return;
    }
    const deletedValue = array[idx];
    const newArray = array.filter((_, i) => i !== idx);
    setArray(newArray);
    setOperation(`Deleted ${deletedValue} at index ${idx}`);
    setDeleteIndex('');
    setTimeout(() => setOperation(''), 1800);
  };

  const handleSearch = () => {
    if (array.length === 0) return;
    const val = parseInt(searchValue, 10);
    if (Number.isNaN(val)) {
      setOperation('Enter a valid number to search');
      return;
    }
    setOperation(`Searching for ${val}...`);
    setTimeout(() => {
      const index = array.indexOf(val);
      setOperation(index >= 0 ? `Found ${val} at index ${index}` : `${val} not found`);
      setTimeout(() => setOperation(''), 1800);
    }, 600);
  };

  return (
    <div className="space-y">
      <div className="center">
        <h2 style={{ fontSize: 28, margin: 0 }}>{data.name}</h2>
        <p className="muted" style={{ marginTop: 6 }}>{data.description}</p>
      </div>

      <div className="viz-row">
        <AnimatePresence>
          {array.map((value, index) => (
            <motion.div
              key={`${index}-${value}`}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bar"
              style={{ height: `${Math.max(value * 8, 28)}px` }}
            >
              <span style={{ marginBottom: 8 }}>{value}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {operation && (
        <div className="center" style={{ color: 'var(--pink-700)', fontWeight: 600 }}>{operation}</div>
      )}

      <div className="form">
        <input className="input" value={insertValue} onChange={(e) => setInsertValue(e.target.value)} placeholder="Value to insert" />
        <button className="btn btn-primary" onClick={handleInsert}>Insert</button>

        <input className="input" value={deleteIndex} onChange={(e) => setDeleteIndex(e.target.value)} placeholder="Index to delete (optional)" />
        <button className="btn btn-danger" onClick={handleDelete}>Delete</button>

        <input className="input" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder="Value to search" />
        <button className="btn btn-info" onClick={handleSearch}>Search</button>
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
          <li>Indexed access in constant time.</li>
          <li>Insertions/deletions in middle require shifting elements.</li>
          <li>Contiguous block of memory.</li>
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
