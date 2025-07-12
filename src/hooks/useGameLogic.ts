import { useState, useCallback } from 'react';
import { GameState, GameSettings, Question, ParticipantResult, Participant } from '../types';

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>({
    phase: 'setup',
    currentRound: 1,
    participants: [],
    currentParticipantIndex: 0,
    questions: [],
    currentQuestion: null,
    selectedAnswer: null,
    timeLeft: 3,
    roundResults: [],
    usedQuestions: new Set()
  });

  const [gameSettings, setGameSettings] = useState<GameSettings>({
    totalParticipants: 0,
    finalParticipants: 0,
    eliminationMode: 'incorrect'
  });

  const startGame = useCallback((settings: GameSettings, questions: Question[]) => {
    const participants: Participant[] = Array.from({ length: settings.totalParticipants }, (_, i) => ({
      id: i + 1,
      isActive: true
    }));

    setGameSettings(settings);
    setGameState({
      phase: 'countdown',
      currentRound: 1,
      participants,
      currentParticipantIndex: 0,
      questions: [...questions],
      currentQuestion: null,
      selectedAnswer: null,
      timeLeft: 3,
      roundResults: [],
      usedQuestions: new Set()
    });
  }, []);

  const startQuestion = useCallback(() => {
    // 사용하지 않은 질문 중에서 랜덤 선택
    const availableQuestions = gameState.questions
      .map((_, index) => index)
      .filter(index => !gameState.usedQuestions.has(index));
    
    // 모든 질문을 사용했다면 초기화
    if (availableQuestions.length === 0) {
      setGameState(prev => ({ ...prev, usedQuestions: new Set() }));
      const randomIndex = Math.floor(Math.random() * gameState.questions.length);
      const randomQuestion = gameState.questions[randomIndex];
      
      setGameState(prev => ({
        ...prev,
        phase: 'question',
        currentQuestion: randomQuestion,
        selectedAnswer: null,
        timeLeft: 3,
        usedQuestions: new Set([randomIndex])
      }));
    } else {
      const randomIndex = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
      const randomQuestion = gameState.questions[randomIndex];
      
      setGameState(prev => ({
        ...prev,
        phase: 'question',
        currentQuestion: randomQuestion,
        selectedAnswer: null,
        timeLeft: 3,
        usedQuestions: new Set([...prev.usedQuestions, randomIndex])
      }));
    }
  }, [gameState.questions, gameState.usedQuestions]);

  const answerQuestion = useCallback((answer: boolean) => {
    setGameState(prev => ({ ...prev, selectedAnswer: answer, phase: 'answer' }));
  }, []);

  const handleTimeUp = useCallback(() => {
    setGameState(prev => ({ ...prev, phase: 'answer' }));
  }, []);

  const nextParticipant = useCallback(() => {
    const activeParticipants = gameState.participants.filter(p => p.isActive);
    const currentParticipant = activeParticipants[gameState.currentParticipantIndex];
    const isCorrect = gameState.selectedAnswer === gameState.currentQuestion?.answer;
    const wasAnswered = gameState.selectedAnswer !== null;
    
    const participantResult: ParticipantResult = {
      participantId: currentParticipant.id,
      answer: gameState.selectedAnswer,
      isCorrect: wasAnswered && isCorrect,
      wasAnswered
    };

    setGameState(prev => {
      const newResults = [...prev.roundResults, participantResult];
      
      // 모든 활성 참가자가 답변을 완료했는지 확인
      if (prev.currentParticipantIndex >= activeParticipants.length - 1) {
        return {
          ...prev,
          roundResults: newResults,
          phase: 'result'
        };
      } else {
        // 다음 참가자로 이동
        return {
          ...prev,
          currentParticipantIndex: prev.currentParticipantIndex + 1,
          roundResults: newResults,
          phase: 'countdown'
        };
      }
    });
  }, [gameState.selectedAnswer, gameState.currentQuestion, gameState.currentParticipantIndex, gameState.participants]);

  const continueGame = useCallback(() => {
    const correctResults = gameState.roundResults.filter(r => r.isCorrect);
    const incorrectResults = gameState.roundResults.filter(r => !r.isCorrect);
    
    // 탈락자 결정
    const eliminatedResults = gameSettings.eliminationMode === 'correct' ? correctResults : incorrectResults;
    const eliminatedIds = new Set(eliminatedResults.map(r => r.participantId));
    
    // 생존자 결정
    const survivingParticipants = gameState.participants.filter(p => 
      p.isActive && !eliminatedIds.has(p.id)
    );
    
    if (survivingParticipants.length === gameSettings.finalParticipants) {
      // 목표 인원 달성 - 게임 종료
      setGameState(prev => ({ ...prev, phase: 'finished' }));
    } else if (survivingParticipants.length < gameSettings.finalParticipants) {
      // 목표 인원보다 적음 - 같은 라운드 재시작 (참가자 상태 유지)
      setGameState(prev => ({
        ...prev,
        phase: 'countdown',
        currentParticipantIndex: 0,
        roundResults: [],
        usedQuestions: new Set() // 라운드 재시작 시 질문 풀 초기화
      }));
    } else {
      // 다음 라운드 진행
      const updatedParticipants = gameState.participants.map(p => ({
        ...p,
        isActive: p.isActive && !eliminatedIds.has(p.id)
      }));
      
      setGameState(prev => ({
        ...prev,
        phase: 'countdown',
        currentRound: prev.currentRound + 1,
        participants: updatedParticipants,
        currentParticipantIndex: 0,
        roundResults: [],
        usedQuestions: new Set() // 새 라운드 시작 시 질문 풀 초기화
      }));
    }
  }, [gameSettings, gameState]);

  const showConfirmation = useCallback(() => {
    setGameState(prev => ({ ...prev, phase: 'confirmation' }));
  }, []);

  const endGame = useCallback(() => {
    setGameState(prev => ({ ...prev, phase: 'finished' }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      phase: 'setup',
      currentRound: 1,
      participants: [],
      currentParticipantIndex: 0,
      questions: [],
      currentQuestion: null,
      selectedAnswer: null,
      timeLeft: 3,
      roundResults: [],
      usedQuestions: new Set()
    });
  }, []);

  return {
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
  };
};