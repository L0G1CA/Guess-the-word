export class Input {
    constructor(controller) {
        this.controller = controller;
        this.gameStates = this.controller.getGameStates();

        const playButton = document.getElementById("playButton");
        const challengesButton = document.getElementById("challengesButton");
        const scoreButton = document.getElementById("scoreButton");
        const quitButton = document.getElementById("quitButton");
        const retryButton = document.getElementById("retryButton");
        const startGameButton = document.getElementById("startGameButton");
        const backToMenuButton = document.getElementById("backToMenuButton");
        const againButton = document.getElementById("againButton");
        const stopButton = document.getElementById("stopButton");
        const nameInput = document.getElementById("nameInput");
        const saveButton = document.getElementById("saveButton");
        saveButton.classList.add("blocked");
        const backButton = document.getElementById("back");

        this.guessInput = document.getElementById("guess");


        // events die getriggerd worden bij bepaalde acties
        window.addEventListener("keydown", e => {
            if ( e.key === "Enter" ) {
                this.guess();
            }
        });

        playButton.addEventListener("click", () => {
            this.controller.changeGameState("playButton");
        });

        challengesButton.addEventListener("click", () => {
            this.controller.changeGameState("challengesButton");
        });

        scoreButton.addEventListener("click", () => {
            this.controller.changeGameState("scoreButton");
        });

        quitButton.addEventListener("click", () => {
            this.controller.changeGameState("quitButton");
        });

        retryButton.addEventListener("click", () => {
            this.controller.changeGameState("retryButton");
        });
        
        startGameButton.addEventListener("click", () => {
            const selected = {
                lessHearts: document.getElementById("lessHearts").checked,
                difficultWords: document.getElementById("difficultWords").checked,
                lessTime: document.getElementById("lessTime").checked,
                fixedAttempts: document.getElementById("fixedAttempts").checked
            };
            this.controller.setGameChallenge(selected);
            this.controller.changeGameState("startGameButton");
        });
        
        backToMenuButton.addEventListener("click", () => {
            this.controller.changeGameState("quitButton");
        });
        
        againButton.addEventListener("click", () => {
            this.controller.changeGameState("retryButton");
        });

        stopButton.addEventListener("click", () => {
            this.controller.changeGameState("quitButton");
        });

        nameInput.addEventListener("input", () => {
            if ( nameInput.value.trim() ) {
                saveButton.classList.remove("blocked");
                saveButton.disabled = false;
            } else {
                saveButton.classList.add("blocked");
                saveButton.disabled = true;
            }
        });

        saveButton.addEventListener("click", () => {
            this.controller.saveScore();
            this.controller.changeGameState("quitButton");
        });

        backButton.addEventListener("click", () => {
            this.controller.changeGameState("quitButton");
        });
    }

    // de input van de input object in de html bestand word bebruikt om te raden wanneer ik op enter druk
    guess(){
        const value = this.guessInput.value.trim().replace(/\s+/g, "").toLowerCase();
        if ( !value ) return;

        this.controller.guessAttempt(value);

        this.guessInput.value = "";
    }
}