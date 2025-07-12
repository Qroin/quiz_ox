import React, { useEffect, useState } from 'react';
import { Circle, X, Timer, User } from 'lucide-react';
import { Question, Participant } from '../types';

interface GameQuestionProps {
  question: Question;
  currentParticipant: Participant;
  participantIndex: number;
  totalActiveParticipants: number;
  currentRound: number;
  onAnswer: (answer: boolean) => void;
  onTimeUp: () => void;
}

export const GameQuestion: React.FC<GameQuestionProps> = ({ 
  question, 
  currentParticipant,
  participantIndex,
  totalActiveParticipants, 
  currentRound,
  onAnswer, 
  onTimeUp 
}) => {
  const [timeLeft, setTimeLeft] = useState(5);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);

  useEffect(() => {
    setTimeLeft(5);
    setSelectedAnswer(null);
  }, [question, currentParticipant]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeUp, question, currentParticipant]);

  const handleAnswer = (answer: boolean) => {
    if (selectedAnswer === null) {
      setSelectedAnswer(answer);
      onAnswer(answer);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl max-w-4xl w-full border border-white/20">
        {/* 게임 정보 */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <span className="text-white font-semibold">라운드 {currentRound}</span>
            </div>
            <div className="bg-white/20 rounded-lg px-4 py-2 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-400" />
              <span className="text-white font-semibold">
                {currentParticipant.id}번 참가자 ({participantIndex + 1}/{totalActiveParticipants})
              </span>
            </div>
          </div>
        </div>

        {/* 타이머 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Timer className="w-6 h-6 text-yellow-400" />
            <span className="text-2xl font-bold text-white">{timeLeft}초</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-yellow-400 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${(timeLeft / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* 질문 */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            {question.question}
          </h2>
        </div>

        {/* 답변 버튼 */}
        <div className="flex gap-8 justify-center">
          <button
            onClick={() => handleAnswer(true)}
            disabled={selectedAnswer !== null}
            className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold transition-all transform hover:scale-110 disabled:cursor-not-allowed ${
              selectedAnswer === true 
                ? 'bg-blue-600 text-white scale-110' 
                : selectedAnswer === false 
                ? 'bg-gray-600 text-gray-400' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <Circle className="w-16 h-16" />
          </button>
          
          <button
            onClick={() => handleAnswer(false)}
            disabled={selectedAnswer !== null}
            className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold transition-all transform hover:scale-110 disabled:cursor-not-allowed ${
              selectedAnswer === false 
                ? 'bg-red-600 text-white scale-110' 
                : selectedAnswer === true 
                ? 'bg-gray-600 text-gray-400' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            <X className="w-16 h-16" />
          </button>
        </div>

        <div className="flex justify-center gap-8 mt-8 text-white text-xl">
          <span>O (맞다)</span>
          <span>X (틀리다)</span>
        </div>
      </div>
    </div>
  );
};