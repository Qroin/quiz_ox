import React from 'react';
import { Users, Trophy, AlertCircle, Info } from 'lucide-react';
import { Participant } from '../types';

interface GameResultProps {
  currentRound: number;
  activeParticipants: Participant[];
  finalParticipants: number;
  correctCount: number;
  incorrectCount: number;
  eliminationMode: 'correct' | 'incorrect';
  survivingParticipants: Participant[];
  onContinue: () => void;
  onEndGame: () => void;
  showEndGameOption: boolean;
}

export const GameResult: React.FC<GameResultProps> = ({
  currentRound,
  activeParticipants,
  finalParticipants,
  correctCount,
  incorrectCount,
  eliminationMode,
  survivingParticipants,
  onContinue,
  onEndGame,
  showEndGameOption
}) => {
  const isGameComplete = survivingParticipants.length === finalParticipants;
  const needRetry = survivingParticipants.length < finalParticipants;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl max-w-3xl w-full border border-white/20">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            {isGameComplete ? '🎉 게임 완료!' : `라운드 ${currentRound} 결과`}
          </h2>
          
          {isGameComplete && (
            <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4 mb-6">
              <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-yellow-200 text-lg font-semibold">
                최종 {finalParticipants}명이 선발되었습니다!
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4">
              <div className="text-green-400 text-2xl font-bold">{correctCount}</div>
              <div className="text-green-200 text-sm">정답자</div>
            </div>
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4">
              <div className="text-red-400 text-2xl font-bold">{incorrectCount}</div>
              <div className="text-red-200 text-sm">오답자</div>
            </div>
          </div>

          <div className="bg-blue-500/20 border border-blue-500/50 rounded-xl p-4 mb-6">
            <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="text-blue-200">
              {eliminationMode === 'correct' ? '정답자' : '오답자'} 탈락
            </p>
            <p className="text-white text-lg font-semibold mb-2">
              다음 라운드 진출자: {survivingParticipants.length}명
            </p>
            <div className="text-sm text-blue-200">
              진출 참가자 번호: {survivingParticipants.map(p => `${p.id}번`).join(', ')}
            </div>
          </div>

          {needRetry && (
            <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4 mb-6">
              <AlertCircle className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <p className="text-yellow-200">
                목표 인원({finalParticipants}명)보다 적습니다. 이 라운드를 다시 진행합니다.
              </p>
            </div>
          )}

          {showEndGameOption && !isGameComplete && (
            <div className="bg-orange-500/20 border border-orange-500/50 rounded-xl p-4 mb-6">
              <Info className="w-6 h-6 text-orange-400 mx-auto mb-2" />
              <p className="text-orange-200 text-sm">
                게임 참가자는 과반수 동의를 얻을 시 게임을 종료할 수 있습니다.
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {!isGameComplete && (
            <button
              onClick={onContinue}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl transition-all"
            >
              {needRetry ? '라운드 재시작' : '다음 라운드'}
            </button>
          )}

          {showEndGameOption && !isGameComplete && (
            <button
              onClick={onEndGame}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl transition-all"
            >
              게임 중지 요청
            </button>
          )}

          {isGameComplete && (
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all"
            >
              새 게임 시작
            </button>
          )}
        </div>
      </div>
    </div>
  );
};