const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

const runMicroTask = callback => Promise.resolve().then(callback);
const isPromise = data => typeof data === 'object' && typeof data.then === 'function';

class MyPromise {
  constructor(executor) {
    this._value = undefined;
    this._state = PENDING;
    this._handlers = [];

    try {
      executor(this._resolve.bind(this),this._rejected.bind(this))
    } catch (error) {
      this._rejected(error)
    }
  }

  _resolve(value) {
    this._changeState(value,FULFILLED);
  }
  _rejected(reason) {
    this._changeState(reason,REJECTED);
  }
  _changeState(value,state) {
    this._value = value;
    this._state = state;
    this._runHandlers();
  }

  then(onFulfilled,onRejected) {
    return new MyPromise((resolve,rejected) => {
      this._pushHandler(onFulfilled,FULFILLED,resolve,rejected);
      this._pushHandler(onRejected,REJECTED,resolve,rejected);
      this._runHandlers();
    })
  }

  _pushHandler(executor,state,resolve,rejected) {
    this._handler.push(executor,state,resolve,rejected);
  }
  _runHandlers() {
    // 状态发生变化的时候才正式推入微任务
    if(this._state === PENDING) {
      return;
    }
    while(this._handlers[0]) {
      const handler = this._handlers.shift();
      this._runHandler(handler);
    }
  }
  _runHandler(executor,state,resolve,rejected) {
    runMicroTask(() => {
      if(this._state !== state) {
        return;
      }
      if(typeof executor !== 'function') {
        this.state === FULFILLED ? resolve(this._value) : rejected(this._value);
        return;
      }

      try {
        const result = executor(this._value);
        if(isPromise(result)) {
          result.then(resolve,rejected);
          return;
        }
        resolve(result);
      } catch (error) {
        rejected(error);
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
      }
    )
  }

  static resolve(val) {
    return new MyPromise(resolve => resolve(val));
  }
  static rejected(reason) {
    return new MyPromise((resolve,rejected) => rejected(reason));
  }
  static all(promises) {
    return new Promise((resolve, reject) => {
      const result = [];
      let count = 0;
      let resolveCount = 0;
      for(let promise of promises) {
        let i = ++count;
        MyPromise.resolve(promise).then(
          val => {
            resolveCount++;
            result[i] = val;
            if(i == resolveCount) {
              resolve(result)
            }
          },
          reason => {
            reject(reason)
          }
        )
      }

      if(count === 0) {
        resolve(result);
      }
    })
  }
  static allSettled(promises) {
    const result = [];
    for(let promise of promises) {
      result.push(MyPromise.resolve(promise).then(
        val => {
          return {
            state: FULFILLED,
            val,
          }
        },
        reason => {
          return {
            state: REJECTED,
            reason,
          }
        }
      ))
    }
    return MyPromise.all(result)
  }
  static race(promises) {
    return new MyPromise((resolve,rejected) => {
      for(let promise of promises) {
        MyPromise.resolve(promise).promise.then(resolve,rejected);
      }
    })
  }
}