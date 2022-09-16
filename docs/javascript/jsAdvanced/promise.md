---
title: promise
date: 2022-09-07
sidebar: 'auto'
tags:
 - 笔记
 - js
categories:
 - javascript
---



## Executor

- Executor是在创建Promise时需要传入的一个回调函数，这个回调函数会被立即执行
  - 并且传入两个参数：`resolve` `reject`
- 通常我们会在Executor中确定我们的Promise状态：
  - 通过resolve，可以兑现（fulfilled）Promise的状态，我们也可以称之为已决议(resolved)；
  - 通过reject，可以拒绝（reject）Promise的状态；
- 这里需要注意：一旦状态被确定下来，Promise的状态会被 锁死，该Promise的状态是不可更改的
  - 在我们调用resolve的时候，如果resolve传入的值本身不是一个Promise，那么会将该Promise的状态变成 兑现(fulfilled)
  - 在之后我们去调用reject时，已经不会有任何的响应了（并不是这行代码不会执行，而是无法改变Promise状 态）；

## resolve不同值的区别

- 如果resolve传入一个普通的值或者对象，那么这个值会作为then回调的参数；

- 如果resolve中传入的是另外一个Promise，那么这个新Promise会决定原Promise的状态；

- 如果resolve中传入的是一个对象，并且这个对象有实现then方法，那么会执行该then方法，并且根据 then方法的结果来决定Promise的状态；

  - ```js
    promise.then(res => {
      return {
        then: function(resolve, reject) {
          resolve(222222)
        }
      }
    }).then(res => {
      console.log("res:", res) // 222222
    })
    ```

## then方法

- then方法是Promise对象上的一个方法：它其实是放在Promise的原型上的 Promise.prototype.then
- then方法接受两个参数：
  - fulfilled的回调函数：当状态变成fulfilled时会回调的函数；
  - reject的回调函数：当状态变成reject时会回调的函数；

### 接受两个参数

- 一个Promise的then方法是可以被多次调用的：
  - 每次调用我们都可以传入对应的fulfilled回调；
  - 当Promise的状态变成fulfilled的时候，这些回调函数都会被执行；

### 返回值

- then方法本身是有返回值的，它的返回值是一个Promise，所以我们可以进行链式调用
- Promise有三种状态：
  - 当then方法中的回调函数本身在执行的时候，那么它处于pending状态；
  - p当then方法中的回调函数返回一个结果时，那么它处于fulfilled状态，并且会将结果作为resolve的参数；
    - 情况一：返回一个普通的值；
    - 情况二：返回一个Promise；
    - 情况三：返回一个thenable值；
- 当then方法抛出一个异常时，那么它处于reject状态；

## catch方法

- catch方法也是Promise对象上的一个方法：它也是放在Promise的原型上的 Promise.prototype.catch
- 一个Promise的catch方法是可以被多次调用的：
  - 每次调用我们都可以传入对应的reject回调；
  - 当Promise的状态变成reject的时候，catch被执行；
- catch方法也是会返回一个Promise对象的，所以catch方法后面我们可以继续调用then方法或者catch方法

## finally方法

- finally是在ES9（ES2018）中新增的一个特性：表示无论Promise对象无论变成fulfilled还是reject状态，最终都会 被执行的代码。
- finally方法是不接收参数的，因为无论前面是fulfilled状态，还是reject状态，它都会执行。

## 类方法

### resolve方法

- 有时候我们已经有一个现成的内容了，希望将其转成Promise来使用，这个时候我们可以使用 Promise.resolve 方法来完成。
  - Promise.resolve的用法相当于new Promise，并且执行resolve操作
- resolve参数的形态：
  - 情况一：参数是一个普通的值或者对象
  - 情况二：参数本身是Promise
  - 情况三：参数是一个thenable

### reject方法

- reject方法类似于resolve方法，只是会将Promise对象的状态设置为reject状态。

- Promise.reject的用法相当于new Promise，只是会调用reject

  ```js
  const promise = Promise.reject("rejected message")
  // 相当于
  const promise2 = new Promsie((resolve, reject) => {
    reject("rejected message")
  })
  ```

- Promise.reject传入的参数无论是什么形态，都会直接作为reject状态的参数传递到catch的。

### all方法

- 它的作用是将多个Promise包裹在一起形成一个新的Promise；
- 新的Promise状态由包裹的所有Promise共同决定：
  - 当所有的Promise状态变成fulfilled状态时，新的Promise状态为fulfilled，并且会将所有Promise的返回值 组成一个数组；
  - 当有一个Promise状态为reject时，新的Promise状态为reject，并且会将第一个reject的返回值作为参数；

### allSettled方法

- all方法有一个缺陷：当有其中一个Promise变成reject状态时，新Promise就会立即变成对应的reject状态。
  - 那么对于resolved的，以及依然处于pending状态的Promise，我们是获取不到对应的结果的；
- 在ES11（ES2020）中，添加了新的API Promise.allSettled：
  - 该方法会在所有的Promise都有结果（settled），无论是fulfilled，还是reject时，才会有最终的状态；
  - 并且这个Promise的结果一定是fulfilled的；

