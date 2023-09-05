  const PENDING = 'pending';
  const FULFILLED = 'fulfilled';
  const REJECTED = 'rejected';

  const runMicroTask = callback => {
    Promise.resolve().then(callback);
  }
  const isPromise = data => {
    return typeof data === 'object' && typeof data.then === 'function'
  }

  class MyPromise {
    constructor(executor) {
      this._value = undefined;
      this._state = PENDING;
      this._handlers = [];

      try {
        executor(this._resolve.bind(this), this._reject.bind(this));
      } catch (error) {
        this._reject(error);
      }
    }

    _changeState(value, state) {
      if (this._state !== PENDING) {
        return;
      }
      if(isPromise(value)) {
        value.then(val => this._resolve(val),reason => this._reject(reason));
        return;
      }
      this._value = value;
      this._state = state;
      this._runHandlers();
    }
    _resolve(val) {
      this._changeState(val, FULFILLED);
    }
    _reject(reason) {
      this._changeState(reason, REJECTED);
    }

    then(onFulfilled, onRejected) {
      return new MyPromise((resolve, reject) => {
        this._handlersPush(onFulfilled, FULFILLED, resolve, reject);
        this._handlersPush(onRejected, REJECTED, resolve, reject);
        this._runHandlers();
      })
    }

    _handlersPush(executor, state, resolve, reject) {
      this._handlers.push({ executor, state, resolve, reject });
    }
    _runHandlers() {
      if (this._state === PENDING) {
        return;
      }
      while (this._handlers[0]) {
        const handler = this._handlers.shift();
        this._runHandler(handler);
      }
    }
    _runHandler({ executor, state, resolve, reject }) {
      runMicroTask(() => {
        if (state !== this._state) {
          return;
        }
        if (typeof executor !== 'function') {
          this._state === FULFILLED ? resolve(this._value) : reject(this._value);
          return;
        }

        try {
          const result = executor(this._value);
          if (isPromise(result)) {
            result.then(resolve, reject);
            return;
          }
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })
    }

    catch(onRejected) {
      return this.then(null, onRejected);
    }
    finally(onSettled) {
      return this.then(
        val => {
          onSettled();
          return val;
        },
        reason => {
          onSettled();
          return reason;
        })
    }

    static resolve(val) {
      return new MyPromise(resolve => resolve(val));
    }
    static reject(reason) {
      return new MyPromise((_, reject) => reject(reason))
    }
    static all(ps) {
      return new MyPromise((resolve, reject) => {
        const result = [];
        const leg = ps.length;
        let count = 0;

        for (let i=0; i< leg; i++) {
          MyPromise.resolve(ps[i]).then(val => {
            count++;
            result[i] = val;
            if (count === leg) {
              resolve(result)
            }
          }, reject)
        }
        if (leg === 0) {
          resolve(result);
        }
      })
    }
    static allSettled(promises) {
      const result = [];
      for (let promise of promises) {
        result.push(MyPromise.resolve(promise).then(val => {
          return {
            state: FULFILLED,
            val,
          }
        }).catch(reason => {
          return {
            state: REJECTED,
            reason,
          }
        })
        )
      }

      return MyPromise.all(result);
    }

    static race(promises) {
      return new MyPromise((resolve, reject) => {
        for (let promise of promises) {
          MyPromise.resolve(promise).then(resolve).catch(reject)
        }
      })
    }
  }