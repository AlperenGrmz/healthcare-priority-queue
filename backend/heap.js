class MinHeap {
    constructor() {
      this.heap = [];
    }
  
    // Heap'e yeni eleman ekle
    insert(patient) {
      this.heap.push(patient);  // Yeni elemanı heap'e ekle
      this.heapifyUp();  // Heap'in doğru yapıyı koruması için yukarıya doğru düzenle
    }
  
    // Yukarıya doğru heap yapısını koru
    heapifyUp() {
      let index = this.heap.length - 1;
      // Heap'in doğru yapısını korumak için yukarıya doğru iterasyon yap
      while (index > 0) {
        const parentIndex = Math.floor((index - 1) / 2);
        // Eğer parent daha küçük ya da eşitse, dur
        if (this.heap[parentIndex].priority <= this.heap[index].priority) break;
        // Aksi takdirde, elemanları takas et
        [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
        index = parentIndex;  // Parent index'e ilerle
      }
    }
  
    // Min-heap'ten en küçük elemanı çıkar
    extractMin() {
      if (this.heap.length === 0) return null;  // Eğer heap boşsa, null döndür
      if (this.heap.length === 1) return this.heap.pop();  // Eğer sadece bir eleman varsa, onu çıkar ve döndür
  
      const root = this.heap[0];  // Root elemanını sakla
      this.heap[0] = this.heap.pop();  // Son elemanı root yerine koy
      this.heapifyDown(0);  // Heap'in doğru yapıyı koruması için aşağıya doğru düzenle
      return root;  // Root elemanını döndür
    }
  
    // Aşağıya doğru heap yapısını koru
    heapifyDown(index) {
      let left = this.leftChild(index);
      let right = this.rightChild(index);
      let smallest = index;
  
      // Sol çocuğun daha küçük olup olmadığını kontrol et
      if (left < this.heap.length && this.heap[left].priority < this.heap[smallest].priority) {
        smallest = left;
      }
  
      // Sağ çocuğun daha küçük olup olmadığını kontrol et
      if (right < this.heap.length && this.heap[right].priority < this.heap[smallest].priority) {
        smallest = right;
      }
  
      // Eğer küçük çocuk bulunduysa, takas yap
      if (smallest !== index) {
        [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
        this.heapifyDown(smallest);  // Rekürsif olarak devam et
      }
    }
  
    // Sol çocuğun indeksini al
    leftChild(index) {
      return 2 * index + 1;
    }
  
    // Sağ çocuğun indeksini al
    rightChild(index) {
      return 2 * index + 2;
    }
  
    // Tüm elemanları döndür
    getAll() {
      return this.heap;
    }
  }
  
  module.exports = MinHeap;
  