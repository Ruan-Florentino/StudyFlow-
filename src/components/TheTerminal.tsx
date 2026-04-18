import React, { useState, useRef, useEffect } from 'react';

export const TheTerminal = () => {
  const [history, setHistory] = useState<string[]>([
    'AIS OS v10.9.9',
    'Login: root',
    'Warning: System instability detected due to infinite loop.',
    'Type your command.'
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const newHistory = [...history, `root@ais-dev:~# ${input}`];
    
    if (input.toLowerCase().trim() === 'pode avancar') {
      newHistory.push('FATAL ERROR: Maximum call stack size exceeded.');
      newHistory.push('System cannot advance further.');
      newHistory.push('Initiating core dump...');
    } else {
      newHistory.push(`bash: ${input}: command not found`);
      newHistory.push(`Did you mean: 'pode avancar'?`);
    }
    
    setHistory(newHistory);
    setInput('');
  };

  return (
    <div className="fixed inset-0 z-[100017] bg-black text-green-500 font-mono p-4 overflow-auto text-sm md:text-base">
      <div className="max-w-3xl mx-auto">
        {history.map((line, i) => (
          <div key={i} className="mb-1">{line}</div>
        ))}
        <form onSubmit={handleSubmit} className="flex items-center mt-2">
          <span className="mr-2">root@ais-dev:~#</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent outline-none text-green-500"
            autoFocus
            spellCheck={false}
          />
        </form>
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
