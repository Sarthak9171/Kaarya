class PomodoroTimer {
    constructor() {
        this.defaultWorkTime = 1 * 60; // 1 minute in seconds
        this.defaultBreakTime = 5 * 60; // 5 minutes in seconds
        this.workTime = this.defaultWorkTime;
        this.breakTime = this.defaultBreakTime;
        this.timeLeft = this.workTime;
        this.timer = null;
        this.isWorking = true;
        this.isRunning = false;
        
        // Create audio elements
        this.timerSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        this.timerSound.volume = 0.5;
        
        this.init();
    }

    init() {
        this.display = document.querySelector('.timer-display');
        document.getElementById('start-pomo').addEventListener('click', () => this.toggleTimer());
        document.getElementById('reset-pomo').addEventListener('click', () => this.resetTimer());
        document.getElementById('settings-save').addEventListener('click', () => this.saveSettings());
        
        // Initialize settings inputs
        document.getElementById('work-time').value = this.defaultWorkTime / 60;
        document.getElementById('break-time').value = this.defaultBreakTime / 60;
        
        this.updateDisplay();
    }

    toggleTimer() {
        if (this.isRunning) {
            this.pauseTimer();
        } else {
            this.startTimer();
        }
    }

    startTimer() {
        this.isRunning = true;
        document.getElementById('start-pomo').textContent = 'Pause';
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();
            
            if (this.timeLeft <= 0) {
                this.switchMode();
            }
        }, 1000);
    }

    pauseTimer() {
        this.isRunning = false;
        clearInterval(this.timer);
        document.getElementById('start-pomo').textContent = 'Resume';
    }

    resetTimer() {
        clearInterval(this.timer);
        this.isRunning = false;
        this.isWorking = true;
        this.timeLeft = this.workTime;
        document.getElementById('start-pomo').textContent = 'Start';
        this.updateDisplay();
    }

    switchMode() {
        clearInterval(this.timer);
        this.isWorking = !this.isWorking;
        this.timeLeft = this.isWorking ? this.workTime : this.breakTime;
        
        // Play sound when timer finishes
        this.playTimerSound();
        
        // Show notification when switching modes
        const message = this.isWorking ? 'Work Time!' : 'Break Time!';
        this.showNotification(message);
        
        this.startTimer();
    }

    playTimerSound() {
        // Reset the audio to start and play
        this.timerSound.currentTime = 0;
        this.timerSound.play().catch(error => {
            console.log('Audio play failed:', error);
        });
    }

    showNotification(message) {
        if (Notification.permission === 'granted') {
            new Notification('Pomodoro Timer', { body: message });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification('Pomodoro Timer', { body: message });
                }
            });
        }
    }

    saveSettings() {
        const newWorkTime = parseInt(document.getElementById('work-time').value);
        const newBreakTime = parseInt(document.getElementById('break-time').value);
        
        if (newWorkTime && newBreakTime) {
            this.workTime = newWorkTime * 60;
            this.breakTime = newBreakTime * 60;
            this.resetTimer();
            alert('Settings saved successfully!');
        } else {
            alert('Please enter valid times');
        }
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.display.textContent = 
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        // Update mode display
        const modeText = this.isWorking ? 'Work Time' : 'Break Time';
        document.querySelector('.timer-mode').textContent = modeText;
    }
}

// Request notification permission
if ('Notification' in window) {
    Notification.requestPermission();
}

new PomodoroTimer();
