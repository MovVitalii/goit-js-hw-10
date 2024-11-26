document.addEventListener('DOMContentLoaded', function () {
  const startButton = document.querySelector('[data-start]');
  const datetimePicker = document.querySelector('#datetime-picker');

  const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
      const userSelectedDate = selectedDates[0];
      window.selectedDate = userSelectedDate;
      checkDateValidity(userSelectedDate);
    },
  };

  flatpickr(datetimePicker, options);

  function checkDateValidity(selectedDate) {
    if (selectedDate && selectedDate < new Date()) {
      startButton.disabled = true;
      datetimePicker.disabled = false;
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
        timeout: 2000,
      });
    } else {
      startButton.disabled = false;
      datetimePicker.disabled = false;
    }
  }

  const initialSelectedDate = datetimePicker.value;
  if (initialSelectedDate) {
    checkDateValidity(new Date(initialSelectedDate));
  } else {
    startButton.disabled = true;
    datetimePicker.disabled = false;
  }

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

  startButton.addEventListener('click', function () {
    const selectedDate = window.selectedDate;
    if (!selectedDate) return;

    startButton.disabled = true;
    datetimePicker.disabled = true;

    const interval = setInterval(function () {
      const currentTime = new Date();
      const timeRemaining = selectedDate - currentTime;
      if (timeRemaining <= 0) {
        clearInterval(interval);
        startButton.disabled = false;
        datetimePicker.disabled = false;
        return;
      }

      const { days, hours, minutes, seconds } = convertMs(timeRemaining);
      document.querySelector('[data-days]').textContent = addLeadingZero(days);
      document.querySelector('[data-hours]').textContent =
        addLeadingZero(hours);
      document.querySelector('[data-minutes]').textContent =
        addLeadingZero(minutes);
      document.querySelector('[data-seconds]').textContent =
        addLeadingZero(seconds);
    }, 1000);
  });
});
