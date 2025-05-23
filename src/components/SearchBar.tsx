import React from 'react';
import { Search, X } from 'lucide-react';
import { useNotes } from '../contexts/NotesContext';

const SearchBar: React.FC = () => {
  const { state, dispatch } = useNotes();
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value });
  };
  
  const clearSearch = () => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: '' });
  };
  
  return (
    <div className="relative max-w-md w-full mx-auto mb-4">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
        placeholder="Search notes..."
        value={state.searchQuery}
        onChange={handleSearchChange}
      />
      {state.searchQuery && (
        <button
          type="button"
          onClick={clearSearch}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <X className="h-4 w-4 text-gray-400 hover:text-gray-500" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;