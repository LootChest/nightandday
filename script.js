document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');
    const scene = document.querySelector('.night-scene');
    const audio = document.getElementById('musicPlayer');
    const lyricsContainer = document.getElementById('lyricsContainer');
    const sceneContainer = document.querySelector('.night-scene');
    const moon = document.getElementById('moonImg');

    let currentLineIndex = -1;
    let starInterval = null;
    let stormInterval = null;
    let isFading = false;

    const lyricsData = [
        { time: 1.0, text: "Для тебя..." },
        { time: 5.0, text: "Я тебя очень сильно люблю, милая..." },
        { time: 15.0, text: "<3" },
        { time: 17.0, text: "Я сделаю всё ради наших отношений!" },
        { time: 25.0, text: "Поэтому пожалуйста, не опускай руки," },
        { time: 30.0, text: "Верь в меня..." },
        { time: 33.0, text: "Верь в нас..." },
        { time: 36.5, text: "Я знаю, что" },
        { time: 38.0, text: "Ты днями и ночами" },
        { time: 40.0, text: "В моём ТГ-канале" },
        { time: 42.0, text: "Рисуешь на экране" },
        { time: 44.0, text: "(Рисуешь ты слезами)", isTears: true },
        { time: 46.0, text: "Своей красной <span class='word-lipstick'>помадой</span>", isLipstick: true },
        { time: 48.0, text: "Забудь, что было с нами" },
        { time: 50.0, text: "Детка, любовь так <span class='word-wound'>ранит</span>...", isWound: true }
    ];

    function launchRandomStar(isStorm = false) {
        const star = document.createElement('div');
        star.classList.add('star-container');
        star.style.left = Math.random() * 100 + '%';
        star.style.top = (Math.random() * 20 - 10) + '%';
        const head = document.createElement('div');
        head.classList.add('star-head');
        const tail = document.createElement('div');
        tail.classList.add('star-tail');
        head.appendChild(tail);
        star.appendChild(head);
        sceneContainer.appendChild(star);
        const duration = isStorm ? 900 : 1800;
        const fly = star.animate([
            { transform: 'translate(0, 0)', opacity: 1 },
            { transform: `translate(${-window.innerWidth * 1.3}px, ${window.innerHeight * 1.6}px)`, opacity: 0 }
        ], { duration: duration, easing: 'linear' });
        fly.onfinish = () => star.remove();
    }

    function startStarCycle() {
        if (isFading) return;
        launchRandomStar(false);
        starInterval = setTimeout(startStarCycle, Math.random() * 5000 + 5000);
    }

    function createLyrics() {
        lyricsContainer.innerHTML = '';
        lyricsData.forEach((line, index) => {
            const p = document.createElement('p');
            p.innerHTML = line.text;
            p.classList.add('lyric-line');
            if (line.isTears) p.classList.add('lyric-line-tears');
            if (line.isLipstick) p.classList.add('lyric-line-lipstick');
            if (line.isWound) p.classList.add('lyric-line-wound');
            p.id = `line-${index}`;
            lyricsContainer.appendChild(p);
        });
    }

    audio.addEventListener('timeupdate', () => {
        const currentTime = audio.currentTime;

        // --- ФИНАЛ (60 сек) ---
        if (currentTime >= 60.0) {
            if (!isFading) {
                isFading = true;
                // Музыка больше не останавливается — просто отключаем визуальные эффекты
                clearTimeout(starInterval);
                if (stormInterval) clearInterval(stormInterval);
                
                lyricsContainer.style.transition = 'opacity 1s';
                lyricsContainer.style.opacity = '0';
                sceneContainer.classList.add('final-fade');
                
                moon.style.opacity = ''; 
                moon.style.transform = ''; 
                moon.classList.add('final-animation-active');

                setTimeout(() => {
                    const msg = document.getElementById('anniversaryMsg');
                    if (msg) {
                        msg.classList.add('show-final');
                    }
                }, 8500); 
            }
            return;
        }

        // --- Убираем последнюю строку до финала (чтобы не висела) ---
        if (currentTime > 54.0 && currentLineIndex === lyricsData.length - 1) {
            const lastLine = document.getElementById(`line-${currentLineIndex}`);
            if (lastLine && lastLine.classList.contains('active')) {
                lastLine.classList.replace('active', 'exit');
            }
            currentLineIndex = -1;
        }

        // Синхронизация текста
        let targetLineIndex = -1;
        for (let i = 0; i < lyricsData.length; i++) {
            if (currentTime >= lyricsData[i].time) targetLineIndex = i;
        }
        if (targetLineIndex !== currentLineIndex) {
            if (currentLineIndex !== -1) {
                const prev = document.getElementById(`line-${currentLineIndex}`);
                if (prev) prev.classList.replace('active', 'exit');
            }
            if (targetLineIndex !== -1) {
                const curr = document.getElementById(`line-${targetLineIndex}`);
                if (curr) curr.classList.add('active');
            }
            currentLineIndex = targetLineIndex;
        }

        // Эффект шторма
        if (currentTime >= 38.0 && currentTime < 60.0) {
            if (!stormInterval) {
                stormInterval = setInterval(() => launchRandomStar(true), 100);
                scene.classList.add('storm-active');
            }
        }
    });

    createLyrics();

    startBtn.addEventListener('click', () => {
        audio.volume = 1;
        audio.play().then(() => {
            startBtn.style.display = 'none';
            scene.classList.add('active');
            startStarCycle();
        }).catch(err => console.log("Ошибка:", err));
    });
});