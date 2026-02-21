export class Model {
    constructor(controller) {
        this.controller = controller;
        this.words = [];
        this.wordsDifficult = [];
        this.loadWords();
    }

    // laad de woorden uit geheugen die gebruikt worden als raad woorden
    async loadWords() {
        let res = await fetch("Assets/Words.txt");
        let text = await res.text();
        this.words = text.split("\n").map(w => w.trim()).filter(Boolean);
        res = await fetch("Assets/WordsDifficult.txt");
        text = await res.text();
        this.wordsDifficult = text.split("\n").map(w => w.trim()).filter(Boolean);
    }

    // verkrijg een random woord uit de lijst van woorden
    getRandomWord(mode) {
        if (!this.words.length) {
            console.warn("Words not loaded yet!");
            return;
        }
        if (!this.wordsDifficult.length) {
            console.warn("Words not loaded yet!");
            return;
        }
        if ( mode === "easy" ) {
            const index = Math.floor(Math.random() * this.words.length);
            return this.words[index];
        }
        if ( mode === "difficult" ) {
            const index = Math.floor(Math.random() * this.wordsDifficult.length);
            return this.wordsDifficult[index];
        }
    }

    // een check of de woorden al geladen zijn uit geheugen voor het spel gestart kan worden
    getIfWordsAreLoaded() {
        return this.words.length > 0 && this.wordsDifficult.length > 0;
    }
}