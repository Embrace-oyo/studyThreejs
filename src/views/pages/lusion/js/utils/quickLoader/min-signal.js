const ERROR_MESSAGE_MISSING_CALLBACK = 'Callback function is missing!';

export default class MinSignal {
    constructor() {
        this._listeners = [];
        this.dispatchCount = 0;
    }

    /**
     * Adding callback to the signal
     * @param {Function} fn - the callback function
     * @param {object} context - the context of the callback function
     * @param {number} priority - in the dispatch call. The higher priority it is, the eariler it will be dispatched.
     * @param {...any} args - additional argument prefix
     */
    add(fn, context, priority, ...args) {
        if (!fn) {
            throw ERROR_MESSAGE_MISSING_CALLBACK;
        }

        priority = priority || 0;
        const listeners = this._listeners;

        // Check for duplicate listeners
        if (listeners.some(listener => listener.f === fn && listener.c === context)) {
            return false;
        }

        let realFn = fn;
        let sliceIndex = 0;

        if (typeof priority === 'function') {
            realFn = priority;
            priority = args[0];
            sliceIndex = 1;
        }

        listeners.unshift({
            f: fn,
            c: context,
            p: priority,
            r: realFn,
            a: args.slice(sliceIndex),
            j: 0
        });

        this._sortListeners();
        return true;
    }

    /**
     * Adding callback to the signal but it will only trigger once
     * @param {Function} fn - the callback function
     * @param {object} context - the context of the callback function
     * @param {number} priority - in the dispatch call. The higher priority it is, the eariler it will be dispatched.
     * @param {...any} args - additional argument prefix
     */
    addOnce(fn, context, priority, ...args) {
        if (!fn) {
            throw ERROR_MESSAGE_MISSING_CALLBACK;
        }

        const realFn = (...dispatchArgs) => {
            this.remove(fn, context);
            return fn.apply(context, dispatchArgs);
        };

        if (typeof priority === 'function') {
            return this.add(fn, context, realFn, priority, ...args);
        }
        return this.add(fn, context, realFn, priority, ...args);
    }

    /**
     * Remove callback from the signal
     * @param {Function} fn - the callback function
     * @param {object} context - the context of the callback function
     * @return {boolean} return true if there is any callback was removed
     */
    remove(fn, context) {
        if (!fn) {
            this._listeners = [];
            return true;
        }

        const initialLength = this._listeners.length;
        this._listeners = this._listeners.filter(listener => {
            if (listener.f === fn && (!context || (listener.c === context))) {
                listener.j = 0;
                return false;
            }
            return true;
        });

        return this._listeners.length !== initialLength;
    }

    /**
     * Dispatch the callback
     * @param {...any} args - additional argument suffix
     */
    dispatch(...args) {
        this.dispatchCount++;
        const dispatchCount = this.dispatchCount;
        let stoppedListener = null;

        for (const listener of this._listeners) {
            if (listener && (listener.j < dispatchCount)) {
                listener.j = dispatchCount;
                if (listener.r.apply(listener.c, [...listener.a, ...args]) === false) {
                    stoppedListener = listener;
                    break;
                }
            }
        }

        // Reset jump flags
        for (const listener of this._listeners) {
            listener.j = 0;
        }

        return stoppedListener;
    }

    /**
     * Sort listeners by priority
     * @private
     */
    _sortListeners() {
        this._listeners.sort((a, b) => b.p - a.p);
    }
}
