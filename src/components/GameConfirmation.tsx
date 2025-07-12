import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface GameConfirmationProps {
  onYes: () => void;
  onNo: () => void;
}

export const GameConfirmation: React.FC<GameConfirmationProps> = ({ onYes, onNo }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-orange-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl max-w-md w-full border border-white/20">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          
          <h2 className="text-2xl font-bold text-white mb-4">
            게임 중단 확인
          </h2>
          
          <p className="text-blue-200 mb-2">
            게임 참가자는 과반수 동의를 얻을 시
          </p>
          <p className="text-blue-200 mb-6">
            게임을 종료할 수 있습니다.
          </p>
          
          <p className="text-white text-lg font-semibold mb-8">
            게임을 중단하시겠습니까?
          </p>

          <div className="flex gap-4">
            <button
              onClick={onYes}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all"
            >
              Yes
            </button>
            <button
              onClick={onNo}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-all"
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};