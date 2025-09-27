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

const nicknameForm = document.getElementById('nicknameForm');
const nicknameInput = document.getElementById('nicknameInput');
const submitNicknameBtn = document.getElementById('submitNickname');
const leaderboardList = document.getElementById('leaderboardList');

const infoBtn = document.getElementById('infoBtn');
const modal = document.getElementById('infoModal');
const closeBtn = document.querySelector('.close-btn');

// Загрузка данных из localStorage
let count = parseInt(localStorage.getItem('count')) || 0;
let maxRecord = parseInt(localStorage.getItem('maxRecord')) || 0;
let farmCount = parseInt(localStorage.getItem('farmCount')) || 0;
let farmLevel = parseInt(localStorage.getItem('farmLevel')) || 0;

// Загрузка таблицы лидеров
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

// Обновляем интерфейс при загрузке
counter.textContent = count;
record.textContent = maxRecord;
farmCountDisplay.textContent = farmCount;
currentLevelDisplay.textContent = farmLevel + 1;

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

    // Обновление рекорда
    if (count > maxRecord) {
        maxRecord = count;
        record.textContent = maxRecord;
        checkRecord(); // Проверяем рекорд и открываем форму
    }

    // Анимация сердца
    heart.classList.add('heartbeat-active');
    setTimeout(() => {
        heart.classList.remove('heartbeat-active');
    }, 200);

    saveToLocalStorage();
}

// Сохранение в localStorage
function saveToLocalStorage() {
    localStorage.setItem('count', count);
    localStorage.setItem('maxRecord', maxRecord);
    localStorage.setItem('farmCount', farmCount);
    localStorage.setItem('farmLevel', farmLevel);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

// Проверка рекорда и открытие формы
function checkRecord() {
    nicknameForm.style.display = 'block';
    nicknameInput.focus();
}

// Обработка подтверждения никнейма
submitNicknameBtn.addEventListener('click', () => {
    const name = nicknameInput.value.trim();
    if (name && count > 0) {
        leaderboard.push({ name, score: count });
        nicknameForm.style.display = 'none';
        nicknameInput.value = '';
        updateLeaderboard();
    } else {
        alert("Введите никнейм!");
    }
});

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

// Назначаем обработчики событий
heart.addEventListener('click', handleClick);

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

// Открыть модальное окно
infoBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});

// Закрыть модальное окно
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
