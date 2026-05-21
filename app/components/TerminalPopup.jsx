import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const TerminalPopup = ({ isOpen, onClose, email }) => {
  const [lines, setLines] = useState([]);
  const [showCursor, setShowCursor] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const terminalSequence = [
    { text: `$ algobuddy subscribe ${email}`, type: 'command' },
    { text: '', type: 'break' },
    { text: '[1/4] Validating email...', type: 'process' },
    { text: '✓ Email verified', type: 'success' },
    { text: '[2/4] Enabling weekly updates...', type: 'process' },
    { text: '✓ Weekly updates enabled', type: 'success' },
    { text: '[3/4] Finalizing subscription...', type: 'process' },
    { text: '✓ Successfully subscribed!', type: 'success' },
    { text: '✓ Welcome to AlgoBuddy Blogs 🚀', type: 'success' },
  ];

  useEffect(() => {
    if (!isOpen) {
      setLines([]);
      setShowCursor(false);
      setIsComplete(false);
      return;
    }

    let currentIndex = 0;
    let typingTimeout;
    let cursorInterval;

    const displayNextLine = () => {
      if (currentIndex < terminalSequence.length) {
        const line = terminalSequence[currentIndex];
        setLines(prev => [...prev, line]);
        currentIndex++;
        
        // Vary delay based on line type for cinematic effect
        const delay = line.type === 'break' ? 100 : line.type === 'process' ? 600 : 400;
        typingTimeout = setTimeout(displayNextLine, delay);
      } else {
        setIsComplete(true);
        setShowCursor(true);
        cursorInterval = setInterval(() => {
          setShowCursor(prev => !prev);
        }, 500);
      }
    };

    // Start with a small delay
    const initialDelay = setTimeout(displayNextLine, 300);

    return () => {
      clearTimeout(initialDelay);
      clearTimeout(typingTimeout);
      clearInterval(cursorInterval);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <style jsx>{`
        @keyframes greenGlow {
          0%, 100% { text-shadow: 0 0 10px rgba(34, 197, 94, 0.5), 0 0 20px rgba(34, 197, 94, 0.3); }
          50% { text-shadow: 0 0 15px rgba(34, 197, 94, 0.7), 0 0 25px rgba(34, 197, 94, 0.5); }
        }
        .terminal-text {
          animation: greenGlow 2s ease-in-out infinite;
        }
      `}</style>
      
      <div className="w-full max-w-2xl animate-in fade-in zoom-in-95 duration-300">
        {/* Terminal Window */}
        <div className="bg-black text-white rounded-lg overflow-hidden shadow-2xl border border-green-700/30">
          {/* Terminal Header */}
          <div className="bg-gray-900 px-4 py-3 flex justify-between items-center border-b border-green-700/20">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <p className="text-sm text-green-400 font-mono">~ algobuddy-cli</p>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Terminal Content */}
          <div className="bg-black p-6 font-mono text-sm min-h-64 max-h-96 overflow-auto">
            <div className="space-y-0.5 leading-relaxed">
              {lines.map((line, idx) => (
                <div 
                  key={idx}
                  className={`${
                    line.type === 'command' 
                      ? 'text-white' 
                      : line.type === 'success' 
                      ? 'text-green-400 terminal-text' 
                      : line.type === 'process'
                      ? 'text-yellow-400'
                      : ''
                  }`}
                >
                  {line.text}
                </div>
              ))}
              {isComplete && (
                <div className="text-green-400">
                  ${' '}
                  <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}>
                    ▋
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Terminal Footer */}
          <div className="bg-gray-900 px-6 py-3 border-t border-green-700/20 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition font-medium text-sm"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalPopup;
