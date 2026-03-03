import { Hangman } from "./Hangman.js";

export class View {
    constructor(controller) {
        this.controller = controller;
        this.hangman = new Hangman(this.controller, this);
        this.gameStates = this.controller.getGameStates();

        this.menuContainer = document.querySelector(".menuContainer");
        this.challengesContainer = document.querySelector(".challengesContainer");
        this.scoreContainer = document.querySelector(".scoreContainer");
        this.gameContainer = document.querySelector(".gameContainer");
        this.wordToGuess = document.getElementById("word");
        this.letters = document.getElementById("letters");
        this.timeText = document.getElementById("time");
        this.scoreText = document.getElementById("score");
        this.heartsArea = document.getElementById("heartsArea");
        this.end = document.querySelector(".endScreen");
        this.endArea = document.getElementById("endScreenChallengesContent");
        this.scoreContainer = document.querySelector(".scoreContainer");
        this.acievedScores = document.getElementById("acievedScores");
        this.renderedScoreView = false;
    }

    // update loop
    update() {
        this.menuContainer.style.display = "none";
        this.challengesContainer.style.display = "none";
        this.scoreContainer.style.display = "none";
        this.gameContainer.style.display = "none";

        // wissel van view aan de hand van de status van het spel
        switch (this.controller.getCurrentGameState()) {
            case this.gameStates.MENU:
                this.renderedScoreView = false;
                this.menuContainer.style.display = "grid";
                break;

            case this.gameStates.GAME:
                this.renderedScoreView = false;
                this.gameContainer.style.display = "grid";
                this.gameView();
                break;

            case this.gameStates.SCORE:
                this.scoreContainer.style.display = "flex";
                if ( this.renderedScoreView ) break;
                this.renderedScoreView = true;
                this.scoreView();
                break;

            case this.gameStates.CHALLENGES:
                this.renderedScoreView = false;
                this.challengesContainer.style.display = "flex";
                break;
        }
    }

    gameView(){
        const guessedLetters = this.controller.getGuessedLetters();

        this.heartsView();
        this.wordsView();
        this.alphabetView();
        this.timeAndScoreView();
    }

    heartsView() {
        // laat zien hoeveel levens de speler nog over heeft
        const attemptsLeft = this.controller.getAttempsLeft();
        let hearts = "";
        for (let i = 0; i < attemptsLeft; i ++){
            hearts += `<div id="heart"></div>`;
        }
        this.heartsArea.innerHTML = hearts;
    }

    wordsView() {
        // de letters die geraden zijn worden hier getekend
        // letters die niet geraden zijn worden in het rood getekend
        const guessedLetters = this.controller.getGuessedLetters();
        let word = "";
        const wordToGuess = this.controller.getWordToGuess();
        const notGuessedLetters = this.controller.getNotGuessedLetters();
        for ( const char of wordToGuess ) {
            if ( guessedLetters.includes(char) ) {
                word += `<span id="letter">${char}</span>`;
                continue;
            }
            if ( notGuessedLetters.includes(char) ) {
                word += `<span id="letterNotGuessed">${char}</span>`;
                continue;
            }
            word += `<span id="letter"> </span>`
        }
        this.wordToGuess.innerHTML = word;
    }

    alphabetView() {
        // het alfabet word hier getekend
        // letters die de speler al gespeeld heeft worden in het rood getekend
        const guessedLetters = this.controller.getGuessedLetters();
        let alphabet = "abcdefghijklmnopqrstuvwxyz";
        let letters = ""
        for ( const char of alphabet ) {
            if ( guessedLetters.includes(char) ) {
                letters += `<span id="alphabetGuessed">${char}</span>`
                continue;
            }
            letters += `<span id="alphabet">${char}</span>`
        }
        this.letters.innerHTML = letters;
    }

    timeAndScoreView() {
        // hier word de resterende tijd getekend
        const time = this.controller.getTimer();
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        this.timeText.textContent = `Time Left: ${minutes}:${seconds.toString().padStart(2, "0")}`;


        // hier word de behaalde score getekend
        const score = this.controller.getScore();
        this.scoreText.textContent = `Score: ${score}`;
    }

    endView() {
        this.end.style.display = "block";
        const score = this.controller.getScore();
        let html = "";
        html += `<h3 style="font-size: clamp(10px, 1em, 70px); margin: 0px;">Your score: ${score}</h3>`;
        if ( this.controller.getGameChallenge().hearts !== 8 ) {
            html += `<h3 style="font-size: clamp(10px, 20%, 70px); margin: 5px;">
            <i class="fa-solid fa-heart-crack" style="margin-right: 20px; font-size: clamp(8px, 10%, 70px);"></i>
            ${this.controller.getGameChallenge().hearts} hearts </h3>`;
        }
        if ( this.controller.getGameChallenge().words !== "easy" ) {
            html += `<h3 style="font-size: clamp(10px, 20%, 70px); margin: 5px;">
            <i class="fa-solid fa-language" style="margin-right: 20px; font-size: clamp(8px, 10%, 70px);"></i>
            difficult words </h3>`;
        }
        if ( this.controller.getGameChallenge().time !== 600 ) {
            html += `<h3 style="font-size: clamp(10px, 20%, 70px); margin: 5px;">
            <i class="fa-solid fa-clock" style="margin-right: 20px; font-size: clamp(8px, 10%, 70px);"></i>
            ${this.controller.getGameChallenge().time / 60} minutes</h3>`;
        }
        if ( this.controller.getGameChallenge().fixedAttempts !== false ) {
            html += `<h3 style="font-size: clamp(10px, 20%, 70px); margin: 5px;">
            <i class="fa-solid fa-lock" style="margin-right: 20px; font-size: clamp(8px, 10%, 70px);"></i>
            fixed attempts</h3>`;
        }
        this.endArea.innerHTML = html;
    }

    scoreView() {
        const scores = JSON.parse(localStorage.getItem("scores")) || [];

        let html = "";
        scores.forEach((entry, index) => {
            html += `<p><button class="deleteBtn" data-index="${index}"><i class="fa-solid fa-trash"></i></button> `;

            html += `Name: ${entry.name} - Score: ${entry.score} `;

            if ( entry.challenge.hearts !== 8 ) html += `<i class="fa-solid fa-heart-crack"></i> `;
            if ( entry.challenge.words !== "easy" ) html += `<i class="fa-solid fa-language"></i> `;
            if ( entry.challenge.time !== 600 ) html += `<i class="fa-solid fa-clock"></i> `;
            if ( entry.challenge.fixedAttempts !== false ) html += `<i class="fa-solid fa-lock"></i> `;

            html += `</p>`;
        });
        this.acievedScores.innerHTML = html;

        const deleteButtons = this.acievedScores.querySelectorAll(".deleteBtn");
        deleteButtons.forEach(button => {
            button.addEventListener("click", () => {
                this.controller.removeScore(button.dataset.index);
            });
        });
    }
}