document.addEventListener('DOMContentLoaded', function () {
  // Отримуємо кнопку "Start"
  const startButton = document.querySelector('[data-start]');

  // Налаштування flatpickr
  const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
      const userSelectedDate = selectedDates[0];

      // Перевіряємо дату на коректність
      checkDateValidity(userSelectedDate);
    },
  };

  // Ініціалізуємо flatpickr
  flatpickr('#datetime-picker', options);

  // Функція для перевірки коректності дати та оновлення кнопки
  function checkDateValidity(selectedDate) {
    if (selectedDate && selectedDate < new Date()) {
      // Якщо дата в минулому, заблокувати кнопку
      startButton.disabled = true;

      // Показуємо повідомлення про помилку
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
        timeout: 2000,
      });
    } else {
      // Якщо дата в майбутньому, активуємо кнопку
      startButton.disabled = false;
    }
  }

  // Перевірка дати при завантаженні сторінки
  const initialSelectedDate = document.querySelector('#datetime-picker').value;
  if (initialSelectedDate) {
    checkDateValidity(new Date(initialSelectedDate));
  } else {
    startButton.disabled = true; // Якщо дата не вибрана, кнопка заблокована
  }

  // Функція для додавання нулів до чисел
  function addLeadingZero(value) {
    return String(value).padStart(2, '0');
  }

  // Функція для конвертації мілісекунд
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

  // Обробник події для кнопки "Start"
  startButton.addEventListener('click', function () {
      const selectedDateValue = document.querySelector('#datetime-picker').value;
      const selectedDate = new Date(selectedDateValue);
      const interval = setInterval(function () {
      const currentTime = new Date();
      const timeRemaining = selectedDate - currentTime;
      if (timeRemaining <= 0) {
        clearInterval(interval);
        startButton.disabled = false; // Активуємо кнопку, коли час спливає
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
