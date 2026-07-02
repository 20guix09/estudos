document.addEventListener("DOMContentLoaded", () => {
    // Curriculum Data Structure
    const curriculumData = [
        {
            moduleTitle: "Módulo 1: O Despertar do Claude Code (Fundamentos)",
            lessons: [
                { id: "RBwX9U2AEr8", title: "Conceitos Iniciais" },
                { id: "uzBRBMrHsrA", title: "Configuração de Elite" },
                { id: "8UHEuNlSylw", title: "Dominando o Terminal" },
                { id: "WPZU8FmPrDY", title: "O Manual do Projeto" }
            ]
        },
        {
            moduleTitle: "Módulo 2: O Combo da Economia (Arbitragem Gemini + Claude)",
            lessons: [
                { id: "jspspwoKNUY", title: "Workflow de Economia" },
                { id: "wuQVdtwFzXc", title: "Design e Backend" },
                { id: "4KTCBFbK3s0", title: "Gestão de Contexto" }
            ]
        },
        {
            moduleTitle: "Módulo 3: Automação e Poder Agêntico",
            lessons: [
                { id: "6Xh1ffDnq_8", title: "Protocolo MCP" },
                { id: "q0e3IcGl8mA", title: "Subagentes e Equipes" },
                { id: "G9vO8GzRCL4", title: "Skills Customizadas" }
            ]
        },
        {
            moduleTitle: "Módulo 4: A Startup Rica (Vendas e Gestão)",
            lessons: [
                { id: "6-fLPgv2IQg", title: "Prospecção Ativa" },
                { id: "yXuwS3o6wOg", title: "Precificação de Programador" },
                { id: "pncp4qij7sM", title: "Organização Financeira" },
                { id: ["fcdH0r9rLLo", "YBMq5c2ssY0"], title: "Segurança e LGPD" } // Array for dual videos
            ]
        }
    ];

    // Flatten lessons for easy indexing
    let lessonsList = [];
    curriculumData.forEach((mod, modIndex) => {
        mod.lessons.forEach(lesson => {
            lessonsList.push({
                ...lesson,
                moduleName: mod.moduleTitle.split(':')[0], // e.g. "Módulo 1"
                fullModuleName: mod.moduleTitle
            });
        });
    });

    // App State
    let state = {
        theme: localStorage.getItem('theme') || 'dark',
        currentLessonIndex: parseInt(localStorage.getItem('currentLessonIndex')) || 0,
        notes: JSON.parse(localStorage.getItem('lessonNotes')) || {}
    };

    const REQUIRED_CHARS = 50;

    // DOM Elements
    const body = document.body;
    const themeBtn = document.getElementById('theme-toggle');
    const moonIcon = document.getElementById('moon-icon');
    const sunIcon = document.getElementById('sun-icon');
    const navContainer = document.getElementById('curriculum-nav');
    const lessonTitleEl = document.getElementById('lesson-title');
    const moduleLabelEl = document.getElementById('module-label');
    const videoContainer = document.getElementById('video-container');
    const notesEditor = document.getElementById('notes-editor');
    const charCountEl = document.getElementById('char-count');
    const nextBtn = document.getElementById('next-btn');
    const progressCircle = document.querySelector('.progress-ring__circle');
    const progressText = document.getElementById('progress-text');

    // Initialize App
    function init() {
        applyTheme(state.theme);
        renderSidebar();
        loadLesson(state.currentLessonIndex);
        updateProgress();

        // Event Listeners
        themeBtn.addEventListener('click', toggleTheme);
        notesEditor.addEventListener('input', handleNoteInput);
        nextBtn.addEventListener('click', goNextLesson);
    }

    // Theme Management
    function toggleTheme() {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', state.theme);
        applyTheme(state.theme);
    }

    function applyTheme(theme) {
        if (theme === 'light') {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            moonIcon.style.display = 'none';
            sunIcon.style.display = 'block';
        } else {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            moonIcon.style.display = 'block';
            sunIcon.style.display = 'none';
        }
    }

    // Render Sidebar Curriculum
    function renderSidebar() {
        navContainer.innerHTML = '';
        let globalIndex = 0;

        curriculumData.forEach((mod) => {
            const group = document.createElement('div');
            group.className = 'module-group';
            
            const title = document.createElement('div');
            title.className = 'module-title';
            title.textContent = mod.moduleTitle;
            group.appendChild(title);

            mod.lessons.forEach((lesson) => {
                const item = document.createElement('div');
                item.className = 'lesson-item';
                item.textContent = lesson.title;
                item.dataset.index = globalIndex;
                
                // Check completion status (Note >= 50 chars)
                const lessonIdKey = Array.isArray(lesson.id) ? lesson.id[0] : lesson.id;
                const savedNote = state.notes[lessonIdKey] || "";
                if (savedNote.length >= REQUIRED_CHARS) {
                    item.classList.add('completed');
                }

                if (globalIndex === state.currentLessonIndex) {
                    item.classList.add('active');
                }

                const currentIndex = globalIndex;
                item.addEventListener('click', () => {
                    loadLesson(currentIndex);
                });

                group.appendChild(item);
                globalIndex++;
            });

            navContainer.appendChild(group);
        });
    }

    // Load Specific Lesson
    function loadLesson(index) {
        state.currentLessonIndex = index;
        localStorage.setItem('currentLessonIndex', index);
        
        const lesson = lessonsList[index];
        const lessonIdKey = Array.isArray(lesson.id) ? lesson.id[0] : lesson.id;

        // Update UI
        lessonTitleEl.textContent = lesson.title;
        moduleLabelEl.textContent = lesson.moduleName;
        
        // Re-render sidebar active states
        document.querySelectorAll('.lesson-item').forEach(el => {
            el.classList.remove('active');
            if (parseInt(el.dataset.index) === index) el.classList.add('active');
        });

        // Inject Videos (Handle multiple videos for L14)
        videoContainer.innerHTML = '';
        const videoIds = Array.isArray(lesson.id) ? lesson.id : [lesson.id];
        
        videoIds.forEach(vidId => {
            const wrapper = document.createElement('div');
            wrapper.className = 'video-wrapper';
            wrapper.innerHTML = `<iframe src="https://www.youtube.com/embed/${vidId}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            videoContainer.appendChild(wrapper);
        });

        // Load Notes
        const savedNote = state.notes[lessonIdKey] || "";
        notesEditor.value = savedNote;
        
        // Trigger validation check
        handleNoteInput();

        // Animation re-trigger
        const scrollContent = document.querySelector('.content-scroll');
        scrollContent.classList.remove('fade-in');
        void scrollContent.offsetWidth; // Trigger reflow
        scrollContent.classList.add('fade-in');

        // Hide next button if on last lesson
        if (index === lessonsList.length - 1) {
            nextBtn.style.display = 'none';
        } else {
            nextBtn.style.display = 'flex';
        }
    }

    // Glock Locking System: Note Input Handling
    function handleNoteInput() {
        const lesson = lessonsList[state.currentLessonIndex];
        const lessonIdKey = Array.isArray(lesson.id) ? lesson.id[0] : lesson.id;
        const text = notesEditor.value;
        const length = text.trim().length;

        // Save to state & localstorage
        state.notes[lessonIdKey] = text;
        localStorage.setItem('lessonNotes', JSON.stringify(state.notes));

        // Update UI Counter
        charCountEl.textContent = length;
        const counterParent = charCountEl.parentElement;

        if (length >= REQUIRED_CHARS) {
            nextBtn.disabled = false;
            counterParent.classList.add('valid');
            updateSidebarCompletionStatus(state.currentLessonIndex, true);
        } else {
            nextBtn.disabled = true;
            counterParent.classList.remove('valid');
            updateSidebarCompletionStatus(state.currentLessonIndex, false);
        }
        
        updateProgress();
    }

    // Go to Next Lesson
    function goNextLesson() {
        if (!nextBtn.disabled && state.currentLessonIndex < lessonsList.length - 1) {
            loadLesson(state.currentLessonIndex + 1);
        }
    }

    function updateSidebarCompletionStatus(index, isCompleted) {
        const items = document.querySelectorAll('.lesson-item');
        if (items[index]) {
            if (isCompleted) {
                items[index].classList.add('completed');
            } else {
                items[index].classList.remove('completed');
            }
        }
    }

    // Progress Ring Calculation
    function updateProgress() {
        let completedCount = 0;
        lessonsList.forEach(lesson => {
            const lessonIdKey = Array.isArray(lesson.id) ? lesson.id[0] : lesson.id;
            const note = state.notes[lessonIdKey] || "";
            if (note.trim().length >= REQUIRED_CHARS) {
                completedCount++;
            }
        });

        const percent = Math.round((completedCount / lessonsList.length) * 100);
        
        // Circumference of radius 26 is ~163 (2 * pi * 26)
        const circumference = 163;
        const offset = circumference - (percent / 100) * circumference;
        
        progressCircle.style.strokeDashoffset = offset;
        progressText.textContent = `${percent}%`;
    }

    // Run
    init();
});