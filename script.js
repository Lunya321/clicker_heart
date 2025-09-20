// Сохраняем ссылки на элементы
const counter = document.getElementById('counter');
const record = document.getElementById('record');
const clickBtn = document.getElementById('clickBtn');
const resetBtn = document.getElementById('resetBtn');
const heart = document.getElementById('heart');

// Инициализация счетчика
let count = 0;
let maxRecord = 0;

// Функция увеличения счетчика
function handleClick() {
    count++;
    counter.textContent = count;

    // Обновление рекорда
    if (count > maxRecord) {
        maxRecord = count;
        record.textContent = maxRecord;
    }

    // Активируем анимацию биения сердца
    heart.classList.add('heartbeat-active');

    // Снимаем анимацию через 200 мс
    setTimeout(() => {
        heart.classList.remove('heartbeat-active');
    }, 200);
}

// Назначаем обработчики событий
clickBtn.addEventListener('click', handleClick);
heart.addEventListener('click', handleClick);

// Сброс
resetBtn.addEventListener('click', () => {
    count = 0;
    counter.textContent = count;
});