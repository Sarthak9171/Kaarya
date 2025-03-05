class AlarmClock {
    constructor() {
        this.alarms = JSON.parse(localStorage.getItem('alarms')) || [];
        this.hourSelect = document.getElementById('alarm-hour');
        this.minuteSelect = document.getElementById('alarm-minute');
        this.periodSelect = document.getElementById('alarm-period');
        this.timePreview = document.querySelector('.time-preview');
        this.init();
    }

    init() {
        this.populateTimeOptions();
        document.getElementById('set-alarm').addEventListener('click', () => this.setAlarm());
        document.getElementById('clear-alarm').addEventListener('click', () => this.clearInputs());
        this.addInputListeners();
        this.checkAlarms();
        this.render();
    }

    populateTimeOptions() {
        // Populate hours (1-12)
        for (let i = 1; i <= 12; i++) {
            const option = document.createElement('option');
            option.value = i.toString().padStart(2, '0');
            option.text = i.toString().padStart(2, '0');
            this.hourSelect.appendChild(option);
        }

        // Populate minutes (00-59)
        for (let i = 0; i < 60; i++) {
            const option = document.createElement('option');
            option.value = i.toString().padStart(2, '0');
            option.text = i.toString().padStart(2, '0');
            this.minuteSelect.appendChild(option);
        }
    }

    addInputListeners() {
        [this.hourSelect, this.minuteSelect, this.periodSelect].forEach(input => {
            input.addEventListener('change', () => this.updateTimePreview());
        });
    }

    /*
    updateTimePreview() {
        if (this.hourSelect.value && this.minuteSelect.value) {
            this.timePreview.textContent = `Alarm set for: ${this.hourSelect.value}:${this.minuteSelect.value} ${this.periodSelect.value}`;
        } else {
            this.timePreview.textContent = '';
        }
    }
    */

    setAlarm() {
        if (!this.validateInputs()) return;

        const time24 = this.convertTo24HourFormat(
            this.hourSelect.value,
            this.minuteSelect.value,
            this.periodSelect.value
        );

        if (this.alarms.includes(time24)) {
            this.showValidationError('This alarm already exists!');
            return;
        }

        // if (this.isPastTime(time24)) {
        //     this.showValidationError('This time has already passed today!');
        //     return;
        // }

        this.alarms.push(time24);
        this.save();
        this.render();
        this.clearInputs();
        this.showSuccessFeedback();
    }

    validateInputs() {
        let isValid = true;
        [this.hourSelect, this.minuteSelect].forEach(select => {
            if (!select.value) {
                select.classList.add('invalid');
                isValid = false;
            } else {
                select.classList.remove('invalid');
            }
        });
        return isValid;
    }

    convertTo24HourFormat(hours, minutes, period) {
        let hour24 = parseInt(hours);
        if (period === 'PM' && hour24 < 12) hour24 += 12;
        if (period === 'AM' && hour24 === 12) hour24 = 0;
        return `${hour24.toString().padStart(2, '0')}:${minutes}`;
    }

    isPastTime(time24) {
        const now = new Date();
        const [alarmHours, alarmMinutes] = time24.split(':');
        const alarmDate = new Date();
        alarmDate.setHours(alarmHours, alarmMinutes, 0, 0);
        return alarmDate < now;
    }

    showValidationError(message) {
        this.timePreview.textContent = message;
        this.timePreview.style.color = 'var(--danger)';
        setTimeout(() => {
            this.timePreview.style.color = '#64748b';
        }, 2000);
    }

    /*
    showSuccessFeedback() {
        this.timePreview.textContent = 'Alarm set successfully!';
        this.timePreview.style.color = 'var(--success)';
        setTimeout(() => {
            this.timePreview.style.color = '#64748b';
            this.timePreview.textContent = '';
        }, 2000);
    }
    */

    clearInputs() {
        this.hourSelect.value = '';
        this.minuteSelect.value = '';
        this.periodSelect.value = 'AM';
        this.timePreview.textContent = '';
        [this.hourSelect, this.minuteSelect].forEach(select => {
            select.classList.remove('invalid');
        });
    }

    render() {
        const list = document.getElementById('alarms-list');
        list.innerHTML = this.alarms.length > 0 ? 
            this.alarms.map((time24, index) => {
                const [hours, minutes] = time24.split(':');
                const period = hours >= 12 ? 'PM' : 'AM';
                const displayHours = hours % 12 || 12;
                return `
                <li class="alarm-item">
                    <div class="alarm-content">
                        <span class="alarm-icon">⏰</span>
                        <div class="alarm-time">
                            <span class="time-display">${displayHours}:${minutes}</span>
                            <span class="time-period">${period}</span>
                        </div>
                    </div>
                    <div class="alarm-controls">
                        <label class="switch">
                            <input type="checkbox" checked>
                            <span class="slider"></span>
                        </label>
                        <button data-index="${index}" class="delete-alarm">🗑️</button>
                    </div>
                </li>
                `;
            }).join('') : 
            '<div class="empty-state">⏰<br>No alarms set!<br>Set your first alarm above</div>';

        document.querySelectorAll('.delete-alarm').forEach(button => {
            button.addEventListener('click', (e) => this.deleteAlarm(e.target.dataset.index));
        });
    }

    deleteAlarm(index) {
        this.alarms.splice(index, 1);
        this.save();
        this.render();
    }

    checkAlarms() {
        setInterval(() => {
            const now = new Date();
            const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            if (this.alarms.includes(currentTime)) {
                alert(`⏰ Alarm! It's ${currentTime}`);
                this.alarms = this.alarms.filter(t => t !== currentTime);
                this.save();
                this.render();
            }
        }, 1000);
    }

    save() {
        localStorage.setItem('alarms', JSON.stringify(this.alarms));
    }
}

new AlarmClock();
