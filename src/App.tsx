import { GameSetup } from './components/GameSetup';
import { GameCountdown } from './components/GameCountdown';
import { GameQuestion } from './components/GameQuestion';
import { GameAnswer } from './components/GameAnswer';
import { GameResult } from './components/GameResult';
import { GameConfirmation } from './components/GameConfirmation';
import { useGameLogic } from './hooks/useGameLogic';

function App() {
  const {
    gameState,
    gameSettings,
    startGame,
    startQuestion,
    answerQuestion,
    handleTimeUp,
    nextParticipant,
    continueGame,
    showConfirmation,
    endGame,
    resetGame
  } = useGameLogic();

  const activeParticipants = gameState.participants.filter(p => p.isActive);
  const currentParticipant = activeParticipants[gameState.currentParticipantIndex];
  
  // 정답자와 오답자 수 계산
  const correctCount = gameState.roundResults.filter(r => r.isCorrect).length;
  const incorrectCount = gameState.roundResults.filter(r => !r.isCorrect).length;
  
  // 생존자 계산
  const correctResults = gameState.roundResults.filter(r => r.isCorrect);
  const incorrectResults = gameState.roundResults.filter(r => !r.isCorrect);
  const eliminatedResults = gameSettings.eliminationMode === 'correct' ? correctResults : incorrectResults;
  const eliminatedIds = new Set(eliminatedResults.map(r => r.participantId));
  const survivingParticipants = activeParticipants.filter(p => !eliminatedIds.has(p.id));
  
  // 게임 중지 요청 버튼 표시 조건: 남은 참가자 > 최종 인원
  const shouldShowEndGameOption = survivingParticipants.length > gameSettings.finalParticipants;

  switch (gameState.phase) {
    case 'setup':
      return <GameSetup onGameStart={startGame} />;
    
    case 'countdown':
      return <GameCountdown onCountdownComplete={startQuestion} />;
    
    case 'question':
      return (
        <GameQuestion 
          question={gameState.currentQuestion!}
          currentParticipant={currentParticipant}
          participantIndex={gameState.currentParticipantIndex}
          totalActiveParticipants={activeParticipants.length}
          currentRound={gameState.currentRound}
          onAnswer={answerQuestion}
          onTimeUp={handleTimeUp}
        />
      );
    
    case 'answer':
      return (
        <GameAnswer 
          question={gameState.currentQuestion!}
          selectedAnswer={gameState.selectedAnswer}
          currentParticipant={currentParticipant}
          participantIndex={gameState.currentParticipantIndex}
          totalActiveParticipants={activeParticipants.length}
          currentRound={gameState.currentRound}
          onNext={nextParticipant}
        />
      );
    
    case 'result':
      return (
        <GameResult 
          currentRound={gameState.currentRound}
          activeParticipants={activeParticipants}
          finalParticipants={gameSettings.finalParticipants}
          correctCount={correctCount}
          incorrectCount={incorrectCount}
          eliminationMode={gameSettings.eliminationMode}
          survivingParticipants={survivingParticipants}
          onContinue={continueGame}
          onEndGame={showConfirmation}
          showEndGameOption={shouldShowEndGameOption}
        />
      );
    
    case 'confirmation':
      return (
        <GameConfirmation 
          onYes={endGame}
          onNo={continueGame}
        />
      );
    
    case 'finished':
      return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl max-w-md w-full border border-white/20 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">🎉 게임 완료!</h1>
            <p className="text-blue-200 mb-6">수고하셨습니다!</p>
            <button
              onClick={resetGame}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all"
            >
              새 게임 시작
            </button>
          </div>
        </div>
      );
    
    default:
      return <GameSetup onGameStart={startGame} />;
  }
}

export default App;