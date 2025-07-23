let startTime, interval, elapsed = 0;
const display = document.getElementById('display');
const startPauseBtn = document.getElementById('startPause');
const resetBtn = document.getElementById('reset');
const lapBtn = document.getElementById('lap');
const laps = document.getElementById('laps');

function formatTime(ms) {
  const date = new Date(ms);
  return `${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}:${String(date.getUTCSeconds()).padStart(2, '0')}.${String(date.getUTCMilliseconds()).padStart(3, '0')}`;
}

function updateTime() {
  const now = Date.now();
  display.textContent = formatTime(now - startTime + elapsed);
}

startPauseBtn.addEventListener('click', () => {
  if (startPauseBtn.textContent === 'Start') {
    startTime = Date.now();
    interval = setInterval(updateTime, 10);
    startPauseBtn.textContent = 'Pause';
  } else {
    clearInterval(interval);
    elapsed += Date.now() - startTime;
    startPauseBtn.textContent = 'Start';
  }
});

resetBtn.addEventListener('click', () => {
  clearInterval(interval);
  elapsed = 0;
  display.textContent = '00:00:00.000';
  startPauseBtn.textContent = 'Start';
  laps.innerHTML = '';
});

lapBtn.addEventListener('click', () => {
  if (startPauseBtn.textContent === 'Pause') {
    const li = document.createElement('li');
    li.textContent = `Lap ${laps.children.length + 1}: ${display.textContent}`;
    laps.appendChild(li);
  }
});
