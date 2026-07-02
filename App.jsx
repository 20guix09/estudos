import React, { useState, useEffect, useMemo } from 'react';
import StudyView from 'StudyView';

// --- DATA STRUCTURE ---
const COURSE_DATA = [
  {
    id: 'm1',
    title: 'M1: O Despertar do Claude Code (Fundamentos)',
    lessons: [
      { id: 'l1_1', title: '1. Diferença entre Claude Web e Claude Code', youtubeId: 'CDrPw6vvxwc' },
      { id: 'l1_2', title: '2. Configuração de Elite', youtubeId: 'uzBRBMrHsrA' },
      { id: 'l1_3', title: '3. Dominando o Terminal', youtubeId: '8UHEuNlSylw' },
      { id: 'l1_4', title: '4. O Manual do Projeto', youtubeId: 'WPZU8FmPrDY' },    
    ]
  },
  {
    id: 'm2',
    title: 'M2: O Combo da Economia (Arbitragem Gemini + Claude)',
    lessons: [
      { id: 'l2_1', title: '1. Workflow de Economia', youtubeId: 'jspspwoKNUY' },
      { id: 'l2_2', title: '2. Design e Backend', youtubeId: 'wuQVdtwFzXc' },
      { id: 'l2_3', title: '3. Gestão de Contexto', youtubeId: '4KTCBFbK3s0' },
    ]
  },
  {
    id: 'm3',
    title: 'M3: Automação e Poder Agêntico (Poder de Escala)',
    lessons: [
      { id: 'l3_1', title: '1. Protocolo MCP', youtubeId: '6Xh1ffDnq_8' },
      { id: 'l3_2', title: '2. Subagentes e Equipes', youtubeId: 'q0e3IcGl8mA' },
      { id: 'l3_3', title: '3. Skills Customizadas', youtubeId: 'G9vO8GzRCL4' },
    ]
  },
  {
    id: 'm4',
    title: 'M4: A Startup Rica (Vendas, Gestão e Segurança)',
    lessons: [
      { id: 'l4_1', title: '1. A Startup Rica (Vendas, Gestão e Segurança)', youtubeId: 'dQw4w9WgXcQ' },
      { id: 'l4_2', title: '2. Precificação de Programador', youtubeId: 'yXuwS3o6wOg' },
      { id: 'l4_3', title: '3. Organização Financeira', youtubeId: 'pncp4qij7sM' },
      { id: 'l4_4', title: '4. O jeito certo de guardar chaves de API em arquivos', youtubeId: 'fcdH0r9rLLo' },
      { id: 'l4_5', title: '5. Segurança e LGPD', youtubeId: 'YBMq5c2ssY0' },
    ]
  }
];

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' | 'study'
  const [activeLessonId, setActiveLessonId] = useState(null);
  
  // LocalStorage State
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem('aiStudyGuide_userData');
    return saved ? JSON.parse(saved) : { notes: {}, completed: [] };
  });

  // Save to LocalStorage on change
  useEffect(() => {
    localStorage.setItem('aiStudyGuide_userData', JSON.stringify(userData));
  }, [userData]);

  // Global Progress Calculation
  const totalLessons = useMemo(() => COURSE_DATA.flatMap(m => m.lessons).length, []);
  const completedCount = userData.completed.length;
  const progressPercentage = Math.round((completedCount / totalLessons) * 100) || 0;

  const handleLessonSelect = (lessonId) => {
    setActiveLessonId(lessonId);
    setCurrentView('study');
  };

  const updateNotes = (lessonId, text) => {
    setUserData(prev => ({
      ...prev,
      notes: { ...prev.notes, [lessonId]: text }
    }));
  };

  const markCompleted = (lessonId) => {
    if (!userData.completed.includes(lessonId)) {
      setUserData(prev => ({
        ...prev,
        completed: [...prev.completed, lessonId]
      }));
    }
  };

  if (currentView === 'study') {
    return (
      <StudyView 
        courseData={COURSE_DATA}
        activeLessonId={activeLessonId}
        userData={userData}
        updateNotes={updateNotes}
        markCompleted={markCompleted}
        onNavigate={handleLessonSelect}
        goHome={() => setCurrentView('dashboard')}
      />
    );
  }

  // --- DASHBOARD VIEW ---
  return (
    <div className="min-h-screen p-6 md:p-12 max-w-6xl mx-auto">
      <header className="mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-[#1D1D1F]">Personal AI Study Guide</h1>
          <p className="text-gray-500 mt-2">Mastering the Modern AI Stack</p>
        </div>
        
        {/* Global Progress Ring */}
        <div className="flex items-center gap-4 glass px-6 py-4 rounded-2xl">
          <div className="relative w-16 h-16">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E5E5E5" strokeWidth="3" />
              <path strokeDasharray={`${progressPercentage}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#C8A2C8" strokeWidth="3" className="transition-all duration-1000 ease-out" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
              {progressPercentage}%
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-sm">Course Progress</h3>
            <p className="text-xs text-gray-500">{completedCount} of {totalLessons} completed</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {COURSE_DATA.map((module) => {
          const moduleLessons = module.lessons.length;
          const moduleCompleted = module.lessons.filter(l => userData.completed.includes(l.id)).length;
          const isModuleDone = moduleCompleted === moduleLessons;

          return (
            <div key={module.id} className="glass rounded-3xl p-6 transition-transform hover:scale-[1.01] duration-300 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-4 text-[#1D1D1F]">{module.title}</h2>
                <div className="space-y-2 mb-6">
                  {module.lessons.map(lesson => (
                    <div 
                      key={lesson.id} 
                      onClick={() => handleLessonSelect(lesson.id)}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-white/50 cursor-pointer transition-colors"
                    >
                      <span className="text-sm font-medium text-gray-700 truncate pr-4">{lesson.title}</span>
                      {userData.completed.includes(lesson.id) ? (
                        <svg className="w-5 h-5 text-[#C8A2C8]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Module Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`bg-[#C8A2C8] h-1.5 rounded-full transition-all duration-500 ${isModuleDone ? 'glow-active' : ''}`}
                  style={{ width: `${(moduleCompleted / moduleLessons) * 100}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
