import React from 'react';
import { PlusCircle, Wifi, WifiOff } from 'lucide-react';
import { useNotes } from '../contexts/NotesContext';

const Header: React.FC = () => {
  const { state, createNote } = useNotes();
  
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-xl font-semibold text-gray-900 flex items-center">
            <span className="bg-blue-500 text-white p-1 rounded mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <line x1="2" y1="10" x2="22" y2="10"></line>
              </svg>
            </span>
            Notes
          </h1>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              {state.isOnline ? (
                <span className="flex items-center text-green-600 text-sm">
                  <Wifi size={16} className="mr-1" />
                  Online
                </span>
              ) : (
                <span className="flex items-center text-orange-500 text-sm">
                  <WifiOff size={16} className="mr-1" />
                  Offline
                </span>
              )}
            </div>
            
            <button
              onClick={createNote}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <PlusCircle size={16} className="mr-1" />
              New Note
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;