import React, { useEffect, useState } from 'react';

interface GameCountdownProps {
  onCountdownComplete: () => void;
}

export const GameCountdown: React.FC<GameCountdownProps> = ({ onCountdownComplete }) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onCountdownComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onCountdownComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="text-8xl font-bold text-white mb-4 animate-pulse">
          {count}
        </div>
        <div className="text-2xl text-gray-300">
          곧 질문이 나옵니다...
        </div>
      </div>
    </div>
  );
};