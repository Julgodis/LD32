
class Sound {

    static isOff: boolean = false;

    static Off() {
        Sound.isOff = true;
    }

    static On() {
        Sound.isOff = false;
    }


    audios: HTMLAudioElement[];

    constructor(element: HTMLAudioElement[]) {
        this.audios = element;
    }

    set volume(value: number) {
        for(var id in this.audios)
            this.audios[id].volume = value;
    }

    play(): HTMLAudioElement {
        for (var id in this.audios) {
            if (this.audios[id].currentTime == 0 || this.audios[id].ended) {
                if(!Sound.isOff)
                    this.audios[id].play();
                return this.audios[id];
                break;
            }
        }
        return null;
    }
} 