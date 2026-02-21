import { Hangman } from "./Hangman.js";

export class View {
    constructor(controller) {
        this.controller = controller;
        this.hangman = new Hangman(this.controller);
        this.gameStates = this.controller.getGameStates();

        this.menuContainer = document.querySelector(".menuContainer");
        this.challengesContainer = document.querySelector(".challengesContainer");
        this.scoreContainer = document.querySelector(".scoreContainer");
        this.gameContainer = document.querySelector(".gameContainer");
        this.wordToGuess = document.getElementById("word");
        this.letters = document.getElementById("letters");
        this.time = document.getElementById("time");
        this.score = document.getElementById("score");
        this.heartsArea = document.getElementById("heartsArea");
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
                this.menuContainer.style.display = "grid";
                break;

            case this.gameStates.GAME:
                this.gameContainer.style.display = "grid";
                this.gameView();
                break;

            case this.gameStates.SCORE:
                this.scoreContainer.style.display = "grid";
                break;

            case this.gameStates.CHALLENGES:
                this.challengesContainer.style.display = "flex";
                break;
        }
    }

    gameView(){
        const guessedLetters = this.controller.getGuessedLetters();

        // laat zien hoeveel levens de speler nog over heeft
        const attemptsLeft = this.controller.getAttempsLeft();
        let hearts = "";
        for (let i = 0; i < attemptsLeft; i ++){
            hearts += `<div id="heart"></div>`;
        }
        this.heartsArea.innerHTML = hearts;
        
        // de letters die geraden zijn worden hier getekend
        // letters die niet geraden zijn worden in het rood getekend
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

        // het alfabet word hier getekend
        // letters die de speler al gespeeld heeft worden in het rood getekend
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


        // hier word de resterende tijd getekend
        const time = this.controller.getTimer();
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        this.time.textContent = `Time Left: ${minutes}:${seconds.toString().padStart(2, "0")}`;


        // hier word de behaalde score getekend
        const score = this.controller.getScore();
        this.score.textContent = `Score: ${score}`;
    }
}