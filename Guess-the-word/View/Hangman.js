export class Hangman {
    constructor(controller) {
        this.controller = controller;

        this.area = document.getElementById("hangmanArea");
        this.hangman = document.getElementById("hangman");

        this.speed = 5;
        this.x = 0;
        this.targetX = 0;

        this.run = this.run.bind(this);
        this.happy = this.happy.bind(this);
        this.stressed = this.stressed.bind(this);
        this.death = this.death.bind(this);

        this.idleFrames = [];
        this.runFrames = [];
        this.happyFrames = [];
        this.stressedFrames = [];
        this.deathFrames = [];

        this.loadFrames();
    }

    // verwerk de animatie frames van te voren naar een array
    loadFrames() {
        for (let i = 1; i <= 24; i++) {
            const img = new Image();
            img.src = `Assets/Animations/idle/${String(i)}.png`;
            this.idleFrames.push(img);
        }
        for (let i = 1; i <= 17; i++) {
            const img = new Image();
            img.src = `Assets/Animations/running/${String(i)}.png`;
            this.runFrames.push(img);
        }
    }

    // stopt de huidige animatie die speelt
    stopAnimations() {
        if (this.animation) {
            clearInterval(this.animation);
            this.animation = null;
        }
    }

    // triggert een nieuwe animatie
    trigger(ani) {
        this.stopAnimations();

        requestAnimationFrame(() => {
            if ( ani === "idle" ){
                this.frame = 1;
                this.totalFrames = 24;
                this.frameSpeed = 150;

                this.hangman.style.transform = `translateX(${-20}px)`;

                this.animation = setInterval(() => {
                    this.idle();
                }, this.frameSpeed);
            }
            if ( ani === "run" ) {
                this.frame = 1;
                this.totalFrames = 17;
                this.frameSpeed = 18;

                this.x = this.area.clientWidth - 250;
                this.targetX = -20;

                this.animation = setInterval(() => {
                    this.run();
                }, this.frameSpeed);
            }
            if ( ani === "happy" ) {
                this.happy();
            }
            if ( ani === "stressed" ) {
                this.stressed();
            }
            if ( ani === "death" ) {
                this.death();
            }
        });
    }


    // de animaties die kunnen spelen en de bewigingen van het poppetje
    idle() {
        this.frame++;
        if ( this.frame >= this.totalFrames ) this.frame = 1;
        this.hangman.src = this.idleFrames[this.frame].src;
    }

    run() {
        this.frame++;
        if ( this.frame >= this.totalFrames ) this.frame = 1;
        this.hangman.src = this.runFrames[this.frame].src;

        if (this.x > this.targetX) {
            this.x -= this.speed;
            this.hangman.style.transform = `translateX(${this.x}px)`;
        } else {
            this.trigger("idle");
        }
    }

    happy() {
        this.hangman.className = "happy";
        setTimeout(() => {
            this.hangman.className = "idle"; // go back to idle
        }, 500);
    }

    stressed() {
        this.hangman.className = "stressed";
        setTimeout(() => {
            this.hangman.className = "idle";
        }, 500);
    }

    death() {
        this.hangman.className = "death";
    }
}