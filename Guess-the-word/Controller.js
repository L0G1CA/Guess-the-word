import { Model } from "./Model.js";
import { View } from "./View/View.js";
import { Input } from "./Input.js";

const gameStates = {
    MENU: "MENU",
    GAME: "GAME",
    SCORE: "SCORE",
    CHALLENGES: "CHALLENGES"
};

export class Controller {
    constructor() {
        this.model = new Model(this);
        this.view = new View(this);
        this.input = new Input(this);
        
        this.gameState = gameStates.MENU;
        this.wordToGuess = "";
        this.guessedLetters = [];
        this.notGuessedLetters = [];
        this.attemptsLeft = 0;
        this.timer = 0;
        this.score = 0;

        this.timerInterval = null;

        this.gameChallenge = {
            hearts: 7,
            words: "easy",
            time: 600,
            fixedAttempts: false
        };
    }


    // game loop
    update() {
        this.view.update();
        requestAnimationFrame(() => this.update());
    }


    // logica voor de knoppen
    changeGameState(button) {
        switch(button) {
            case "playButton":
                this.startGame();
                break;
            case "challengesButton":
                this.gameState = gameStates.CHALLENGES;
                break;
            case "scoreButton":
                this.gameState = gameStates.SCORE;
                break;
            case "quitButton":
                this.gameState = gameStates.MENU;
                this.stopTimer();
                break;
            case "retryButton":
                this.startGame();
                break;
            case "startGameButton":
                this.startGame();
                break;
            case "backToMenuButton":
                this.gameState = gameStates.MENU;
                this.stopTimer();
                break;
        }
    }

    startGame() {
        if (!this.model.getIfWordsAreLoaded()) {
            console.log("Words not loaded yet! Try again in a moment.");
            return;
        }

        this.gameState = gameStates.GAME;
        this.attemptsLeft = this.gameChallenge.hearts;
        this.guessedLetters = [];
        this.notGuessedLetters = [];
        this.score = 0;
        this.timer = this.gameChallenge.time;
        this.startTimer();
        this.view.hangman.trigger("run");
        this.wordToGuess = this.model.getRandomWord(this.gameChallenge.words);
        console.log(this.wordToGuess);

        requestAnimationFrame(() => {
            const guessInput = document.getElementById("guess");
            guessInput.focus();
        });
    }


    // game logica
    guessAttempt(guess) {
        // stop met raden als het spel afgelopen is (attemptsLeft is dan negatief)
        if ( this.attemptsLeft <= 0 ) return;
        if ( this.gameChallenge.fixedAttempts ) this.attemptsLeft--;

        // check of de speler een woord of een letter invult
        if ( guess.length > 1 ) {
            this.checkWord(guess);
        } else {
            this.checkLetter(guess);
        }

        // als de speler het woord niet geraden heeft, 
        // dan vul de resterende letters in
        // en stop het spel
        if ( this.attemptsLeft !== 0 ) return;
        for ( const char of this.wordToGuess ) {
            if ( this.guessedLetters.includes(char) ) continue;
            this.notGuessedLetters.push(char);
        }
        this.stopTimer();
    }

    checkWord(word) {
        // check of het woord klopt
        if ( word !== this.wordToGuess ) {
            if ( !this.gameChallenge.fixedAttempts ) this.attemptsLeft--;
            return;
        }

        // vul de resterende ontbrekende letters in
        for ( const char of word ) {
            if ( this.guessedLetters.includes(char) ) continue;
            this.guessedLetters.push(char);
        }

        // stop het spel
        this.attemptsLeft = 0;
        this.score +=Math.round(0.166 * this.timer);
        this.stopTimer();
    }

    checkLetter(letter) {
        // check of de letter al eens gebruikt is en of de letter in het woord zit
        if ( !this.guessedLetters.includes(letter) ) {
            this.guessedLetters.push(letter);
        } else {
            if ( !this.gameChallenge.fixedAttempts ) this.attemptsLeft--;
            return;
        }
        if ( !this.wordToGuess.includes(letter) ) {
            if ( !this.gameChallenge.fixedAttempts ) this.attemptsLeft--;
            return;
        }

        // check of de letter het woord raadt
        let winCheck = true;
        for ( const char of this.wordToGuess ) {
            if ( !this.guessedLetters.includes(char) ) winCheck = false;
        }
        if ( winCheck ) {
            this.attemptsLeft = 0;
            this.score +=Math.round(0.166 * this.timer);
            this.stopTimer();
            return;
        }

        // geef een score aan de hand van hoe raar de letter is in de nederlandse woorden
        // en hoevaak de letter in het woord zit
        const occurrences = [...this.wordToGuess].filter(char => char === letter).length;
        if (['e','n','a','t','i'].includes(letter)) this.score += 5 * occurrences;
        if (['r','o','d','l','s'].includes(letter)) this.score += 10 * occurrences;
        if (['g','k','m','b','v','h'].includes(letter)) this.score += 15 * occurrences;
        if (['p','w','f','j','z'].includes(letter)) this.score += 20 * occurrences;
        if (['c','x','y','q'].includes(letter)) this.score += 30 * occurrences;
    }


    // timer logica
    startTimer() {
        this.stopTimer();
        this.timerInterval = setInterval(() => {
            this.timer--;
            // als de tijd verlopen is dan stopt het spel en worden de resterende letters ingevuld
            if (this.timer <= 0) {
                this.stopTimer();
                this.attemptsLeft = 0;
                for ( const char of this.wordToGuess ) {
                    if ( this.guessedLetters.includes(char) ) continue;
                    this.notGuessedLetters.push(char);
                }
            }
        }, 1000);
    }

    stopTimer() {
        if (!this.timerInterval) return;
        clearInterval(this.timerInterval);
        this.timerInterval = null;
    }


    // getters
    getGameStates() {
        return gameStates;
    }

    getCurrentGameState() {
        return this.gameState;
    }

    getWordToGuess() {
        return this.wordToGuess;
    }

    getGuessedLetters() {
        return this.guessedLetters;
    }
    
    getNotGuessedLetters() {
        return this.notGuessedLetters;
    }

    getTimer() {
        return this.timer;
    }

    getScore() {
        return this.score;
    }

    getAttempsLeft() {
        return this.attemptsLeft;
    }

    
    // Setters
    setGameChallenge(challenges) {
        this.gameChallenge.hearts = challenges.lessHearts ? 5 : 7;
        this.gameChallenge.words = challenges.difficultWords ? "difficult" : "easy";
        this.gameChallenge.time = challenges.lessTime ? 300 : 600;
        this.gameChallenge.fixedAttempts = challenges.fixedAttempts;
    }
}