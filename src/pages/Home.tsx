import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { DataStructure } from '../types';

const dataStructures: DataStructure[] = [
  {
    id: 'array',
    name: 'Array',
    description: 'A collection of elements identified by index or key.',
    operations: [
      { name: 'Access', description: 'Access an element by index', complexity: 'O(1)' },
      { name: 'Search', description: 'Find an element by value', complexity: 'O(n)' },
      { name: 'Insertion', description: 'Add an element at a position', complexity: 'O(n)' },
      { name: 'Deletion', description: 'Remove an element', complexity: 'O(n)' },
    ]
  },
  {
    id: 'linkedlist',
    name: 'Linked List',
    description: 'Nodes connected by pointers forming a sequence.',
    operations: [
      { name: 'Access', description: 'Traverse nodes to access', complexity: 'O(n)' },
      { name: 'Search', description: 'Find a node by value', complexity: 'O(n)' },
      { name: 'Insertion', description: 'Insert at head', complexity: 'O(1)' },
      { name: 'Deletion', description: 'Delete by relinking', complexity: 'O(1) to O(n)' },
    ]
  },
  {
    id: 'hashmap',
    name: 'Hash Map',
    description: 'Key-value store using hashing for near-constant time operations.',
    operations: [
      { name: 'Search', description: 'Lookup by key', complexity: 'O(1) avg, O(n) worst' },
      { name: 'Insertion', description: 'Insert key-value', complexity: 'O(1) avg, O(n) worst' },
      { name: 'Deletion', description: 'Remove by key', complexity: 'O(1) avg, O(n) worst' },
    ]
  },
  {
    id: 'heap',
    name: 'Heap',
    description: 'Tree-based structure maintaining heap property (min or max).',
    operations: [
      { name: 'Search', description: 'Find arbitrary value', complexity: 'O(n)' },
      { name: 'Insertion', description: 'Insert and bubble', complexity: 'O(log n)' },
      { name: 'Deletion', description: 'Extract root and heapify', complexity: 'O(log n)' },
    ]
  },
  {
    id: 'btree',
    name: 'Binary Tree',
    description: 'Nodes with up to two children in a hierarchy.',
    operations: [
      { name: 'Search', description: 'Traverse to find value', complexity: 'O(n)' },
      { name: 'Insertion', description: 'Insert as leaf (BST demo)', complexity: 'O(h)' },
      { name: 'Deletion', description: 'Remove node (simplified)', complexity: 'O(h)' },
    ]
  },
  {
    id: 'avl',
    name: 'AVL Tree',
    description: 'Self-balancing BST keeping height ~ log n.',
    operations: [
      { name: 'Search', description: 'BST search', complexity: 'O(log n)' },
      { name: 'Insertion', description: 'Insert with rebalancing', complexity: 'O(log n)' },
      { name: 'Deletion', description: 'Delete with rebalancing', complexity: 'O(log n)' },
    ]
  },
  {
    id: 'graphs',
    name: 'Graphs',
    description: 'Vertices connected by edges.',
    operations: [
      { name: 'Search', description: 'BFS/DFS traversal', complexity: 'O(V+E)' },
      { name: 'Insertion', description: 'Add vertex/edge', complexity: 'O(1)' },
      { name: 'Deletion', description: 'Remove vertex/edge', complexity: 'O(deg) to O(V+E)' },
    ]
  },
];

export default function Home() {
  return (
    <div>
      <section className="hero">
        <div className="container">
          <h1>
            <span>Data Structures </span>
            <span className="accent">Visualization</span>
          </h1>
          <p>Learn data structures through interactive visualizations</p>
        </div>
      </section>

      <div className="container">
        <div className="grid">
          {dataStructures.map((ds) => (
            <motion.div key={ds.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="card">
              <Link to={`/${ds.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card-body">
                  <h3>{ds.name}</h3>
                  <p>{ds.description}</p>
                  <div className="space-y" style={{ marginTop: 12 }}>
                    {ds.operations.slice(0, 3).map((op) => (
                      <div key={op.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                        <span style={{ fontWeight: 600 }}>{op.name}</span>
                        <span className="badge">{op.complexity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
