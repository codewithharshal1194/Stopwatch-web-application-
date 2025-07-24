let startTime, interval, elapsed = 0;
let isRunning = false;
let lapTimes = [];
const display = document.getElementById('display');
const startPauseBtn = document.getElementById('startPause');
const resetBtn = document.getElementById('reset');
const lapBtn = document.getElementById('lap');
const laps = document.getElementById('laps');
const themeToggle = document.querySelector('.theme-toggle');

// Initialize theme
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

// Theme toggle
themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});

// Format time for display
function formatTime(ms) {
  const date = new Date(ms);
  return `${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}:${String(date.getUTCSeconds()).padStart(2, '0')}.${String(date.getUTCMilliseconds()).padStart(3, '0')}`;
}

// Format short time (for lap splits)
function formatShortTime(ms) {
  const date = new Date(ms);
  return `${String(date.getUTCMinutes()).padStart(2, '0')}:${String(date.getUTCSeconds()).padStart(2, '0')}.${String(Math.floor(date.getUTCMilliseconds()/10)).padStart(2, '0')}`;
}

// Update the display
function updateTime() {
  const now = Date.now();
  display.textContent = formatTime(now - startTime + elapsed);
}

// Start or pause the stopwatch
function toggleStartPause() {
  if (!isRunning) {
    startTime = Date.now();
    interval = setInterval(updateTime, 10);
    startPauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
    lapBtn.disabled = false;
    isRunning = true;
  } else {
    clearInterval(interval);
    elapsed += Date.now() - startTime;
    startPauseBtn.innerHTML = '<i class="fas fa-play"></i> Start';
    isRunning = false;
  }
}

// Reset the stopwatch
function resetStopwatch() {
  clearInterval(interval);
  elapsed = 0;
  display.textContent = '00:00:00.000';
  startPauseBtn.innerHTML = '<i class="fas fa-play"></i> Start';
  lapBtn.disabled = true;
  isRunning = false;
  lapTimes = [];
  laps.innerHTML = '';
}

// Record a lap time
function recordLap() {
  if (isRunning) {
    const currentTime = Date.now() - startTime + elapsed;
    const lastLapTime = lapTimes.length > 0 ? lapTimes[lapTimes.length - 1].time : 0;
    const splitTime = currentTime - lastLapTime;
    
    lapTimes.push({
      lap: lapTimes.length + 1,
      time: currentTime,
      split: splitTime
    });
    
    renderLaps();
    
    // Send lap data to server (in a real app)
    // fetch('/api/lap', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     lap: lapTimes.length,
    //     time: currentTime,
    //     split: splitTime,
    //     timestamp: new Date()
    //   })
    // });
  }
}

// Render lap times
function renderLaps() {
  laps.innerHTML = '';
  
  lapTimes.forEach((lapData, index) => {
    const li = document.createElement('li');
    
    // Highlight the latest lap
    if (index === lapTimes.length - 1) {
      li.style.backgroundColor = 'rgba(0, 255, 170, 0.1)';
      li.style.fontWeight = 'bold';
    }
    
    li.innerHTML = `
      <span>${lapData.lap}</span>
      <span>${formatShortTime(lapData.time)}</span>
      <span>${formatShortTime(lapData.split)}</span>
    `;
    
    laps.appendChild(li);
  });
  
  // Auto-scroll to the latest lap
  if (laps.lastChild) {
    laps.lastChild.scrollIntoView({ behavior: 'smooth' });
  }
}

// Event listeners
startPauseBtn.addEventListener('click', toggleStartPause);
resetBtn.addEventListener('click', resetStopwatch);
lapBtn.addEventListener('click', recordLap);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    toggleStartPause();
  } else if (e.code === 'KeyL') {
    recordLap();
  } else if (e.code === 'KeyR') {
    resetStopwatch();
  }
});

// Initialize
resetStopwatch();