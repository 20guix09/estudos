import React, { useMemo } from 'react';

export default function StudyView({ 
  courseData, activeLessonId, userData, updateNotes, markCompleted, onNavigate, goHome 
}) {
  
  // Flatten lessons to easily find next/prev
  const allLessons = useMemo(() => courseData.flatMap(m => m.lessons), [courseData]);
  const currentIndex = allLessons.findIndex(l => l.id === activeLessonId);
  const activeLesson = allLessons[currentIndex];
  const nextLesson = allLessons[currentIndex + 1];

  // Core Logic: Garrado Method (Min 50 chars to unlock)
  const currentNote = userData.notes[activeLessonId] || '';
  const isCompleted = userData.completed.includes(activeLessonId);
  const charCount = currentNote.length;
  const charsNeeded = Math.max(0, 50 - charCount);
  const canProceed = charCount >= 50 || isCompleted;

  const handleNext = () => {
    if (!canProceed) return;
    markCompleted(activeLessonId);
    if (nextLesson) {
      onNavigate(nextLesson.id);
    } else {
      goHome(); // Finish course
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#F5F5F7] overflow-hidden">
      
      {/* SIDEBAR: Navigation */}
      <aside className="w-full md:w-72 glass flex-shrink-0 flex flex-col h-[30vh] md:h-screen z-10 border-r border-white/40">
        <div className="p-4 flex items-center gap-3 cursor-pointer hover:bg-black/5 transition-colors" onClick={goHome}>
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          <span className="font-semibold text-sm">Back to Dashboard</span>
        </div>
        
        <div className="overflow-y-auto scrollbar-hide p-4 flex-1">
          {courseData.map(module => (
            <div key={module.id} className="mb-6">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{module.title}</h4>
              <div className="space-y-1">
                {module.lessons.map(lesson => {
                  const isDone = userData.completed.includes(lesson.id);
                  const isActive = lesson.id === activeLessonId;
                  
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => onNavigate(lesson.id)}
                      className={`w-full text-left flex items-center gap-3 p-2.5 rounded-lg text-sm transition-all ${
                        isActive ? 'bg-white shadow-sm font-semibold text-[#1D1D1F]' : 'text-gray-600 hover:bg-white/40'
                      }`}
                    >
                      {isDone ? (
                        <svg className="w-4 h-4 text-[#C8A2C8] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                      ) : isActive ? (
                         <div className="w-4 h-4 rounded-full border-2 border-[#C8A2C8] flex-shrink-0"></div>
                      ) : (
                        <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                      )}
                      <span className="truncate">{lesson.title.split('. ')[1] || lesson.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden h-[70vh] md:h-screen">
        
        {/* LEFT: Video Player */}
        <div className="w-full md:w-[55%] h-1/2 md:h-full bg-black/5 p-4 md:p-8 flex flex-col">
          <div className="mb-4">
            <h2 className="text-2xl font-bold">{activeLesson.title}</h2>
          </div>
          <div className="flex-1 bg-black rounded-2xl overflow-hidden shadow-lg relative">
            <iframe 
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${activeLesson.youtubeId}?rel=0`} 
              title={activeLesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* RIGHT: Garrado Notes Editor */}
        <div className="w-full md:w-[45%] h-1/2 md:h-full bg-white p-6 flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.02)] z-20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <svg className="w-5 h-5 text-[#C8A2C8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              Garrado Notes
            </h3>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${canProceed ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
              {canProceed ? 'Unlocked' : `${charsNeeded} chars needed`}
            </span>
          </div>

          <textarea
            className="flex-1 w-full bg-[#F5F5F7] rounded-2xl p-5 text-sm md:text-base resize-none focus:outline-none focus:ring-2 focus:ring-[#C8A2C8]/50 transition-shadow"
            placeholder="Write your active learning notes here. Use Markdown syntax if you'd like. Remember, you must write at least 50 characters to unlock the next module..."
            value={currentNote}
            onChange={(e) => updateNotes(activeLessonId, e.target.value)}
          ></textarea>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                canProceed 
                  ? 'bg-[#C8A2C8] text-white hover:bg-[#b58eb5] glow-active transform hover:-translate-y-0.5' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {nextLesson ? 'Complete & Next' : 'Finish Course'}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}