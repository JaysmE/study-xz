/***
 * reactive.js
 * Vue.util.defineReactive 方法实现
 *
 * */
const arrayProto = Object.create(Array.prototype);
['pop', 'push', 'unshift', 'shift', 'splice', 'sort', 'reverse'].forEach(key => {
  const func = arrayProto[key]
  arrayProto[key] = function() {
    func.apply(this, arguments)
  }
})

function defineReactive(obj, key, val) {
  observe(val)
  Object.defineProperty(obj, key, {
    get() {
      console.log('get', key)
      return val
    },
    set(newVal) {
      console.log('set', newVal)
      if(newVal !== val) {
        val = newVal
      }
    }
  })
}

/**
 * 递归遍历对象中的属性，依次成为响应式数据
 * */
function observe(obj) {
  if(typeof obj !== 'object' || obj === null) {
    return
  }
  if(Array.isArray(obj)) {
    obj.__proto__ = arrayProto
  } else {
    Object.keys(obj).forEach(key => {
      defineReactive(obj, key, obj[key])
    })
  }
}

/**
 * set 方法，重新赋值的属性，设置成响应式
 * */
function set(obj, key, val) {
  defineReactive(obj, key, val)
}

const obj = {
  foo: 'foo',
  bar: 'bar',
  two: { a: 1, b: 2 }
}
/**
 * 使obj中的数据成为响应式数据
 * */
// defineReactive(obj, 'foo', 'foo')
// defineReactive(obj, 'bar', 'bar')
/**
 * 使用 observe 方法实现
 *
 * */
observe(obj)

// obj.foo
// obj.foo = 'fooooo'
// obj.bar
// obj.bar = 'barrrrr'
// obj.two
obj.two.a
obj.two.b

set(obj, 'ding', 'ding')
obj.ding