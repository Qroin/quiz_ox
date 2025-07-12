import React from 'react';
import { CheckCircle, XCircle, User } from 'lucide-react';
import { Question, Participant } from '../types';

interface GameAnswerProps {
  question: Question;
  selectedAnswer: boolean | null;
  currentParticipant: Participant;
  participantIndex: number;
  totalActiveParticipants: number;
  currentRound: number;
  onNext: () => void;
}

export const GameAnswer: React.FC<GameAnswerProps> = ({ 
  question, 
  selectedAnswer, 
  currentParticipant,
  participantIndex,
  totalActiveParticipants, 
  currentRound,
  onNext 
}) => {
  const isCorrect = selectedAnswer === question.answer;
  const wasAnswered = selectedAnswer !== null;

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      isCorrect ? 'bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900' : 
      'bg-gradient-to-br from-red-900 via-rose-900 to-pink-900'
    }`}>
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl max-w-2xl w-full border border-white/20 text-center">
        {/* 게임 정보 */}
        <div className="flex items-center justify-center gap-4 mb-6">
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

        <div className="mb-6">
          {isCorrect ? (
            <CheckCircle className="w-24 h-24 text-green-400 mx-auto mb-4" />
          ) : (
            <XCircle className="w-24 h-24 text-red-400 mx-auto mb-4" />
          )}
          
          <h2 className="text-4xl font-bold text-white mb-2">
            {!wasAnswered ? '시간 초과!' : isCorrect ? '정답!' : '오답!'}
          </h2>
          
          <p className="text-xl text-blue-200 mb-4">
            {question.question}
          </p>
          
          <div className="text-lg text-white">
            <p className="mb-2">정답: {question.answer ? 'O' : 'X'}</p>
            {wasAnswered && (
              <p>선택한 답: {selectedAnswer ? 'O' : 'X'}</p>
            )}
          </div>
        </div>

        <button
          onClick={onNext}
          className="bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-8 rounded-xl transition-all"
        >
          다음
        </button>
      </div>
    </div>
  );
};