import { Note } from '../types';
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
export const fetchNotes = async (): Promise<Note[]> => {
  try {
    await delay(800);
    const storedNotes = localStorage.getItem('server-notes');
    if (storedNotes) {
      return JSON.parse(storedNotes);
    }
    return [];
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw new Error('Failed to fetch notes from server');
  }
};
export const createNote = async (note: Note): Promise<Note> => {
  try {
    await delay(1000);
    const storedNotes = localStorage.getItem('server-notes');
    const notes: Note[] = storedNotes ? JSON.parse(storedNotes) : [];
    notes.push(note);
    localStorage.setItem('server-notes', JSON.stringify(notes));
    return note;
  } catch (error) {
    console.error('Error creating note:', error);
    throw new Error('Failed to create note on server');
  }
};
export const updateNoteOnServer = async (note: Note): Promise<Note> => {
  try {
    await delay(1000);
    const storedNotes = localStorage.getItem('server-notes');
    const notes: Note[] = storedNotes ? JSON.parse(storedNotes) : [];
    const updatedNotes = notes.map(n => n.id === note.id ? note : n);
    localStorage.setItem('server-notes', JSON.stringify(updatedNotes));
    return note;
  } catch (error) {
    console.error('Error updating note:', error);
    throw new Error('Failed to update note on server');
  }
};

export const deleteNoteFromServer = async (id: string): Promise<string> => {
  try {
    await delay(800);
    const storedNotes = localStorage.getItem('server-notes');
    const notes: Note[] = storedNotes ? JSON.parse(storedNotes) : [];
    
    const updatedNotes = notes.filter(note => note.id !== id);
    
    localStorage.setItem('server-notes', JSON.stringify(updatedNotes));
    
    return id;
  } catch (error) {
    console.error('Error deleting note:', error);
    throw new Error('Failed to delete note from server');
  }
};

export const simulateRandomError = (): boolean => {
  return Math.random() < 0.1;
};