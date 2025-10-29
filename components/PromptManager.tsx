
import React, { useState, useRef, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Prompt } from '../types';
import { PlusIcon, EditIcon, TrashIcon, CheckIcon, XMarkIcon } from './icons';

interface PromptManagerProps {
  onSelectPrompt: (content: string) => void;
  onClose: () => void;
}

export const PromptManager: React.FC<PromptManagerProps> = ({ onSelectPrompt, onClose }) => {
  const [prompts, setPrompts] = useLocalStorage<Prompt[]>('opale-ai-prompts', [
    { id: '1', name: 'Summarize', content: 'Summarize the following text:\n\n"{selection}"' },
    { id: '2', name: 'Translate to French', content: 'Translate the following text to French:\n\n"{selection}"' },
    { id: '3', name: 'Rewrite Professionally', content: 'Rewrite the following text in a more professional tone:\n\n"{selection}"' },
  ]);
  const [newPromptName, setNewPromptName] = useState('');
  const [newPromptContent, setNewPromptContent] = useState('');
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const addPromptNameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if(addPromptNameInputRef.current) {
      addPromptNameInputRef.current.focus();
    }
  }, []);

  const handleAddPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPromptName.trim() && newPromptContent.trim()) {
      const newPrompt: Prompt = {
        id: new Date().toISOString(),
        name: newPromptName.trim(),
        content: newPromptContent.trim(),
      };
      setPrompts([...prompts, newPrompt]);
      setNewPromptName('');
      setNewPromptContent('');
      if (addPromptNameInputRef.current) {
        addPromptNameInputRef.current.focus();
      }
    }
  };

  const handleUpdatePrompt = () => {
    if (editingPrompt) {
      setPrompts(prompts.map(p => p.id === editingPrompt.id ? editingPrompt : p));
      setEditingPrompt(null);
    }
  };

  const handleDeletePrompt = (id: string) => {
    setPrompts(prompts.filter(p => p.id !== id));
  };
  
  const handleSelect = (content: string) => {
    onSelectPrompt(content);
    onClose();
  };

  return (
    <div className="flex flex-col h-full bg-vscode-bg-light">
      <h2 className="text-lg font-semibold p-4 border-b border-vscode-border text-white">Manage Prompts</h2>
      <div className="flex-grow overflow-y-auto p-2">
        {prompts.map(prompt => (
          <div key={prompt.id} className="group p-2 rounded-md hover:bg-vscode-accent/20 flex items-center justify-between">
            {editingPrompt?.id === prompt.id ? (
              <div className="flex-grow mr-2">
                <input
                  type="text"
                  value={editingPrompt.name}
                  onChange={e => setEditingPrompt({ ...editingPrompt, name: e.target.value })}
                  className="w-full bg-vscode-input-bg text-vscode-text p-1 rounded-md mb-1 text-sm"
                />
                <textarea
                  value={editingPrompt.content}
                  onChange={e => setEditingPrompt({ ...editingPrompt, content: e.target.value })}
                  className="w-full bg-vscode-input-bg text-vscode-text p-1 rounded-md text-xs h-20 resize-none"
                />
              </div>
            ) : (
              <button onClick={() => handleSelect(prompt.content)} className="text-left flex-grow">
                <p className="text-vscode-text font-medium">{prompt.name}</p>
                <p className="text-vscode-text-secondary text-xs truncate">{prompt.content}</p>
              </button>
            )}
            <div className="flex items-center space-x-2 ml-2">
              {editingPrompt?.id === prompt.id ? (
                <>
                  <button onClick={handleUpdatePrompt} className="text-green-400 hover:text-green-300"><CheckIcon className="h-5 w-5"/></button>
                  <button onClick={() => setEditingPrompt(null)} className="text-red-400 hover:text-red-300"><XMarkIcon className="h-5 w-5"/></button>
                </>
              ) : (
                <>
                   <button onClick={() => setEditingPrompt(prompt)} className="text-vscode-text-secondary opacity-0 group-hover:opacity-100 hover:text-white transition-opacity"><EditIcon className="h-4 w-4"/></button>
                  <button onClick={() => handleDeletePrompt(prompt.id)} className="text-vscode-text-secondary opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity"><TrashIcon className="h-4 w-4"/></button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleAddPrompt} className="p-4 border-t border-vscode-border">
        <h3 className="text-md font-semibold mb-2 text-white">Add New Prompt</h3>
        <input
          ref={addPromptNameInputRef}
          type="text"
          value={newPromptName}
          onChange={e => setNewPromptName(e.target.value)}
          placeholder="Prompt Name (e.g., 'Explain Like I'm 5')"
          className="w-full bg-vscode-input-bg text-vscode-text p-2 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-vscode-accent"
        />
        <textarea
          value={newPromptContent}
          onChange={e => setNewPromptContent(e.target.value)}
          placeholder='Prompt Content (use "{selection}" for context)'
          className="w-full bg-vscode-input-bg text-vscode-text p-2 rounded-md mb-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-vscode-accent"
        />
        <button type="submit" className="w-full flex items-center justify-center bg-vscode-accent hover:bg-vscode-accent-hover text-white font-semibold py-2 px-4 rounded-md transition-colors">
          <PlusIcon className="h-5 w-5 mr-2" /> Add Prompt
        </button>
      </form>
    </div>
  );
};
