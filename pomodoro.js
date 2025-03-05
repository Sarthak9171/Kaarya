class PomodoroTimer {
    constructor() {
        this.workTime = 25 * 60; // 25 minutes in seconds
        this.breakTime = 5 * 60; // 5 minutes in seconds
        this.timeLeft = this.workTime;
        this.timer = null;
        this.isWorking = true;
        this.isRunning = false;
        this.init();
    }

    init() {
        this.display = document.querySelector('.timer-display');
        document.getElementById('start-pomo').addEventListener('click', () => this.toggleTimer());
        document.getElementById('reset-pomo').addEventListener('click', () => this.resetTimer());
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
        this.startTimer();
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.display.textContent = 
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}

new PomodoroTimer();
