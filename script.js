document.addEventListener("DOMContentLoaded", () => {
    const words = [
        { text: "منْ نعمة", rule: "إظهار", audio: "audio/izhar.mp3" },
        { text: "منْ ولي", rule: "إدغام", audio: "audio/idgham.mp3" },
        { text: "أنْفقوا", rule: "إخفاء", audio: "audio/ikhfa.mp3" },
        { text: "أنْبئهم", rule: "إقلاب", audio: "audio/qalb.mp3" }
    ];

    const rules = ["إدغام", "إقلاب", "إظهار", "إخفاء"];

    const wordsContainer = document.querySelector(".words");
    const rulesContainer = document.querySelector(".rules");
    const alertContainer = document.getElementById("alert-container");
    const startButton = document.getElementById('start-game-button');
    const gameContainer = document.getElementById('game-container');

    let score = 0;
    let timer;
    let timeLeft = 60; // 60 ثانية
    let wordsMatched = 0;
    let incorrectTries = 0;
    const maxIncorrectTries = 3;

    function updateScore() {
        document.getElementById("score").textContent = `الدرجة: ${score}`;
    }

    startButton.addEventListener('click', () => {
        startButton.style.display = 'none';
        gameContainer.style.display = 'block';
        startTimer(); // بدء العداد عند النقر على زر "ابدأ اللعبة"
    });

    function startTimer() {
        timer = setInterval(() => {
            timeLeft--;
            document.getElementById("timer").textContent = `الوقت المتبقي: ${timeLeft} ثانية`;
            if (timeLeft <= 0) {
                clearInterval(timer);
                if (wordsMatched === words.length) {
                    showReward("تهانينا! لقد أكملت اللعبة بنجاح!", "audio/success.mp3");
                } else {
                    showAlert("انتهى الوقت!", "danger", "audio/error1.mp3");
                }
                disableGame();
            }
        }, 1000);
    }

    function disableGame() {
        const draggables = document.querySelectorAll(".draggable");
        draggables.forEach(item => {
            item.draggable = false;
        });
    }

    function showReward(message, audioFile) {
        $('#rewardModal').modal('show');
        const audio = new Audio(audioFile);
        audio.play();
    }

    function showLoss(message, audioFile) {
        $('#lossModal').modal('show');
        const audio = new Audio(audioFile);
        audio.play();
    }

    function restartGame() {
        location.reload();
    }

    words.forEach(word => {
        const wordElement = document.createElement("div");
        wordElement.className = "word draggable";
        wordElement.draggable = true;
        wordElement.textContent = word.text;
        wordElement.dataset.rule = word.rule;
        wordElement.dataset.audio = word.audio;
        wordsContainer.appendChild(wordElement);

        wordElement.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", e.target.dataset.rule);
            const audio = new Audio(e.target.dataset.audio);
            audio.play();
        });
    });

    rules.forEach(rule => {
        const ruleElement = document.createElement("div");
        ruleElement.className = "rule";
        ruleElement.textContent = rule;
        rulesContainer.appendChild(ruleElement);

        ruleElement.addEventListener("dragover", (e) => {
            e.preventDefault();
        });

        ruleElement.addEventListener("drop", (e) => {
            const droppedRule = e.dataTransfer.getData("text/plain");
            if (droppedRule === ruleElement.textContent) {
                score += 10; // زيادة الدرجة
                wordsMatched++;
                updateScore();
                showAlert("صحيح!", "success", "audio/success.mp3");
                if (wordsMatched === words.length) {
                    clearInterval(timer);
                    showReward("تهانينا! لقد أكملت اللعبة بنجاح!", "audio/success.mp3");
                    disableGame();
                }
            } else {
                score -= 5; // إنقاص الدرجة
                incorrectTries++;
                updateScore();
                showAlert("خطأ، حاول مرة أخرى.", "danger", "audio/error.mp3");
                if (incorrectTries >= maxIncorrectTries) {
                    showLoss("لقد خسرت اللعبة بعد ثلاث محاولات خاطئة!", "audio/error1.mp3");
                    disableGame();
                }
            }
        });
    });

    function showAlert(message, type, audioFile) {
        const alert = document.createElement("div");
        alert.className = `alert alert-${type}`;
        alert.role = "alert";
        alert.innerHTML = message;
        alertContainer.innerHTML = ""; // تفريغ التنبيهات السابقة
        alertContainer.appendChild(alert);

        // تشغيل الصوت
        const audio = new Audio(audioFile);
        audio.play();

        setTimeout(() => {
            alertContainer.innerHTML = "";
        }, 2000); // إزالة التنبيه بعد 2 ثانية
    }

    updateScore(); // تحديث الدرجة عند تحميل الصفحة
});
