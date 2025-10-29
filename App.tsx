
import React from 'react';
import { SearchBar } from './components/SearchBar';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-vscode-bg text-vscode-text font-sans antialiased">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('https://picsum.photos/seed/opale-ai/1920/1080')`, filter: 'blur(8px) brightness(0.5)' }}
      ></div>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Opale AI</h1>
            <p className="text-lg text-vscode-text-secondary">Your Universal AI Assistant</p>
        </header>
        <SearchBar />
        <footer className="absolute bottom-4 text-center text-vscode-text-secondary text-sm">
            <p>This is a simulation of the Opale AI Search Bar experience.</p>
            <p>Powered by Gemini API</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
