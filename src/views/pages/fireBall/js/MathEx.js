export const clamp = (value, min, max) => {
    return Math.min(Math.max(value, min), max);
};
export const degrees = (radians) => {
    return (radians / Math.PI) * 180;
};
export const mix = (x0, x1, a) => {
    return x0 * (1 - a) + x1 * a;
};
export const radians = (degrees) => {
    return (degrees * Math.PI) / 180;
};
export const randomArbitrary = (min, max) => {
    return Math.random() * (max - min) + min;
};
export const randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
export const smoothstep = (e0, e1, x) => {
    if (e0 >= e1)
        return 0;
    const t = clamp((x - e0) / (e1 - e0), 0, 1);
    return t * t * (3 - 2 * t);
};
export const spherical = (radian1, radian2, radius) => {
    return [
        Math.sin(radian1) * Math.cos(radian2) * radius,
        Math.cos(radian1) * radius,
        Math.sin(radian1) * Math.sin(radian2) * radius,
    ];
};
export const step = (e, x) => {
    return x >= e ? 1 : 0;
};
export default {
    clamp,
    degrees,
    mix,
    radians,
    randomArbitrary,
    randomInt,
    smoothstep,
    spherical,
    step,
};
//# sourceMappingURL=MathEx.js.map