function easeLinear (t, b, c, d) {
    return c * t / d + b;
}

function easeOutQuad (t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b;
}

function easeOutSine (t, b, c, d) {
    return c * Math.sin(t / d * (Math.PI / 2)) + b;
}

function easeInQuart (t, b, c, d) {
    return c * (t /= d) * t * t * t + b;
}

export {easeLinear, easeOutQuad, easeOutSine, easeInQuart}