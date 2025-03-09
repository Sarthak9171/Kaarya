class AlarmClock {
    constructor() {
        this.alarms = JSON.parse(localStorage.getItem('alarms')) || [];
        this.alarmSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        this.alarmSound.loop = true;
        this.init();
    }

    init() {
        // Initialize selectors
        this.hourSelect = document.getElementById('alarm-hour');
        this.minuteSelect = document.getElementById('alarm-minute');
        this.periodSelect = document.getElementById('alarm-period');
        this.timePreview = document.querySelector('.time-preview');
        
        // Populate time options
        this.populateHours();
        this.populateMinutes();
        
        // Add event listeners
        document.getElementById('set-alarm').addEventListener('click', () => this.setAlarm());
        document.getElementById('clear-alarm').addEventListener('click', () => this.clearInput());
        
        // Add change listeners for preview
        [this.hourSelect, this.minuteSelect, this.periodSelect].forEach(select => {
            select.addEventListener('change', () => this.updateTimePreview());
        });

        // Start checking alarms
        this.startAlarmChecker();
        
        // Render existing alarms
        this.render();
    }

    populateHours() {
        for (let i = 1; i <= 12; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i.toString().padStart(2, '0');
            this.hourSelect.appendChild(option);
        }
    }

    populateMinutes() {
        for (let i = 0; i < 60; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i.toString().padStart(2, '0');
            this.minuteSelect.appendChild(option);
        }
    }

    updateTimePreview() {
        const hour = this.hourSelect.value;
        const minute = this.minuteSelect.value;
        const period = this.periodSelect.value;
        
        if (hour && minute) {
            this.timePreview.textContent = 
                `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${period}`;
        } else {
            this.timePreview.textContent = '';
        }
    }

    setAlarm() {
        const hour = parseInt(this.hourSelect.value);
        const minute = parseInt(this.minuteSelect.value);
        const period = this.periodSelect.value;
        
        if (!hour || isNaN(minute)) {
            this.showError('Please select a valid time');
            return;
        }

        const now = new Date();
        let alarmTime = new Date();
        
        // Set alarm time
        let alarmHour = hour;
        if (period === 'PM' && hour !== 12) alarmHour += 12;
        if (period === 'AM' && hour === 12) alarmHour = 0;
        
        alarmTime.setHours(alarmHour, minute, 0, 0);
        
        // If alarm time is in the past, set it for next day
        if (alarmTime < now) {
            alarmTime.setDate(alarmTime.getDate() + 1);
        }
        
        const alarm = {
            id: Date.now(),
            hour,
            minute,
            period,
            timestamp: alarmTime.getTime(),
            enabled: true
        };
        
        this.alarms.push(alarm);
        this.saveAlarms();
        this.clearInput();
        this.render();
        
        this.showSuccess('Alarm set successfully!');
    }

    clearInput() {
        this.hourSelect.value = '';
        this.minuteSelect.value = '';
        this.periodSelect.value = 'AM';
        this.timePreview.textContent = '';
    }

    toggleAlarm(id) {
        const alarm = this.alarms.find(a => a.id === id);
        if (alarm) {
            alarm.enabled = !alarm.enabled;
            this.saveAlarms();
            this.render();
        }
    }

    deleteAlarm(id) {
        this.alarms = this.alarms.filter(a => a.id !== id);
        this.saveAlarms();
        this.render();
    }

    saveAlarms() {
        localStorage.setItem('alarms', JSON.stringify(this.alarms));
    }

    startAlarmChecker() {
        setInterval(() => {
            const now = new Date();
            
            this.alarms.forEach(alarm => {
                if (!alarm.enabled) return;
                
                const alarmTime = new Date(alarm.timestamp);
                
                // Check if alarm should trigger
                if (now >= alarmTime) {
                    this.triggerAlarm(alarm);
                    
                    // Set next day's alarm
                    alarm.timestamp = new Date(alarmTime.setDate(alarmTime.getDate() + 1)).getTime();
                }
            });
            
            this.saveAlarms();
        }, 1000);
    }

    triggerAlarm(alarm) {
        // Show notification
        if (Notification.permission === 'granted') {
            new Notification('Alarm!', {
                body: `It's ${alarm.hour}:${alarm.minute.toString().padStart(2, '0')} ${alarm.period}`,
                icon: '/alarm-icon.png'
            });
        }
        
        // Play sound
        this.alarmSound.play();
        
        // Show alert with stop button
        const stopAlarm = confirm('Alarm! Click OK to stop the alarm.');
        if (stopAlarm) {
            this.alarmSound.pause();
            this.alarmSound.currentTime = 0;
        }
    }

    showError(message) {
        this.timePreview.textContent = message;
        this.timePreview.style.color = 'var(--danger)';
        setTimeout(() => {
            this.timePreview.style.color = 'var(--text-secondary)';
            this.updateTimePreview();
        }, 3000);
    }

    showSuccess(message) {
        this.timePreview.textContent = message;
        this.timePreview.style.color = 'var(--success)';
        setTimeout(() => {
            this.timePreview.style.color = 'var(--text-secondary)';
            this.timePreview.textContent = '';
        }, 3000);
    }

    render() {
        const alarmsList = document.getElementById('alarms-list');
        alarmsList.innerHTML = '';
        
        if (this.alarms.length === 0) {
            alarmsList.innerHTML = `
                <div class="empty-state">
                    <p>No alarms set. Add an alarm to get started!</p>
                </div>
            `;
            return;
        }
        
        this.alarms.sort((a, b) => a.timestamp - b.timestamp).forEach(alarm => {
            const li = document.createElement('li');
            li.className = 'alarm-item';
            
            const alarmTime = new Date(alarm.timestamp);
            const timeString = alarmTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
            
            li.innerHTML = `
                <div class="alarm-content">
                    <div class="alarm-time">
                        <div class="time-display">${timeString}</div>
                        <div class="time-period">Next: ${alarmTime.toLocaleDateString()}</div>
                    </div>
                </div>
                <div class="alarm-controls">
                    <label class="switch">
                        <input type="checkbox" ${alarm.enabled ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                    <button class="delete-alarm">×</button>
                </div>
            `;
            
            // Add event listeners
            const toggle = li.querySelector('input[type="checkbox"]');
            toggle.addEventListener('change', () => this.toggleAlarm(alarm.id));
            
            const deleteBtn = li.querySelector('.delete-alarm');
            deleteBtn.addEventListener('click', () => this.deleteAlarm(alarm.id));
            
            alarmsList.appendChild(li);
        });
    }
}

// Request notification permission
if ('Notification' in window) {
    Notification.requestPermission();
}

new AlarmClock();
