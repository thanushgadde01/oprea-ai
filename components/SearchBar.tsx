
import React, { useState, useRef, useEffect } from 'react';
import { PromptManager } from './PromptManager';
import { runPrompt } from '../services/geminiService';
import { SendIcon, SparklesIcon, LoadingSpinner } from './icons';

export const SearchBar: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [isPromptManagerVisible, setIsPromptManagerVisible] = useState(false);
  const [error, setError] = useState('');
  
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      const scrollHeight = textAreaRef.current.scrollHeight;
      textAreaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [inputValue]);
  
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    setIsLoading(true);
    setAiResponse('');
    setError('');

    try {
      // Simple check for placeholder. A real app might use a more complex system.
      const finalPrompt = inputValue.replace(/{selection}/g, "the provided context");
      const response = await runPrompt(finalPrompt);
      setAiResponse(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPrompt = (content: string) => {
    setInputValue(content);
    setIsPromptManagerVisible(false);
    textAreaRef.current?.focus();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-vscode-bg-light shadow-2xl rounded-lg border border-vscode-border transition-all duration-300 ease-in-out">
        {isPromptManagerVisible ? (
          <div className="h-[60vh] max-h-[700px]">
            <PromptManager 
              onSelectPrompt={handleSelectPrompt}
              onClose={() => setIsPromptManagerVisible(false)}
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-2">
            <div className="relative flex items-start">
                <button
                    type="button"
                    onClick={() => setIsPromptManagerVisible(true)}
                    className="p-2 text-vscode-text-secondary hover:text-white transition-colors"
                    aria-label="Manage Prompts"
                >
                    <SparklesIcon className="h-6 w-6" />
                </button>
                <textarea
                    ref={textAreaRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit();
                        }
                    }}
                    placeholder="Ask Opale AI..."
                    className="flex-1 bg-transparent text-vscode-text placeholder-vscode-text-secondary resize-none border-none focus:ring-0 p-2 text-base outline-none max-h-48 overflow-y-auto"
                    rows={1}
                />
                <button
                    type="submit"
                    disabled={isLoading || !inputValue.trim()}
                    className="p-2 text-vscode-text-secondary hover:text-vscode-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Send"
                >
                  {isLoading ? <LoadingSpinner /> : <SendIcon className="h-6 w-6" />}
                </button>
            </div>
          </form>
        )}
      </div>

      {(aiResponse || error) && !isPromptManagerVisible && (
        <div className="mt-4 p-4 bg-vscode-bg-light rounded-lg border border-vscode-border prose prose-invert max-w-none prose-p:text-vscode-text prose-headings:text-white">
          {error ? (
            <p className="text-red-400">{error}</p>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: aiResponse.replace(/\n/g, '<br />') }} />
          )}
        </div>
      )}
    </div>
  );
};
