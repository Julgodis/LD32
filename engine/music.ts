
class Music {

    static isOff: boolean = false;

    static Off() {
        Music.isOff = true;
    }

    static On() {
        Music.isOff = false;
    }

    audio: HTMLAudioElement;

    constructor(element: HTMLAudioElement, loop: boolean = false) {
        this.audio = element;
        this.audio.loop = loop;
    }

    get volume(): number {
        return this.audio.volume;
    }

    set volume(value: number) {
        this.audio.volume = value;
    }

    play() {
        if(!Music.isOff)
            this.audio.play();
    }

    stop() {
        this.audio.pause();
    }
} 