// Генератор фраз Маями Чмо
const loxPhrases = [
    "Я не чмо, я уникальная личность!",
    "Чмо с характером - это сила!",
    "Сегодня я чмо, завтра - легенда!",
    "Маями учит: будь собой, даже если ты чмо!",
    "Чмом быть - это искусство!",
    "Чмо - это не приговор, это состояние души!",
    "Маями на пляже, солнце встает...",
    "Чмо с улыбкой - уже не просто чмо!",
    "Главное похуй!",
    "Best tourist on SVO"
];

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initFloatingElements();
    initLoxGenerator();
    initGame();
    initMemeGallery();
});

// Создаем плавающие элементы
function initFloatingElements() {
    const floatingElements = document.getElementById('floatingElements');
    const symbols = ['😎', '🤪', '🔥', '🌴', '🍹', '👑', '💰', '🤮'];
    
    for (let i = 0; i < 20; i++) {
        const element = document.createElement('div');
        element.className = 'floating-element';
        element.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        element.style.left = Math.random() * 100 + 'vw';
        element.style.animationDelay = Math.random() * 15 + 's';
        element.style.fontSize = (Math.random() * 2 + 1) + 'rem';
        floatingElements.appendChild(element);
    }
}

// Инициализация генератора фраз
function initLoxGenerator() {
    document.getElementById('generateLox').addEventListener('click', function() {
        const randomIndex = Math.floor(Math.random() * loxPhrases.length);
        document.getElementById('loxResult').textContent = loxPhrases[randomIndex];
        
        // Добавляем анимацию
        const resultElement = document.getElementById('loxResult');
        resultElement.style.transform = 'scale(1.1)';
        setTimeout(() => {
            resultElement.style.transform = 'scale(1)';
        }, 300);
    });
}

// Инициализация игры
function initGame() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const startButton = document.getElementById('startGame');
    
    let score = 0;
    let gameInterval;
    let loxX, loxY;
    let loxSize = 60;
    let currentImage = new Image();
    
    // Массив с путями к изображениям
    const imagePaths = [
        'img/1.jpg',
        'img/2.jpg', 
        'img/3.jpg',
        'img/4.jpg',
        'img/logo.jpg'
    ];
    
    function getRandomImage() {
        const randomIndex = Math.floor(Math.random() * imagePaths.length);
        currentImage.src = imagePaths[randomIndex];
    }
    
    function drawLox() {
        if (currentImage.complete && currentImage.naturalWidth !== 0) {
            // Рисуем изображение с закругленными углами
            ctx.save();
            ctx.beginPath();
            ctx.arc(loxX, loxY, loxSize, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
            
            ctx.drawImage(
                currentImage, 
                loxX - loxSize, 
                loxY - loxSize, 
                loxSize * 2, 
                loxSize * 2
            );
            ctx.restore();
            
            // Добавляем обводку
            ctx.beginPath();
            ctx.arc(loxX, loxY, loxSize, 0, Math.PI * 2);
            ctx.strokeStyle = '#ff00ff';
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            // Если изображение не загружено, рисуем запасной круг
            ctx.fillStyle = '#ff00ff';
            ctx.beginPath();
            ctx.arc(loxX, loxY, loxSize, 0, Math.PI * 2);
            ctx.fill();
            
            // Добавляем текст
            ctx.fillStyle = 'white';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('ЧМО', loxX, loxY + 5);
        }
    }
    
    function resetLox() {
        loxX = Math.random() * (canvas.width - loxSize * 2) + loxSize;
        loxY = Math.random() * (canvas.height - loxSize * 2) + loxSize;
        getRandomImage();
    }
    
    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawLox();
    }
    
    function handleClick(x, y) {
        // Проверяем, попал ли клик по чмо
        const distance = Math.sqrt((x - loxX) ** 2 + (y - loxY) ** 2);
        if (distance < loxSize) {
            score++;
            scoreElement.textContent = score;
            resetLox();
            
            // Добавляем визуальный эффект
            canvas.style.transform = 'scale(1.05)';
            setTimeout(() => {
                canvas.style.transform = 'scale(1)';
            }, 100);
        }
    }
    
    // Обработчик клика для десктопов
    canvas.addEventListener('click', function(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        
        handleClick(x, y);
    });
    
    // Обработчик касаний для мобильных устройств
    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        const x = (touch.clientX - rect.left) * scaleX;
        const y = (touch.clientY - rect.top) * scaleY;
        
        handleClick(x, y);
    }, { passive: false });
    
    // Кнопка начала игры
    startButton.addEventListener('click', function() {
        if (gameInterval) {
            clearInterval(gameInterval);
        }
        
        score = 0;
        scoreElement.textContent = score;
        resetLox();
        
        gameInterval = setInterval(gameLoop, 1000 / 30); // 30 FPS
        
        // Меняем текст кнопки
        startButton.textContent = 'Перезапустить игру';
    });
    
    // Адаптация размера canvas для мобильных устройств
    function resizeCanvas() {
        if (window.innerWidth <= 768) {
            canvas.width = Math.min(600, window.innerWidth - 40);
            canvas.height = 300;
        } else {
            canvas.width = 600;
            canvas.height = 400;
        }
        
        // Перерисовываем игру если она активна
        if (gameInterval) {
            resetLox();
        }
    }
    
    // Обработчик изменения размера окна
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Инициализация при загрузке
}

