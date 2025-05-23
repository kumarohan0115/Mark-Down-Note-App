import { Note, SyncStatus } from '../types';

const DB_NAME = 'notes-app';
const DB_VERSION = 1;
const NOTES_STORE = 'notes';

export const initDb = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject('Error opening database');
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(NOTES_STORE)) {
        const store = db.createObjectStore(NOTES_STORE, { keyPath: 'id' });
        store.createIndex('updatedAt', 'updatedAt', { unique: false });
      }
    };
  });
};

const getDb = async (): Promise<IDBDatabase> => {
  return await initDb();
};

export const getAllNotes = async (): Promise<Note[]> => {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(NOTES_STORE, 'readonly');
    const store = transaction.objectStore(NOTES_STORE);
    const request = store.index('updatedAt').openCursor(null, 'prev');
    const notes: Note[] = [];

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor) {
        notes.push(cursor.value);
        cursor.continue();
      } else {
        resolve(notes);
      }
    };

    request.onerror = () => {
      reject('Error fetching notes');
    };
  });
};

export const addNote = async (note: Note): Promise<Note> => {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(NOTES_STORE, 'readwrite');
    const store = transaction.objectStore(NOTES_STORE);
    const request = store.add(note);

    request.onsuccess = () => {
      resolve(note);
    };

    request.onerror = () => {
      reject('Error adding note');
    };
  });
};

export const updateNote = async (note: Note): Promise<Note> => {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(NOTES_STORE, 'readwrite');
    const store = transaction.objectStore(NOTES_STORE);
    const request = store.put(note);

    request.onsuccess = () => {
      resolve(note);
    };

    request.onerror = () => {
      reject('Error updating note');
    };
  });
};

export const deleteNote = async (id: string): Promise<string> => {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(NOTES_STORE, 'readwrite');
    const store = transaction.objectStore(NOTES_STORE);
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve(id);
    };

    request.onerror = () => {
      reject('Error deleting note');
    };
  });
};

export const updateNoteSyncStatus = async (id: string, status: SyncStatus): Promise<void> => {
  const db = await getDb();
  const transaction = db.transaction(NOTES_STORE, 'readwrite');
  const store = transaction.objectStore(NOTES_STORE);
  
  const getRequest = store.get(id);
  
  getRequest.onsuccess = () => {
    const note = getRequest.result;
    if (note) {
      note.syncStatus = status;
      store.put(note);
    }
  };
};