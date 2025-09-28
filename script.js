// Сохраняем ссылки на элементы
const counter = document.getElementById('counter');
const record = document.getElementById('record');
const heart = document.getElementById('heart');
const resetBtn = document.getElementById('resetBtn');
const farmBtn = document.getElementById('farmBtn');
const upgradeFarmBtn = document.getElementById('upgradeFarmBtn');
const farmCountDisplay = document.getElementById('farmCount');
const currentLevelDisplay = document.getElementById('currentLevel');
const upgradeList = document.getElementById('upgradeList');

const saveRecordBtn = document.getElementById('saveRecordBtn');
const leaderboardList = document.getElementById('leaderboardList');
const themeSelect = document.getElementById('themeSelect');
const container = document.querySelector('.container');

const infoBtn = document.getElementById('infoBtn');
const statsBtn = document.getElementById('statsBtn');
const modal = document.getElementById('infoModal');
const closeBtn = document.querySelector('#infoModal .close-btn');

// Элементы для статистики
const totalClicksDisplay = document.getElementById('totalClicks');
const farmCountStatDisplay = document.getElementById('farmCountStat');
const upgradesCountDisplay = document.getElementById('upgradesCount');
const gameTimeDisplay = document.getElementById('gameTime');
const clicksPerSecondDisplay = document.getElementById('clicksPerSecond');

// Загрузка данных из localStorage
let count = parseInt(localStorage.getItem('count')) || 0;
let maxRecord = parseInt(localStorage.getItem('maxRecord')) || 0;
let farmCount = parseInt(localStorage.getItem('farmCount')) || 0;
let farmLevel = parseInt(localStorage.getItem('farmLevel')) || 0;

let totalClicks = parseInt(localStorage.getItem('totalClicks')) || 0;
let upgradesCount = parseInt(localStorage.getItem('upgradesCount')) || 0;
let gameStartTime = localStorage.getItem('gameStartTime') ? parseInt(localStorage.getItem('gameStartTime')) : Date.now();

// Обновляем интерфейс при загрузке
counter.textContent = count;
record.textContent = maxRecord;
farmCountDisplay.textContent = farmCount;
currentLevelDisplay.textContent = farmLevel + 1;
totalClicksDisplay.textContent = totalClicks;
farmCountStatDisplay.textContent = farmCount;
upgradesCountDisplay.textContent = upgradesCount;
clicksPerSecondDisplay.textContent = farmCount;

// Определяем уровни улучшений фарма
const farmUpgrades = [
    { level: 1, cost: 100, gain: 1 },
    { level: 2, cost: 1000, gain: 2 },
    { level: 3, cost: 5000, gain: 5 },
    { level: 4, cost: 10000, gain: 10 },
    { level: 5, cost: 20000, gain: 20 }
];

// Показываем список уровней
farmUpgrades.forEach((upgrade) => {
    const li = document.createElement('li');
    li.textContent = `Ур. ${upgrade.level}: +${upgrade.gain}/сек за ${upgrade.cost}`;
    upgradeList.appendChild(li);
});

// Функция увеличения счетчика
function handleClick() {
    count++;
    counter.textContent = count;
    totalClicks++;

    // Обновление рекорда
    if (count > maxRecord) {
        maxRecord = count;
        record.textContent = maxRecord;
    }

    // Анимация сердца
    heart.classList.add('heartbeat-active');
    setTimeout(() => {
        heart.classList.remove('heartbeat-active');
    }, 200);

    saveToLocalStorage();
    totalClicksDisplay.textContent = totalClicks;
    clicksPerSecondDisplay.textContent = farmCount;
}

// Сохранение в localStorage
function saveToLocalStorage() {
    localStorage.setItem('count', count);
    localStorage.setItem('maxRecord', maxRecord);
    localStorage.setItem('farmCount', farmCount);
    localStorage.setItem('farmLevel', farmLevel);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    localStorage.setItem('totalClicks', totalClicks);
    localStorage.setItem('upgradesCount', upgradesCount);
    localStorage.setItem('gameStartTime', gameStartTime);
}

// Обработка сохранения рекорда
function saveRecord() {
    const name = prompt("Введите ваш никнейм для сохранения рекорда:", "");

    if (name && name.trim() !== "") {
        leaderboard.push({ name, score: count });
        updateLeaderboard();
        alert(`Рекорд ${count} сохранён под никнеймом "${name}"!`);
    } else {
        alert("Вы не ввели никнейм.");
    }
}

