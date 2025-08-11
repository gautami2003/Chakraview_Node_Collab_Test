class Push {
    constructor() {
        this.title = '';
        this.message = '';
        this.image = '';
        this.data = '';
        this.is_background = false;
    }

    setTitle(title) {
        this.title = title;
    }

    setMessage(message) {
        this.message = message;
    }

    setImage(imageUrl) {
        this.image = imageUrl;
    }

    setPayload(data) {
        this.data = data;
    }

    setIsBackground(is_background) {
        this.is_background = is_background;
    }

    getPush() {
        const res = {
            data: {
                title: this.title,
                is_background: this.is_background,
                message: this.message,
                image: this.image,
                payload: this.data,
                timestamp: new Date().toISOString()
            }
        };
        return res;
    }
}

module.exports = Push;