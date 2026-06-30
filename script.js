const sampleTexts = [
    "The quick brown fox jumps over the lazy dog while the moonlight paints silver shadows across the quiet hills.",
    "Practice makes perfect and every keystroke builds confidence when you type with steady rhythm and focus.",
    "Coding is a creative craft where small ideas turn into powerful solutions when patience and curiosity guide the way.",
    "A simple typing test can become a fun challenge when the timer starts and your thoughts flow naturally onto the screen."
];

const displayText = document.getElementById('displayText');
const inputField = document.getElementById('inputField');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const wpmValue = document.getElementById('wpm');
const accuracyValue = document.getElementById('accuracy');
const timeValue = document.getElementById('time');
const charactersValue = document.getElementById('characters');
const messageEl = document.getElementById('message');

let currentText = '';
let isRunning = false;
let hasCompleted = false;
let startTime = null;
let elapsedSeconds = 0;
let correctChars = 0;
let typedChars = 0;
let timerInterval = null;

function pickRandomText() {
    const randomIndex = Math.floor(Math.random() * sampleTexts.length);
    currentText = sampleTexts[randomIndex];
}

function renderText() {
    const typedValue = inputField.value;
    displayText.innerHTML = '';

    currentText.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.className = 'char';

        if (index < typedValue.length) {
            span.classList.add(typedValue[index] === char ? 'correct' : 'incorrect');
        } else if (index === typedValue.length && isRunning && !hasCompleted) {
            span.classList.add('current');
        }

        span.textContent = char;
        displayText.appendChild(span);
    });
}

function updateStats() {
    if (startTime) {
        elapsedSeconds = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
    }

    const minutes = elapsedSeconds / 60 || 1 / 60;
    const wpm = typedChars > 0 ? Math.round((correctChars / 5) / minutes) : 0;
    const accuracy = typedChars > 0 ? Math.round((correctChars / typedChars) * 100) : 100;

    wpmValue.textContent = wpm;
    accuracyValue.textContent = `${accuracy}%`;
    timeValue.textContent = `${elapsedSeconds}s`;
    charactersValue.textContent = typedChars;
}

function finishTest() {
    clearInterval(timerInterval);
    isRunning = false;
    hasCompleted = true;
    inputField.disabled = true;
    startBtn.disabled = false;
    startBtn.textContent = 'Start Again';

    const accuracy = typedChars > 0 ? Math.round((correctChars / typedChars) * 100) : 100;
    const minutes = elapsedSeconds / 60 || 1 / 60;
    const wpm = typedChars > 0 ? Math.round((correctChars / 5) / minutes) : 0;

    messageEl.textContent = `Finished! You reached ${wpm} WPM with ${accuracy}% accuracy.`;
    messageEl.className = 'message success';
}

function startTest() {
    pickRandomText();
    isRunning = true;
    hasCompleted = false;
    startTime = Date.now();
    elapsedSeconds = 0;
    correctChars = 0;
    typedChars = 0;
    inputField.value = '';
    inputField.disabled = false;
    inputField.focus();
    startBtn.disabled = true;
    startBtn.textContent = 'Start Test';
    messageEl.textContent = 'Start typing to begin the timer...';
    messageEl.className = 'message';

    clearInterval(timerInterval);
    timerInterval = setInterval(updateStats, 1000);

    displayText.textContent = currentText;
    renderText();
    updateStats();
}

function resetTest() {
    clearInterval(timerInterval);
    isRunning = false;
    hasCompleted = false;
    startTime = null;
    elapsedSeconds = 0;
    correctChars = 0;
    typedChars = 0;
    inputField.value = '';
    inputField.disabled = true;
    inputField.placeholder = 'Click start to begin typing...';
    startBtn.disabled = false;
    startBtn.textContent = 'Start Test';
    messageEl.textContent = '';
    messageEl.className = 'message';

    pickRandomText();
    displayText.textContent = currentText;
    renderText();
    updateStats();
}

inputField.addEventListener('input', () => {
    if (!isRunning) return;

    let typedValue = inputField.value;

    if (typedValue.length > currentText.length) {
        typedValue = typedValue.slice(0, currentText.length);
        inputField.value = typedValue;
    }

    typedChars = typedValue.length;
    correctChars = 0;

    for (let i = 0; i < typedValue.length; i += 1) {
        if (typedValue[i] === currentText[i]) {
            correctChars += 1;
        }
    }

    renderText();
    updateStats();

    if (typedValue === currentText) {
        finishTest();
    }
});

resetTest();
