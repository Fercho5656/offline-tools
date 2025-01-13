export async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('OfflineTools', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = event.oldVersion === 0 ? request.result : (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains('files')) {
        db.createObjectStore('files');
      }
    };
  })
}

export async function storeFile(db: IDBDatabase, fileId: string, file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('files', 'readwrite');
    const store = transaction.objectStore('files')
    const request = store.put(file, fileId);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  })
}

export async function getFile(db: IDBDatabase, fileId: string): Promise<Blob | null> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('files', 'readonly');
    const store = transaction.objectStore('files');
    const request = store.get(fileId);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  })
}