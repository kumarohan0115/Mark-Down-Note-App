export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  syncStatus: SyncStatus;
}

export type SyncStatus = 'synced' | 'unsynced' | 'syncing' | 'error';

export interface NotesState {
  notes: Note[];
  selectedNoteId: string | null;
  isOnline: boolean;
  searchQuery: string;
}

export type NotesAction =
  | { type: 'SET_NOTES'; payload: Note[] }
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: Note }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'SELECT_NOTE'; payload: string | null }
  | { type: 'SET_ONLINE_STATUS'; payload: boolean }
  | { type: 'SET_SYNC_STATUS'; payload: { id: string; status: SyncStatus } }
  | { type: 'SET_SEARCH_QUERY'; payload: string };