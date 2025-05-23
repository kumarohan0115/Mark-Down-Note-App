import React from 'react';
import Header from './Header';
import SearchBar from './SearchBar';
import NoteList from './NoteList';
import NoteEditor from './NoteEditor';

const Layout: React.FC = () => {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="p-4">
        <SearchBar />
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        <div className="w-full md:w-72 lg:w-80 flex-shrink-0 overflow-hidden">
          <NoteList />
        </div>
        
        <div className="hidden md:block flex-1 overflow-hidden">
          <NoteEditor />
        </div>
      </div>
    </div>
  );
};

export default Layout;