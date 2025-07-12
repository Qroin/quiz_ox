export interface Question {
  question: string;
  answer: boolean; // true for O, false for X
}

export interface GameSettings {
  totalParticipants: number;
  finalParticipants: number;
  eliminationMode: 'correct' | 'incorrect'; // 'correct': 정답자 탈락, 'incorrect': 오답자 탈락
}

export interface Participant {
  id: number;
  isActive: boolean;
}

export interface ParticipantResult {
  participantId: number;
  answer: boolean | null;
  isCorrect: boolean;
  wasAnswered: boolean;
}

export interface GameState {
  phase: 'setup' | 'countdown' | 'question' | 'answer' | 'result' | 'confirmation' | 'finished';
  currentRound: number;
  participants: Participant[];
  currentParticipantIndex: number; // 현재 답변 중인 참가자의 배열 인덱스
  questions: Question[];
  currentQuestion: Question | null;
  selectedAnswer: boolean | null;
  timeLeft: number;
  roundResults: ParticipantResult[];
  usedQuestions: Set<number>; // 사용된 질문 인덱스
}