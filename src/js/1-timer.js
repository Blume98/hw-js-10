import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let countdownIntervalId = null;
const startButton = document.querySelector('[data-start]');
const datetimePicker = document.querySelector('#datetime-picker');
const timerFields = {
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};
let userSelectedDate = null;

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

startButton.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedTime = selectedDates[0].getTime();
    const currentTime = Date.now();

    if (selectedTime <= currentTime) {
      iziToast.show({
        title: '',
        message: 'Please choose a date in the future',
        position: 'topRight',
        backgroundColor: '#EF4040',
        titleColor: 'white',
        messageColor: 'white',
      });
      startButton.disabled = true;
      userSelectedDate = null;
    } else {
      startButton.disabled = false;
      userSelectedDate = selectedDates[0];
    }
  },
};

const fp = flatpickr('#datetime-picker', options);

startButton.addEventListener('click', () => {
  if (!userSelectedDate) {
    return;
  }

  startButton.disabled = true;
  datetimePicker.disabled = true;

  countdownIntervalId = setInterval(() => {
    const ms = userSelectedDate.getTime() - Date.now();
    if (ms <= 0) {
      clearInterval(countdownIntervalId);
      updateTimerUI(0);
      datetimePicker.disabled = false;
      return;
    }

    updateTimerUI(ms);
  }, 1000);
});

function updateTimerUI(ms) {
  const time = convertMs(ms);
  timerFields.days.textContent = addLeadingZero(time.days);
  timerFields.hours.textContent = addLeadingZero(time.hours);
  timerFields.minutes.textContent = addLeadingZero(time.minutes);
  timerFields.seconds.textContent = addLeadingZero(time.seconds);
}