// Инициализация галереи мемов
function initMemeGallery() {
    const memeItems = document.querySelectorAll('.meme-item');
    
    memeItems.forEach(item => {
        item.addEventListener('click', function() {
            this.style.transform = 'scale(1.2) rotate(5deg)';
            setTimeout(() => {
                this.style.transform = 'scale(1) rotate(0deg)';
            }, 500);
        });
        
        // Добавляем ленивую загрузку для изображений
        const img = item.querySelector('img');
        if (img) {
            img.loading = 'lazy';
        }
    });
}

// Дополнительные функции для улучшения UX
function addSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

// Добавляем обработчик для кнопки "Наверх"
// function addBackToTop() {
//     const backToTop = document.createElement('button');
//     backToTop.textContent = '↑ Наверх';
//     backToTop.style.cssText = `
//         position: fixed;
//         bottom: 20px;
//         right: 20px;
//         background: linear-gradient(to right, #ff00ff, #00ffff);
//         border: none;
//         padding: 10px 15px;
//         border-radius: 50px;
//         color: white;
//         cursor: pointer;
//         display: none;
//         z-index: 1000;
//         font-weight: bold;
//     `;
    
//     document.body.appendChild(backToTop);
    
//     window.addEventListener('scroll', function() {
//         if (window.pageYOffset > 300) {
//             backToTop.style.display = 'block';
//         } else {
//             backToTop.style.display = 'none';
//         }
//     });
    
//     backToTop.addEventListener('click', function() {
//         window.scrollTo({
//             top: 0,
//             behavior: 'smooth'
//         });
//     });
// }

// Инициализация дополнительных функций
document.addEventListener('DOMContentLoaded', function() {
    addSmoothScrolling();
    addBackToTop();
});

// Анимация появления элементов при скролле
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    // Добавляем анимацию для карточек
    document.querySelectorAll('.card, .interactive-section').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Запускаем анимации при загрузке
document.addEventListener('DOMContentLoaded', initScrollAnimations);

// Функция для смены темы (дополнительная фича)
// function initThemeToggle() {
//     const themeToggle = document.createElement('button');
//     themeToggle.textContent = '🌙 Сменить тему';
//     themeToggle.style.cssText = `
//         position: fixed;
//         top: 20px;
//         right: 20px;
//         background: rgba(0,0,0,0.7);
//         border: 2px solid #ff00ff;
//         padding: 10px 15px;
//         border-radius: 50px;
//         color: white;
//         cursor: pointer;
//         z-index: 1000;
//         font-weight: bold;
//     `;
    
//     document.body.appendChild(themeToggle);
    
//     let isDarkTheme = true;
    
//     themeToggle.addEventListener('click', function() {
//         isDarkTheme = !isDarkTheme;
        
//         if (isDarkTheme) {
//             // Темная тема
//             document.body.style.background = 'linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d)';
//             themeToggle.textContent = '🌙 Сменить тему';
//         } else {
//             // Светлая тема
//             document.body.style.background = 'linear-gradient(135deg, #667eea, #764ba2, #f093fb)';
//             themeToggle.textContent = '☀️ Сменить тему';
//         }
//     });
// }

// // Инициализация переключателя темы
// document.addEventListener('DOMContentLoaded', initThemeToggle);