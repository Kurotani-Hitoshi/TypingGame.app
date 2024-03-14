const RANDOM_SENTENCE_URL_API = "https://api.quotable.io/random";
const typeDisplay = document.getElementById("type-display");
const typeInput = document.getElementById("type-Input");
const timer = document.getElementById("timer");

const typeSound = new Audio("./audio/typing-sound.mp3");
const wrongSound = new Audio("./audio/wrong.mp3");
const correctcSound = new Audio("./audio/correct.mp3");


//inoutテキスト入力。　あっているかどうかの判定。
typeInput.addEventListener("input", () => {

    // タイプ音をつける
    typeSound.play();
    typeSound.currentTime = 0;

    const sentenceArray = typeDisplay.querySelectorAll("span");
    const arrayvalue = typeInput.value.split("");
    let correct = true;
    sentenceArray.forEach((characterSpan, index) => {
        if ((arrayvalue[index] == null)) {
            characterSpan.classList.remove("correct");
            characterSpan.classList.remove("incorrect");
            correct = false;
        }
        else if (characterSpan.innerText == arrayvalue[index]) {
            characterSpan.classList.add("correct");
            characterSpan.classList.remove("incorrect");


        } else {
            characterSpan.classList.add("incorrect");
            characterSpan.classList.remove("correct");

            wrongSound.play();
            wrongSound.currentTime = 0;

            correct = false;
        }

    })

    if (correct == true) {
        correctcSound.play();
        correctcSound.currentTime = 0;
        RenderNextSentence();
    }
});


// 非同期でランダムな文章を取得する

function GetRandomSentence() {
    return fetch(RANDOM_SENTENCE_URL_API)
        .then((responce) => responce.json())
        .then((data) => data.content);
}


// 取得したランダムな文章を、表示する
async function RenderNextSentence() {
    const sentence = await GetRandomSentence();
    console.log(sentence);
    typeDisplay.innerText = "";

    // 文章を一文字ずつ分解して、spanタグを生成する
    let oneText = sentence.split("");

    oneText.forEach((character) => {
        const characterSpan = document.createElement("span");
        characterSpan.innerText = character;
        // console.log(characterSpan);
        typeDisplay.appendChild(characterSpan);
        // characterSpan.classList.add("correct")

    });

    //テキストボックスの中身を消す
    typeInput.value = "";

    StartTimer();
}


let startTime;
let originTime = 30;
function StartTimer() {
    timer.innerText = originTime;
    startTime = new Date();

    setInterval(() => {
        timer.innerText = originTime - getTimerTime();
        if (timer.innerText <= 0) TimeUp();
    }, 1000);
}

function getTimerTime() {
    return Math.floor((new Date() - startTime) / 1000);
}

function TimeUp() {
    RenderNextSentence();
    wrongSound.play();
    wrongSound.currentTime = 0;
}

RenderNextSentence();

