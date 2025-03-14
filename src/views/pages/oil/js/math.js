/**
 * justThreeJs math.js
 * @author kongjianqiu
 * @description
 * @created 2025/3/14 13:35:27
 */

export function randomRange(min, max) {
    return min + Math.random() * (max - min);
}

export function lerp(min, max, t) {
    return min * (1 - t) + max * t;
}

export function invLerp(min, max, v, { clamp = false } = {}) {
    const t = (v - min) / (max - min);
    return clamp ? clamp01(t) : t;
}

export function remap(v, imin, imax, omin, omax, { ...options } = {}) {
    const t = invLerp(imin, imax, v, options);

    return lerp(omin, omax, t);
}

export function damp(a, b, lambda) {
    return lerp(a, b, 1 - Math.exp(-lambda));
}

// true damp framerate independant
export function dampDt(a, b, lambda, dt) {
    return lerp(a, b, 1 - Math.exp(-lambda * dt));
}

export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

export function clamp01(value) {
    return clamp(value, 0, 1);
}

export function distanceBetween(point1, point2) {
    return Math.sqrt(
        Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
    );
}

export function angleBetween(point1, point2) {
    return Math.atan2(point2.x - point1.x, point2.y - point1.y);
}

export function norm(value, min, max) {
    return (value - min) / (max - min);
}
