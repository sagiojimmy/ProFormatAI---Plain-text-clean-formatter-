import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Download, Printer, Check, FileText } from 'lucide-react';
import { Button } from './Button';

interface PreviewAreaProps {
  content: string;
  isPlaceholder?: boolean;
}

export const PreviewArea: React.FC<PreviewAreaProps> = ({ content, isPlaceholder = false }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (type: 'md' | 'html' | 'txt' | 'pdf' | 'doc') => {
    let blob: Blob;
    let filename = `proformat-export-${Date.now()}`;
    const element = document.getElementById('markdown-preview-content');
    
    // PDF Download
    if (type === 'pdf') {
      if (!element) return;
      
      const opt = {
        margin:       [0.5, 0.5],
        filename:     `${filename}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      // @ts-ignore
      if (window.html2pdf) {
        // @ts-ignore
        window.html2pdf().set(opt).from(element).save();
      } else {
        alert("PDF generator is initializing. Please try again in a moment.");
      }
      return;
    }

    // Prepare content for text-based downloads
    if (type === 'md') {
      blob = new Blob([content], { type: 'text/markdown' });
      filename += '.md';
    } else if (type === 'html' || type === 'doc') {
      // Basic HTML wrapper for downloading
      // For DOC, we use specific XML namespaces to help Word interpret it better
      const isDoc = type === 'doc';
      const preHtml = isDoc 
        ? `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>`
        : `<!DOCTYPE html><html>`;
        
      // Ensure the exported HTML forces a light theme for professional documents
      const htmlContent = `
        ${preHtml}
        <head>
          <meta charset="utf-8">
          <title>Formatted Document</title>
          <style>
            body { font-family: 'Inter', sans-serif; line-height: 1.6; max-width: 800px; margin: 2rem auto; padding: 0 1rem; color: #111827; background: #ffffff; }
            h1, h2, h3, h4, h5, h6 { color: #111827; font-weight: 700; margin-top: 1.5em; margin-bottom: 0.5em; }
            p { margin-bottom: 1em; }
            ul, ol { margin-bottom: 1em; padding-left: 1.5em; }
            li { margin-bottom: 0.25em; }
            strong { font-weight: 600; }
            blockquote { border-left: 4px solid #e5e7eb; padding-left: 1em; color: #4b5563; font-style: italic; }
            /* Force text color for export, ignoring current theme */
            .content { color: #111827 !important; }
            .content * { color: #111827; }
          </style>
        </head>
        <body>
          <div class="content">${element?.innerHTML || content}</div>
        </body>
        </html>
      `;
      
      blob = new Blob(['\ufeff', htmlContent], { 
        type: isDoc ? 'application/msword' : 'text/html' 
      });
      filename += isDoc ? '.doc' : '.html';
    } else {
      blob = new Blob([content], { type: 'text/plain' });
      filename += '.txt';
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  if (isPlaceholder) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 p-8 bg-gray-50/50 dark:bg-gray-900/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <FileText className="w-16 h-16 mb-4 opacity-50" />
        <p className="text-lg font-medium">Formatted text will appear here</p>
        <p className="text-sm">Enter your text on the left and click Format</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden relative transition-colors duration-200">
      {/* Action Header - Hidden during print */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 no-print">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wide">Preview</h3>
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            onClick={handleCopy} 
            title="Copy to Clipboard"
            className="!p-2 text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={handlePrint}
            title="Print"
            className="!p-2 text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400"
          >
            <Printer className="w-4 h-4" />
          </Button>

          <div className="relative group">
            <Button 
              variant="ghost" 
              title="Download Options"
              className="!p-2 text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400"
            >
              <Download className="w-4 h-4" />
            </Button>
            {/* Dropdown for download options */}
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-xl border border-gray-100 dark:border-gray-700 py-1 hidden group-hover:block z-20">
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Documents</div>
              <button onClick={() => handleDownload('pdf')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-brand-600 dark:hover:text-brand-400">PDF Document (.pdf)</button>
              <button onClick={() => handleDownload('doc')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-brand-600 dark:hover:text-brand-400">Word Document (.doc)</button>
              <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Source</div>
              <button onClick={() => handleDownload('md')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-brand-600 dark:hover:text-brand-400">Markdown (.md)</button>
              <button onClick={() => handleDownload('html')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-brand-600 dark:hover:text-brand-400">HTML (.html)</button>
              <button onClick={() => handleDownload('txt')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-brand-600 dark:hover:text-brand-400">Plain Text (.txt)</button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white dark:bg-gray-800 transition-colors duration-200" id="print-area">
        {/* Added dark:prose-invert to automatically handle dark mode text contrast */}
        <div id="markdown-preview-content" className="prose prose-sm sm:prose lg:prose-lg max-w-none dark:prose-invert text-gray-800 dark:text-gray-100 prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-brand-600 dark:prose-a:text-brand-400 prose-img:rounded-xl">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};