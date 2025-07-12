import React, { useState, useRef } from 'react';
import { Upload, Users, Target, Settings, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { GameSettings, Question } from '../types';

interface GameSetupProps {
  onGameStart: (settings: GameSettings, questions: Question[]) => void;
}

export const GameSetup: React.FC<GameSetupProps> = ({ onGameStart }) => {
  const [settings, setSettings] = useState<GameSettings>({
    totalParticipants: 10,
    finalParticipants: 3,
    eliminationMode: 'incorrect'
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [csvUploaded, setCsvUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          let parsedQuestions: Question[] = [];
          
          // XLSX 파일 처리
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
          
          // 헤더 행 건너뛰기 (첫 번째 행이 헤더인 경우)
          const startIndex = jsonData[0] && (
            jsonData[0][0]?.includes('질문') || 
            jsonData[0][0]?.includes('question') ||
            jsonData[0][0]?.includes('Question')
          ) ? 1 : 0;
          
          for (let i = startIndex; i < jsonData.length; i++) {
            const row = jsonData[i];
            if (row && row.length >= 2 && row[0] && row[1]) {
              const questionText = String(row[0]).trim();
              const answerText = String(row[1]).trim();
              if (questionText && answerText) {
                const answer = answerText.toLowerCase() === 'o' || 
                             answerText.toLowerCase() === 'true' || 
                             answerText === '1' ||
                             answerText === 'O';
                parsedQuestions.push({
                  question: questionText,
                  answer: answer
                });
              }
            }
          }
          
          setQuestions(parsedQuestions);
          setCsvUploaded(true);
        } catch (error) {
          console.error('파일 읽기 오류:', error);
          alert('파일을 읽는 중 오류가 발생했습니다. 파일 형식을 확인해주세요.');
        }
      };
      
      reader.readAsArrayBuffer(file);
    } else {
      alert('XLSX 파일만 업로드 가능합니다.');
    }
  };

  const loadSampleQuestions = async () => {
    try {
      const response = await fetch('/question.xlsx');
      const arrayBuffer = await response.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
      
      const parsedQuestions: Question[] = [];
      
      // 헤더 행 건너뛰기
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (row && row.length >= 2 && row[0] && row[1]) {
          const questionText = String(row[0]).trim();
          const answerText = String(row[1]).trim();
          if (questionText && answerText) {
            const answer = answerText.toLowerCase() === 'o' || 
                         answerText.toLowerCase() === 'true' || 
                         answerText === '1' ||
                         answerText === 'O';
            parsedQuestions.push({
              question: questionText,
              answer: answer
            });
          }
        }
      }
      
      setQuestions(parsedQuestions);
      setCsvUploaded(true);
    } catch (error) {
      console.error('샘플 질문 로드 실패:', error);
      // CSV 파일로 폴백
      try {
        const response = await fetch('/질문.csv');
        const text = await response.text();
        const lines = text.split('\n').filter(line => line.trim());
        const parsedQuestions: Question[] = [];
        
        // Skip header
        for (let i = 1; i < lines.length; i++) {
          const [questionText, answerText] = lines[i].split(',').map(item => item.trim());
          if (questionText && answerText) {
            const answer = answerText.toLowerCase() === 'o' || answerText.toLowerCase() === 'true' || answerText === '1';
            parsedQuestions.push({
              question: questionText,
              answer: answer
            });
          }
        }
        
        setQuestions(parsedQuestions);
        setCsvUploaded(true);
      } catch (csvError) {
        console.error('CSV 폴백도 실패:', csvError);
      }
    }
  };

  const handleStart = () => {
    if (questions.length > 0 && settings.totalParticipants > settings.finalParticipants) {
      onGameStart(settings, questions);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl max-w-md w-full border border-white/20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">랜덤 게임</h1>
          <p className="text-blue-200">랜덤 질문으로 진행하는 서바이벌 게임</p>
        </div>

        <div className="space-y-6">
          {/* CSV 파일 업로드 */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Upload className="w-5 h-5 text-blue-400" />
              <h3 className="text-white font-semibold">질문 파일 업로드</h3>
            </div>
            
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                XLSX 파일 선택
              </button>
              
              <button
                onClick={loadSampleQuestions}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                샘플 질문 사용
              </button>
            </div>
            
            {csvUploaded && (
              <p className="text-green-400 text-sm mt-2">
                ✓ {questions.length}개의 질문이 로드되었습니다
              </p>
            )}
            <p className="text-blue-200 text-xs mt-2">
              XLSX 형식: A열(질문), B열(답)
            </p>
          </div>

          {/* 게임 설정 */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Settings className="w-5 h-5 text-blue-400" />
              <h3 className="text-white font-semibold">게임 설정</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-blue-200 text-sm mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  참가 인원
                </label>
                <input
                  type="number"
                  min="2"
                  value={settings.totalParticipants}
                  onChange={(e) => setSettings({...settings, totalParticipants: parseInt(e.target.value)})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-blue-300"
                />
              </div>

              <div>
                <label className="block text-blue-200 text-sm mb-2">
                  <Target className="w-4 h-4 inline mr-1" />
                  최종 인원
                </label>
                <input
                  type="number"
                  min="1"
                  max={settings.totalParticipants - 1}
                  value={settings.finalParticipants}
                  onChange={(e) => setSettings({...settings, finalParticipants: parseInt(e.target.value)})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-blue-300"
                />
              </div>

              <div>
                <label className="block text-blue-200 text-sm mb-2">진출 방식</label>
                <select
                  value={settings.eliminationMode}
                  onChange={(e) => setSettings({...settings, eliminationMode: e.target.value as 'correct' | 'incorrect'})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                >
                  <option value="incorrect" className="bg-gray-800">오답자 열외</option>
                  <option value="correct" className="bg-gray-800">정답자 열외</option>
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={handleStart}
            disabled={!csvUploaded || questions.length === 0 || settings.totalParticipants <= settings.finalParticipants}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 disabled:hover:scale-100"
          >
            게임 시작
          </button>
        </div>
      </div>
    </div>
  );
};