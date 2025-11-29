import React, { useState, useEffect } from 'react';
import { Tone, FormattingOptions } from './types';
import { formatTextWithAI } from './services/geminiService';
import { Toolbar } from './components/Toolbar';
import { PreviewArea } from './components/PreviewArea';
import { AlertCircle, Eraser } from 'lucide-react';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [formattedText, setFormattedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [options, setOptions] = useState<FormattingOptions>({
    tone: Tone.PROFESSIONAL,
    fixGrammar: true,
    includeSummary: false,
  });

  const [activeTab, setActiveTab] = useState<'input' | 'preview'>('input');
  
  // Responsive tab switching effect
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // Reset specific mobile tab state if moving to desktop to show both
        // We handle split view via CSS hidden classes
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFormat = async () => {
    if (!inputText.trim()) return;

    setIsProcessing(true);
    setError(null);
    setFormattedText(''); // Clear previous result while loading
    
    // Switch tab on mobile automatically to show loading state
    if (window.innerWidth < 768) {
      setActiveTab('preview');
    }

    try {
      const result = await formatTextWithAI(inputText, options);
      setFormattedText(result);
    } catch (err) {
      setError("Something went wrong with the AI service. Please check your connection or API limit.");
      // Switch back to input if error on mobile
      if (window.innerWidth < 768) {
        setActiveTab('input');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear all text?")) {
      setInputText('');
      setFormattedText('');
      setError(null);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between no-print">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">ProFormat AI</h1>
            <p className="text-xs text-gray-500 font-medium">Professional Text Enhancer</p>
          </div>
        </div>
        <div className="hidden sm:block text-sm text-gray-400">
          Powered by Gemini 2.5
        </div>
      </header>

      {/* Toolbar */}
      <Toolbar 
        options={options} 
        onOptionsChange={setOptions} 
        onFormat={handleFormat}
        isProcessing={isProcessing}
        hasInput={inputText.length > 0}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        <div className="h-full max-w-7xl mx-auto flex flex-col md:flex-row p-4 gap-4">
          
          {/* Mobile Tabs */}
          <div className="md:hidden flex border-b border-gray-200 mb-2 no-print">
            <button
              className={`flex-1 py-2 text-sm font-medium ${activeTab === 'input' ? 'text-brand-600 border-b-2 border-brand-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('input')}
            >
              Input
            </button>
            <button
              className={`flex-1 py-2 text-sm font-medium ${activeTab === 'preview' ? 'text-brand-600 border-b-2 border-brand-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('preview')}
            >
              Preview
            </button>
          </div>

          {/* Input Area */}
          <div className={`flex-1 flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden no-print ${activeTab === 'preview' ? 'hidden md:flex' : 'flex'}`}>
            <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-100">
              <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Input Text</h3>
              <button 
                onClick={handleClear}
                className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded hover:bg-red-50"
                title="Clear Text"
              >
                <Eraser className="w-4 h-4" />
              </button>
            </div>
            <textarea
              className="flex-1 w-full p-4 resize-none focus:outline-none focus:ring-inset focus:ring-2 focus:ring-brand-100 text-gray-800 leading-relaxed"
              placeholder="Paste your plain text here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              spellCheck={false}
            />
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-400 text-right">
              {inputText.length} characters
            </div>
          </div>

          {/* Preview Area */}
          <div className={`flex-1 flex flex-col h-full overflow-hidden print-only ${activeTab === 'input' ? 'hidden md:flex' : 'flex'}`}>
            {error ? (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-red-50 rounded-lg border border-red-200">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-lg font-medium text-red-800 mb-2">Error Processing Request</h3>
                <p className="text-red-600 max-w-xs">{error}</p>
                <button 
                  onClick={handleFormat}
                  className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : isProcessing ? (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="relative w-16 h-16 mb-6">
                   <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-100 rounded-full"></div>
                   <div className="absolute top-0 left-0 w-full h-full border-4 border-brand-500 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Polishing your content...</h3>
                <p className="text-gray-500 mt-2">Applying {options.tone.toLowerCase()} tone and structure.</p>
              </div>
            ) : (
              <PreviewArea content={formattedText} isPlaceholder={!formattedText} />
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;