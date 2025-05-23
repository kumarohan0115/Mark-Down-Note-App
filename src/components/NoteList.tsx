import React from 'react';
import { Trash2 } from 'lucide-react';
import { useNotes } from '../contexts/NotesContext';
import SyncIndicator from './SyncIndicator';

const NoteList: React.FC = () => {
  const { state, dispatch, deleteNote } = useNotes();

  const filteredNotes = state.notes.filter(note => {
    const query = state.searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
    );
  });

  const sortedNotes = [...filteredNotes].sort((a, b) => b.updatedAt - a.updatedAt);

  const handleNoteClick = (id: string) => {
    dispatch({ type: 'SELECT_NOTE', payload: id });
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteNote(id);
    }
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  const getContentPreview = (content: string): string => {
    return content.length > 60 ? content.substring(0, 60) + '...' : content;
  };

  return (
    <div className="h-full overflow-hidden flex flex-col border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">
          Notes ({sortedNotes.length})
        </h2>
      </div>

      <div className="overflow-y-auto flex-grow">
        {sortedNotes.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {state.searchQuery ? 'No notes match your search' : 'No notes yet. Create your first note!'}
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {sortedNotes.map(note => (
              <li
                key={note.id}
                onClick={() => handleNoteClick(note.id)}
                className={`
                  p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150
                  ${state.selectedNoteId === note.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''}
                `}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {note.title || 'Untitled Note'}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                      {getContentPreview(note.content) || 'No content'}
                    </p>
                    <div className="mt-2 flex items-center text-xs text-gray-400">
                      <span>{formatDate(note.updatedAt)}</span>
                      <span className="mx-2">•</span>
                      <SyncIndicator status={note.syncStatus} />
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDeleteClick(e, note.id)}
                    className="ml-2 text-gray-400 hover:text-red-500 transition-colors duration-150"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NoteList;