### race方法

- 如果有一个Promise有了结果，我们就希望决定最终新Promise的状态，那么可以使用race方法：
  - race是竞技、竞赛的意思，表示多个Promise相互竞争，谁先有结果，那么就使用谁的结果；

### any方法

- any方法是ES12中新增的方法，和race方法是类似的：
  - any方法会等到一个fulfilled状态，才会决定新Promise的状态；
  - 如果所有的Promise都是reject的，那么也会等到所有的Promise都变成rejected状态；
- 如果所有的Promise都是reject的，那么会报一个AggregateError的错误。

## 手写简易版promise

```typescript
enum STATUS {
  PENDING = "pending",
  FULFILLED = "fulfilled",
  REJECTED = "rejected",
}

type AnyFn = (value?: any) => any;
type Executor = (resolve: AnyFn, reject: AnyFn) => void;

function execFunctionWithCatchError<T extends AnyFn>(execFn: T, value: any, resolve: T, reject: T) {
  try {
    const result = execFn(value)
    resolve(result)
  } catch (error) {
    reject(error)
  }
}

class HyhPromise {
  private currentStatus: string = STATUS.PENDING;
  private result: any;
  private resolveFns: AnyFn[] = [];
  private rejectFns: AnyFn[] = [];
  constructor(executor: Executor) {
    const resolve = (value: any) => {
      if (this.currentStatus === STATUS.PENDING) {
        queueMicrotask(() => {
          this.result = value;
          if (this.currentStatus !== STATUS.PENDING) return;
          this.currentStatus = STATUS.FULFILLED;
          this.resolveFns.forEach((fn) => fn());
        });
      }
    };
    const reject = (reason: any) => {
      if (this.currentStatus === STATUS.PENDING) {
        queueMicrotask(() => {
          this.result = reason;
          if (this.currentStatus !== STATUS.PENDING) return;
          this.currentStatus = STATUS.REJECTED;
          this.rejectFns.forEach((fn) => fn());
        });
      }
    };
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error)
    }
  }

  then(onResolve?: AnyFn, onReject?: AnyFn) {
    onResolve = onResolve || (res => res)
    onReject = onReject || (err => {throw err})
    return new HyhPromise((resolve, reject) => {
      if (this.currentStatus === STATUS.FULFILLED && onResolve) {
        execFunctionWithCatchError(onResolve, this.result, resolve, reject)
      }
      
      if (this.currentStatus === STATUS.REJECTED && onReject) {
        execFunctionWithCatchError(onReject, this.result, resolve, reject)
      }
      
      if (this.currentStatus !== STATUS.PENDING) return 
        
      onResolve &&
      this.resolveFns.push(() => {
        execFunctionWithCatchError(<AnyFn>onResolve, this.result, resolve, reject)
      });
      
      onReject &&
      this.rejectFns.push(() => {
        execFunctionWithCatchError(<AnyFn>onReject, this.result, resolve, reject)
      });
    });
  }

  catch(onReject: AnyFn) {
    return this.then(undefined, onReject);
  }

  finally(onfinally: AnyFn) {
    return this.then(onfinally, onfinally)
  }

  static resolve(result: any) {
    return new HyhPromise(resolve => resolve(result))
  }

  static reject(result: any) {
    return new HyhPromise((_, reject) => reject(result))
  }

  static all(promiseList: HyhPromise[]) {
    return new HyhPromise((resolve, reject) => {
      const values: any[] = []
      promiseList.forEach(promise => {
        promise.then(res => {
          values.push(res)
          values.length === promiseList.length && resolve(values)
        }).catch(err => {
          reject(err)
        })
      })
    })
  }

  static allSettled(promiseList: HyhPromise[]) {
    return new HyhPromise((resolve, reject) => {
      const values: Array<{status: string, value: any}> = []
      promiseList.forEach(promise => {
        promise.then(res => {
          values.push({ status: STATUS.FULFILLED, value: res })
          values.length === promiseList.length && resolve(values)
        }).catch(err => {
          values.push({ status: STATUS.REJECTED, value: err })
          values.length === promiseList.length && resolve(values)
        })
      })
    })
  }

  static race(promiseList: HyhPromise[]) {
    return new HyhPromise((resolve, reject) => {
      promiseList.forEach(promise => {
        promise.then(resolve, reject)
      })
    })
  }

  static any(promiseList: HyhPromise[]) {
    return new HyhPromise((resolve, reject) => {
      const values: any[] = []
      promiseList.forEach(promise => {
        promise.then(resolve, err => {
          values.push(err)
          values.length === promiseList.length && 
            reject(new AggregateError(values, 'All promises were rejected'))
        })
      })
    })
  }
}

const arr = [
  new HyhPromise((resolve, reject) => {
    setTimeout(() => { reject(1) }, 3000)
  }),
  new HyhPromise((resolve, reject) => {
    setTimeout(() => { reject(2) }, 3000)
  }),
  new HyhPromise((resolve, reject) => {
    setTimeout(() => { reject(3) }, 2000)
  })
]
```