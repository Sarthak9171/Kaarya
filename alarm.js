class AlarmClock {
    constructor() {
        this.alarms = JSON.parse(localStorage.getItem('alarms')) || [];
        this.init();
        this.populateTimeSelectors();
        this.startTimeUpdates();
        this.render();
    }

    init() {
        // Initialize selectors
        this.hourSelect = document.getElementById('alarm-hour');
        this.minuteSelect = document.getElementById('alarm-minute');
        this.periodSelect = document.getElementById('alarm-period');
        this.timePreview = document.querySelector('.time-preview');
        
        // Add event listeners
        document.getElementById('set-alarm').addEventListener('click', () => this.setAlarm());
        document.getElementById('clear-alarm').addEventListener('click', () => this.clearInput());
        
        // Add change listeners for preview
        [this.hourSelect, this.minuteSelect, this.periodSelect].forEach(select => {
            select.addEventListener('change', () => this.updateTimePreview());
        });
    }

    populateTimeSelectors() {
        // Populate hours
        for (let i = 1; i <= 12; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i.toString().padStart(2, '0');
            this.hourSelect.appendChild(option);
        }
        
        // Populate minutes
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
            alert('Please select a valid time');
            return;
        }
        
        const alarm = {
            id: Date.now(),
            hour,
            minute,
            period,
            enabled: true
        };
        
        this.alarms.push(alarm);
        this.saveAlarms();
        this.clearInput();
        this.render();
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

    startTimeUpdates() {
        setInterval(() => {
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            
            this.alarms.forEach(alarm => {
                if (!alarm.enabled) return;
                
                let alarmHour = alarm.hour;
                if (alarm.period === 'PM' && alarmHour !== 12) {
                    alarmHour += 12;
                } else if (alarm.period === 'AM' && alarmHour === 12) {
                    alarmHour = 0;
                }
                
                if (currentHour === alarmHour && currentMinute === alarm.minute) {
                    this.triggerAlarm(alarm);
                }
            });
        }, 1000);
    }

    triggerAlarm(alarm) {
        const notification = new Notification('Alarm!', {
            body: `It's ${alarm.hour}:${alarm.minute.toString().padStart(2, '0')} ${alarm.period}`,
            icon: '/alarm-icon.png'
        });
        
        // Play sound
        const audio = new Audio('/alarm-sound.mp3');
        audio.play();
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
        
        this.alarms.forEach(alarm => {
            const li = document.createElement('li');
            li.className = 'alarm-item';
            
            li.innerHTML = `
                <div class="alarm-content">
                    <div class="alarm-time">
                        <div class="time-display">
                            ${alarm.hour.toString().padStart(2, '0')}:${alarm.minute.toString().padStart(2, '0')}
                        </div>
                        <div class="time-period">${alarm.period}</div>
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
