import React, { createContext, useReducer, useEffect, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Note, NotesState, NotesAction } from '../types';
import * as db from '../services/db';
import * as api from '../services/api';

const initialState: NotesState = {
  notes: [],
  selectedNoteId: null,
  isOnline: navigator.onLine,
  searchQuery: '',
};

const NotesContext = createContext<{
  state: NotesState;
  dispatch: React.Dispatch<NotesAction>;
  createNote: () => void;
  updateNoteContent: (id: string, title: string, content: string) => void;
  deleteNote: (id: string) => void;
  syncNotes: () => Promise<void>;
}>({
  state: initialState,
  dispatch: () => null,
  createNote: () => {},
  updateNoteContent: () => {},
  deleteNote: () => {},
  syncNotes: async () => {},
});

const notesReducer = (state: NotesState, action: NotesAction): NotesState => {
  switch (action.type) {
    case 'SET_NOTES':
      return { ...state, notes: action.payload };
    case 'ADD_NOTE':
      return { ...state, notes: [action.payload, ...state.notes] };
    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map(note =>
          note.id === action.payload.id ? action.payload : note
        ),
      };
    case 'DELETE_NOTE':
      return {
        ...state,
        notes: state.notes.filter(note => note.id !== action.payload),
        selectedNoteId: state.selectedNoteId === action.payload ? null : state.selectedNoteId,
      };
    case 'SELECT_NOTE':
      return { ...state, selectedNoteId: action.payload };
    case 'SET_ONLINE_STATUS':
      return { ...state, isOnline: action.payload };
    case 'SET_SYNC_STATUS':
      return {
        ...state,
        notes: state.notes.map(note =>
          note.id === action.payload.id
            ? { ...note, syncStatus: action.payload.status }
            : note
        ),
      };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    default:
      return state;
  }
};

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notesReducer, initialState);

  useEffect(() => {
    const initializeDb = async () => {
      try {
        await db.initDb();
        const notes = await db.getAllNotes();
        dispatch({ type: 'SET_NOTES', payload: notes });
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };

    initializeDb();
  }, []);

  useEffect(() => {
    let isSyncing = false;

    const checkOnlineAndSync = async () => {
      if (navigator.onLine && !isSyncing) {
        try {
          isSyncing = true;
          dispatch({ type: 'SET_ONLINE_STATUS', payload: true });
          await syncNotes();
        } catch (error) {
          console.error('Error during sync:', error);
        } finally {
          isSyncing = false;
        }
      } else if (!navigator.onLine) {
        dispatch({ type: 'SET_ONLINE_STATUS', payload: false });
      }
    };

    checkOnlineAndSync();

    const pollInterval = setInterval(checkOnlineAndSync, 5000);

    const handleOnline = () => checkOnlineAndSync();
    const handleOffline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: false });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const createNote = async () => {
    const timestamp = Date.now();
    const newNote: Note = {
      id: uuidv4(),
      title: 'Untitled Note',
      content: '',
      createdAt: timestamp,
      updatedAt: timestamp,
      syncStatus: 'unsynced',
    };

    try {
      await db.addNote(newNote);
      dispatch({ type: 'ADD_NOTE', payload: newNote });
      dispatch({ type: 'SELECT_NOTE', payload: newNote.id });

      if (state.isOnline) {
        syncNote(newNote);
      }
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const updateNoteContent = async (id: string, title: string, content: string) => {
    try {
      const noteToUpdate = state.notes.find(note => note.id === id);
      
      if (!noteToUpdate) return;
      
      const updatedNote: Note = {
        ...noteToUpdate,
        title,
        content,
        updatedAt: Date.now(),
        syncStatus: 'unsynced',
      };

      await db.updateNote(updatedNote);
      dispatch({ type: 'UPDATE_NOTE', payload: updatedNote });

      if (state.isOnline) {
        syncNote(updatedNote);
      }
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await db.deleteNote(id);
      dispatch({ type: 'DELETE_NOTE', payload: id });

      if (state.isOnline) {
        try {
          dispatch({ type: 'SET_SYNC_STATUS', payload: { id, status: 'syncing' } });
          await api.deleteNoteFromServer(id);
        } catch (error) {
          console.error('Error syncing deletion:', error);
        }
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const syncNote = async (note: Note) => {
    if (!state.isOnline) return;

    try {
      dispatch({ type: 'SET_SYNC_STATUS', payload: { id: note.id, status: 'syncing' } });
      
      if (api.simulateRandomError()) {
        throw new Error('Simulated sync error');
      }
      const existingNotes = await api.fetchNotes();
      const exists = existingNotes.some(n => n.id === note.id);
      let syncedNote: Note;
      if (exists) {
        syncedNote = await api.updateNoteOnServer(note);
      } else {
        syncedNote = await api.createNote(note);
      }
      syncedNote.syncStatus = 'synced';
      await db.updateNote(syncedNote);
      dispatch({ type: 'UPDATE_NOTE', payload: syncedNote });
    } catch (error) {
      console.error('Error syncing note:', error);
      dispatch({ type: 'SET_SYNC_STATUS', payload: { id: note.id, status: 'error' } });
      await db.updateNoteSyncStatus(note.id, 'error');
    }
  };
  const syncNotes = async () => {
    if (!state.isOnline) return;
    
    const unsyncedNotes = state.notes.filter(
      note => note.syncStatus === 'unsynced' || note.syncStatus === 'error'
    );
    
    for (const note of unsyncedNotes) {
      await syncNote(note);
    }
  };

  return (
    <NotesContext.Provider
      value={{
        state,
        dispatch,
        createNote,
        updateNoteContent,
        deleteNote,
        syncNotes,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => useContext(NotesContext);