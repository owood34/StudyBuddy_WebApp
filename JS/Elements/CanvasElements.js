class POINT {
    #x;
    #y;
    constructor (x, y) {
        this.#x = x;
        this.#y = y;
    }

    getX() {
        return this.#x;
    }

    getY() {
        return this.#y;
    }

    move(p) {
        this.#x += p instanceof POINT ? p.getX() : 0;
        this.#y += p instanceof POINT ? p.getY() : 0;
        return this;
    }

    set(p) {
        this.#x = p instanceof POINT ? p.getX() : 0;
        this.#y = p instanceof POINT ? p.getY() : 0;
        return this;
    }
}

class VECTOR {
    #magnitude;
    #angle;
    constructor(m, a) {
        this.#magnitude = Math.abs(m);
        this.#angle = a % 360;
    }

    getPointPosition() {
        return new POINT(this.#magnitude * Math.sin(this.#angle), this.#magnitude * Math.cos(this.#angle));
    }

    addMagnitude(m) {
        this.#magnitude += m;
        return this;
    }

    addAngle(a) {
        this.#angle += a;
        return this;
    }

    inverseAngle() {
        this.#angle *= -1;
        return this;
    }
}

class PARTICLE {
    #point;
    #vector;
    #weight;
    constructor (p, v, w) {
        this.#point = p instanceof POINT ? p : undefined;
        this.#vector = v instanceof VECTOR ? v : undefined;
        this.#weight = w;
    }

    getPoint() {
        return this.#point;
    }

    getVector() {
        return this.#vector;
    }

    getWeight() {
        return this.#weight;
    }

    age() {
        this.#weight -= Math.random() * 0.01;
    }

    updatePosition(w, h) {
        this.#point.move(this.#vector.getPointPosition());
        if (this.#point.getX() < 0 || this.#point.getX() > w) {
            this.#vector.inverseAngle();
        }
        if (this.#point.getY() < 0 || this.#point.getY() > h) {
            this.#vector.addAngle(180);
        }
        return this;
    }
}

export { POINT, VECTOR, PARTICLE }