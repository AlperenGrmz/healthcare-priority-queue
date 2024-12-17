const MinHeap = require('./heap');

const heap = new MinHeap();

// Örnek veriler
heap.insert({ name: 'Patient A', priority: 5 });
heap.insert({ name: 'Patient B', priority: 3 });
heap.insert({ name: 'Patient C', priority: 8 });
heap.insert({ name: 'Patient D', priority: 1 });
heap.insert({ name: 'Patient E', priority: 2 });
heap.insert({ name: 'Patient E', priority: 10 });

console.log('Heap:', heap.getAll());

// Min eleman çıkarma
console.log('Extracted Min:', heap.extractMin());
console.log('Heap after extraction:', heap.getAll());