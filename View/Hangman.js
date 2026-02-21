export class Hangman {
    constructor(controller, view) {
        this.controller = controller;
        this.view = view;

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
        for (let i = 1; i <= 31; i++) {
            const img = new Image();
            img.src = `Assets/Animations/happy/${String(i)}.png`;
            this.happyFrames.push(img);
        }
        for (let i = 1; i <= 24; i++) {
            const img = new Image();
            img.src = `Assets/Animations/stressed/${String(i)}.png`;
            this.stressedFrames.push(img);
        }
        for (let i = 1; i <= 72; i++) {
            const img = new Image();
            img.src = `Assets/Animations/death/${String(i)}.png`;
            this.deathFrames.push(img);
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
                this.frame = 1;
                this.totalFrames = 31;
                this.frameSpeed = 20;

                this.hangman.style.transform = `translateX(${-20}px)`;

                this.animation = setInterval(() => {
                    this.happy();
                }, this.frameSpeed);
            }
            if ( ani === "stressed" ) {
                this.frame = 1;
                this.totalFrames = 24;
                this.frameSpeed = 35;

                this.hangman.style.transform = `translateX(${-20}px)`;

                this.animation = setInterval(() => {
                    this.stressed();
                }, this.frameSpeed);
            }
            if ( ani === "death" ) {
                this.frame = 1;
                this.totalFrames = 72;
                this.frameSpeed = 55;

                this.hangman.style.transform = `translateX(${-20}px)`;

                this.animation = setInterval(() => {
                    this.death();
                }, this.frameSpeed);
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
        this.frame++;
        if ( this.frame >= this.totalFrames ) {
            this.trigger("idle");
            if ( this.controller.getAttempsLeft() <= 0 ) this.view.endView();;
            return;
        }
        this.hangman.src = this.happyFrames[this.frame].src;
    }

    stressed() {
        this.frame++;
        if ( this.frame >= this.totalFrames ) {
            this.trigger("idle");
            return;
        }
        this.hangman.src = this.stressedFrames[this.frame].src;
    }

    death() {
        this.frame++;
        if ( this.frame >= this.totalFrames ) {
            this.stopAnimations();
            this.view.endView();
            return;
        }
        this.hangman.src = this.deathFrames[this.frame].src;
    }
}