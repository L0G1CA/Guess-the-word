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
            this.controller.changeGameState("backToMenuButton");
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