// Обновление таблицы лидеров
function updateLeaderboard() {
    leaderboard = leaderboard.sort((a, b) => b.score - a.score).slice(0, 10);

    leaderboardList.innerHTML = '';
    leaderboard.forEach((entry, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${entry.name} - ${entry.score}`;
        leaderboardList.appendChild(li);
    });

    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

// Переключение тем
themeSelect.addEventListener('change', () => {
    const selectedTheme = themeSelect.value;

    // Удаляем старые классы тем
    container.classList.remove('dark-theme', 'light-theme', 'fruit-theme', 'ocean-theme', 'hacker-theme');

    // Добавляем новую тему
    container.classList.add(`${selectedTheme}-theme`);

    // Сохраняем в localStorage
    localStorage.setItem('appTheme', selectedTheme);
});

// Обработка кнопки "Статистика"
statsBtn.addEventListener('click', () => {
    totalClicksDisplay.textContent = totalClicks;
    farmCountStatDisplay.textContent = farmCount;
    upgradesCountDisplay.textContent = upgradesCount;
    clicksPerSecondDisplay.textContent = farmCount;
    gameTimeDisplay.textContent = updateGameTime();
});

// Назначаем обработчики событий
heart.addEventListener('click', handleClick);
saveRecordBtn.addEventListener('click', saveRecord);

// Сброс
resetBtn.addEventListener('click', () => {
    count = 0;
    counter.textContent = count;

    if (count > maxRecord) {
        maxRecord = count;
    }

    record.textContent = maxRecord;

    saveToLocalStorage();
});

// Купить фарм
farmBtn.addEventListener('click', () => {
    if (count >= 100) {
        count -= 100;
        counter.textContent = count;
        farmCount += 1;
        farmCountDisplay.textContent = farmCount;
        saveToLocalStorage();

        alert("Вы купили фарм! Теперь вы получаете +1 клик в секунду.");
        farmCountStatDisplay.textContent = farmCount;
        clicksPerSecondDisplay.textContent = farmCount;
    } else {
        alert("Недостаточно кликов (нужно минимум 100).");
    }
});

// Улучшить фарм
upgradeFarmBtn.addEventListener('click', () => {
    const nextLevel = farmLevel + 1;
    if (nextLevel >= farmUpgrades.length) {
        alert("Вы достигли максимального уровня фарма!");
        return;
    }

    const upgrade = farmUpgrades[nextLevel];
    if (count >= upgrade.cost) {
        count -= upgrade.cost;
        counter.textContent = count;
        farmCount += upgrade.gain;
        farmCountDisplay.textContent = farmCount;
        farmLevel = nextLevel;
        currentLevelDisplay.textContent = nextLevel + 1;
        saveToLocalStorage();

        alert(`Вы улучшили фарм до уровня ${nextLevel + 1}! Теперь вы получаете +${upgrade.gain} клика в секунду.`);
        upgradesCount++;
        upgradesCountDisplay.textContent = upgradesCount;
        clicksPerSecondDisplay.textContent = farmCount;
    } else {
        alert(`Недостаточно кликов для улучшения до уровня ${nextLevel + 1} (нужно ${upgrade.cost}).`);
    }
});

// Автоматический фарм каждую секунду
setInterval(() => {
    if (farmCount > 0) {
        count += farmCount;
        counter.textContent = count;

        if (count > maxRecord) {
            maxRecord = count;
            record.textContent = maxRecord;
        }

        saveToLocalStorage();
    }
}, 1000);

// Обновление времени игры
function updateGameTime() {
    const now = Date.now();
    const elapsed = Math.floor((now - gameStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Обновляем время каждую секунду
setInterval(() => {
    gameTimeDisplay.textContent = updateGameTime();
}, 1000);
gameTimeDisplay.textContent = updateGameTime(); // Вызов сразу после загрузки

// Открыть модальное окно с информацией
infoBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});

// Закрыть модальное окно с информацией
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Закрыть модальное окно при клике вне окна
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Инициализация таблицы лидеров при загрузке
updateLeaderboard();

// Загрузка темы из localStorage
let savedTheme = localStorage.getItem('appTheme') || 'dark';
document.querySelector('.container').classList.add(`${savedTheme}-theme`);
