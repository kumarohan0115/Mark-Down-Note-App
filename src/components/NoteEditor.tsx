import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNotes } from '../contexts/NotesContext';
import { Edit, Eye } from 'lucide-react';

const NoteEditor: React.FC = () => {
  const { state, updateNoteContent } = useNotes();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const debounceTimerRef = useRef<number | null>(null);
  
  const selectedNote = state.notes.find(note => note.id === state.selectedNoteId);
  
  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title);
      setContent(selectedNote.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [selectedNote]);
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = window.setTimeout(() => {
      if (selectedNote) {
        updateNoteContent(selectedNote.id, newTitle, content);
      }
    }, 500);
  };
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = window.setTimeout(() => {
      if (selectedNote) {
        updateNoteContent(selectedNote.id, title, newContent);
      }
    }, 500);
  };
  
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);
  
  if (!selectedNote) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-md">
          <h3 className="text-lg font-medium text-gray-900">No note selected</h3>
          <p className="mt-1 text-sm text-gray-500">
            Select a note from the list or create a new one.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b border-gray-200 px-4 py-3 sm:px-6 flex justify-between items-center">
        <input
          type="text"
          placeholder="Note title"
          value={title}
          onChange={handleTitleChange}
          className="flex-1 border-none text-xl font-medium text-gray-900 focus:outline-none focus:ring-0 placeholder-gray-400"
        />
        
        <div className="flex space-x-2">
          <button
            onClick={() => setIsPreview(false)}
            className={`px-3 py-1 rounded-md text-sm ${
              !isPreview 
                ? 'bg-blue-100 text-blue-800' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Edit size={16} className="inline mr-1" />
            Edit
          </button>
          <button
            onClick={() => setIsPreview(true)}
            className={`px-3 py-1 rounded-md text-sm ${
              isPreview 
                ? 'bg-blue-100 text-blue-800' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Eye size={16} className="inline mr-1" />
            Preview
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        {isPreview ? (
          <div className="prose max-w-none">
            {content ? (
              <ReactMarkdown>{content}</ReactMarkdown>
            ) : (
              <p className="text-gray-400 italic">No content to preview</p>
            )}
          </div>
        ) : (
          <textarea
            placeholder="Write your note here... (Markdown supported)"
            value={content}
            onChange={handleContentChange}
            className="w-full h-full p-2 border-none resize-none focus:outline-none focus:ring-0 placeholder-gray-400 font-mono text-sm"
          />
        )}
      </div>
    </div>
  );
};

export default NoteEditor;