import React from 'react';
import { Tone, FormattingOptions } from '../types';
import { Settings, Sparkles, CheckSquare } from 'lucide-react';

interface ToolbarProps {
  options: FormattingOptions;
  onOptionsChange: (newOptions: FormattingOptions) => void;
  onFormat: () => void;
  isProcessing: boolean;
  hasInput: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({ 
  options, 
  onOptionsChange, 
  onFormat, 
  isProcessing,
  hasInput
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm z-10 sticky top-0 no-print">
      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
        
        {/* Tone Selector */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-600 flex items-center">
            <Settings className="w-4 h-4 mr-1" />
            Tone:
          </label>
          <select 
            value={options.tone}
            onChange={(e) => onOptionsChange({ ...options, tone: e.target.value as Tone })}
            className="block w-40 pl-3 pr-10 py-1.5 text-sm border-gray-300 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-md border bg-gray-50"
          >
            {Object.values(Tone).map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>

        {/* Checkboxes */}
        <div className="flex items-center gap-4">
          <label className="inline-flex items-center text-sm text-gray-700 cursor-pointer">
            <input 
              type="checkbox" 
              checked={options.fixGrammar}
              onChange={(e) => onOptionsChange({ ...options, fixGrammar: e.target.checked })}
              className="rounded text-brand-600 focus:ring-brand-500 h-4 w-4 border-gray-300" 
            />
            <span className="ml-2">Fix Grammar</span>
          </label>

          <label className="inline-flex items-center text-sm text-gray-700 cursor-pointer">
            <input 
              type="checkbox" 
              checked={options.includeSummary}
              onChange={(e) => onOptionsChange({ ...options, includeSummary: e.target.checked })}
              className="rounded text-brand-600 focus:ring-brand-500 h-4 w-4 border-gray-300" 
            />
            <span className="ml-2">Add Summary</span>
          </label>
        </div>
      </div>

      <button
        onClick={onFormat}
        disabled={isProcessing || !hasInput}
        className={`w-full sm:w-auto flex items-center justify-center px-6 py-2 rounded-lg font-semibold text-white shadow-md transition-all ${
          isProcessing || !hasInput 
            ? 'bg-gray-400 cursor-not-allowed opacity-75' 
            : 'bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 active:scale-95'
        }`}
      >
        {isProcessing ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Formatting...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 mr-2" />
            Format Text
          </>
        )}
      </button>
    </div>
  );
};