import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import ArrayVisualization from './components/ArrayVisualization';
import LinkedListVisualization from './components/LinkedListVisualization';
import HashMapVisualization from './components/HashMapVisualization';
import HeapVisualization from './components/HeapVisualization';
import BinaryTreeVisualization from './components/BinaryTreeVisualization';
import AVLTreeVisualization from './components/AVLTreeVisualization';
import GraphVisualization from './components/GraphVisualization';
import type { DataStructure } from './types';

const dataStructures: Record<string, DataStructure> = {
  array: {
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
  linkedlist: {
    id: 'linkedlist',
    name: 'Linked List',
    description: 'A linear collection of nodes where each node points to the next.',
    operations: [
      { name: 'Access', description: 'Access by traversing nodes', complexity: 'O(n)' },
      { name: 'Search', description: 'Find a node by value', complexity: 'O(n)' },
      { name: 'Insertion', description: 'Insert at head in constant time', complexity: 'O(1)' },
      { name: 'Deletion', description: 'Delete a node by adjusting links', complexity: 'O(1) to O(n)' },
    ]
  },
  hashmap: {
    id: 'hashmap',
    name: 'Hash Map',
    description: 'Key-value store using hashing for near-constant time operations.',
    operations: [
      { name: 'Search', description: 'Lookup by key', complexity: 'O(1) avg, O(n) worst' },
      { name: 'Insertion', description: 'Insert key-value', complexity: 'O(1) avg, O(n) worst' },
      { name: 'Deletion', description: 'Remove by key', complexity: 'O(1) avg, O(n) worst' },
    ]
  },
  heap: {
    id: 'heap',
    name: 'Heap',
    description: 'Tree-based structure maintaining heap property (min or max).',
    operations: [
      { name: 'Search', description: 'Find arbitrary value (no order)', complexity: 'O(n)' },
      { name: 'Insertion', description: 'Insert and bubble', complexity: 'O(log n)' },
      { name: 'Deletion', description: 'Extract root and heapify', complexity: 'O(log n)' },
    ]
  },
  btree: {
    id: 'btree',
    name: 'Binary Tree',
    description: 'Hierarchical structure with nodes having up to two children.',
    operations: [
      { name: 'Search', description: 'Traverse to find value', complexity: 'O(n)' },
      { name: 'Insertion', description: 'Insert as leaf (demo as BST)', complexity: 'O(h)' },
      { name: 'Deletion', description: 'Remove node (demo simplified)', complexity: 'O(h)' },
    ]
  },
  avl: {
    id: 'avl',
    name: 'AVL Tree',
    description: 'Self-balancing BST keeping heights within 1.',
    operations: [
      { name: 'Search', description: 'BST search', complexity: 'O(log n)' },
      { name: 'Insertion', description: 'Insert with rebalancing', complexity: 'O(log n)' },
      { name: 'Deletion', description: 'Delete with rebalancing', complexity: 'O(log n)' },
    ]
  },
  graphs: {
    id: 'graphs',
    name: 'Graphs',
    description: 'Vertices connected by edges, directed or undirected.',
    operations: [
      { name: 'Search', description: 'BFS/DFS traversal', complexity: 'O(V+E)' },
      { name: 'Insertion', description: 'Add vertex/edge', complexity: 'O(1)' },
      { name: 'Deletion', description: 'Remove vertex/edge', complexity: 'O(deg) to O(V+E)' },
    ]
  },
};

function App() {
  return (
    <div className="app-shell">
      <header className="header">
        <div className="container">
          <div className="brand"><Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>DS Visualizer</Link></div>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/array" element={<ArrayVisualization data={dataStructures.array} />} />
            <Route path="/linkedlist" element={<LinkedListVisualization data={dataStructures.linkedlist} />} />
            <Route path="/hashmap" element={<HashMapVisualization data={dataStructures.hashmap} />} />
            <Route path="/heap" element={<HeapVisualization data={dataStructures.heap} />} />
            <Route path="/btree" element={<BinaryTreeVisualization data={dataStructures.btree} />} />
            <Route path="/avl" element={<AVLTreeVisualization data={dataStructures.avl} />} />
            <Route path="/graphs" element={<GraphVisualization data={dataStructures.graphs} />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
