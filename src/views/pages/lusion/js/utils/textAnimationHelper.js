/**
 * justThreeJs textAnimationHelper.js
 * @author kongjianqiu
 * @description
 * @created 2025/5/6 18:15:47
 */


export default class TextAnimationHelper {
    constructor(base) {
        this.base = base;
    }
    setMatrixText(e, t, r = 0, n = 40, a = 2, l = 1 / 15) {
        e._rawTime = 0, e._time = 0, e._direction = 1, e._prevRefreshTime = -1 / 0, e._refreshRate = l, e._delay = r, t = t.replace("<br>", `
`), e._text = t, e._letterPerSecond = n, e._maxRandLetterCount = a, e.textContent = ""
    }

    resetMatrixTextTime(e) {
        e._rawTime = 0, e._time = 0, e._prevRefreshTime = -1 / 0
    }

    updateMatrixText(e, t = this.base.properties.deltaTime) {
        if (e._rawTime += t, e._time += t * e._direction, e._time = this.base.math.clamp(e._time, 0, e._delay + (e._text.length + e._maxRandLetterCount) / e._letterPerSecond), e._rawTime >= e._prevRefreshTime + e._refreshRate) {
            e._prevRefreshTime = e._rawTime;
            let r = e._text, n = Math.max(0, Math.floor(e._letterPerSecond * (e._time - e._delay))),
                a = Math.min(r.length, n - e._maxRandLetterCount), l = Math.min(r.length, n), c = "";
            if (n > 0) {
                c = r.substr(0, a);
                for (let u = 0; u < l - a; u++) c += String.fromCharCode(33 + ~~(Math.random() * 93));
                c = c.replace(`
`, "<br>")
            }
            e._str != c && (e._str = c, e.innerHTML = c)
        }
    }
}
