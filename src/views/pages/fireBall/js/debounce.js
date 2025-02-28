const debounce = (callback, duration) => {
    let timer;
    return (event) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            callback && callback(event);
        }, duration);
    };
};
export default debounce;
//# sourceMappingURL=debounce.js.map