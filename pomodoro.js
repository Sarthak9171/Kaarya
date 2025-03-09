class PomodoroTimer {
    constructor() {
        this.defaultWorkTime = 25 * 60; // 25 minutes in seconds
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
        
        // Initialize controls
        document.getElementById('start-pomo').addEventListener('click', () => this.toggleTimer());
        document.getElementById('reset-pomo').addEventListener('click', () => this.resetTimer());
        
        // Initialize mode tabs
        const modeTabs = document.querySelectorAll('.mode-tab');
        modeTabs.forEach(tab => {
            tab.addEventListener('click', () => this.handleModeChange(tab.dataset.mode));
        });
        
        // Initialize settings
        const workTimeInput = document.getElementById('work-time');
        const breakTimeInput = document.getElementById('break-time');
        
        workTimeInput.addEventListener('change', () => this.handleSettingChange());
        breakTimeInput.addEventListener('change', () => this.handleSettingChange());
        
        // Set initial values
        workTimeInput.value = this.defaultWorkTime / 60;
        breakTimeInput.value = this.defaultBreakTime / 60;
        
        this.updateDisplay();
    }

    handleModeChange(mode) {
        if (this.isRunning) {
            if (!confirm('Timer is running. Switch modes?')) return;
            this.pauseTimer();
        }
        
        this.isWorking = mode === 'work';
        this.timeLeft = this.isWorking ? this.workTime : this.breakTime;
        
        // Update UI
        document.querySelectorAll('.mode-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.mode === mode);
        });
        
        this.updateDisplay();
    }

    handleSettingChange() {
        const newWorkTime = parseInt(document.getElementById('work-time').value);
        const newBreakTime = parseInt(document.getElementById('break-time').value);
        
        if (newWorkTime && newBreakTime) {
            this.workTime = newWorkTime * 60;
            this.breakTime = newBreakTime * 60;
            
            if (!this.isRunning) {
                this.timeLeft = this.isWorking ? this.workTime : this.breakTime;
                this.updateDisplay();
            }
        }
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
        document.getElementById('start-pomo').textContent = 'Start';
    }

    resetTimer() {
        clearInterval(this.timer);
        this.isRunning = false;
        this.timeLeft = this.isWorking ? this.workTime : this.breakTime;
        document.getElementById('start-pomo').textContent = 'Start';
        this.updateDisplay();
    }

    switchMode() {
        clearInterval(this.timer);
        this.isWorking = !this.isWorking;
        this.timeLeft = this.isWorking ? this.workTime : this.breakTime;
        
        // Update mode tabs
        document.querySelectorAll('.mode-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.mode === (this.isWorking ? 'work' : 'break'));
        });
        
        // Play sound and show notification
        this.playTimerSound();
        const message = this.isWorking ? 'Work Time!' : 'Break Time!';
        this.showNotification(message);
        
        this.startTimer();
    }

    playTimerSound() {
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

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.display.textContent = 
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}

// Request notification permission
if ('Notification' in window) {
    Notification.requestPermission();
}

new PomodoroTimer();
