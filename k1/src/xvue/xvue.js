/**
 * 简易版的 Vue 实例
 *
 * */
const arrayProto = Object.create(Array.prototype);
['pop', 'push', 'shift', 'unshift', 'splice', 'reverse', 'sort'].forEach(m => {
  const fn = arrayProto[m]
  arrayProto[m] = function() {
    fn.apply(this, arguments)
  }
})

function defineReactive(obj, key, val) {
  observe(val)

  // 创建一个 Dep 实例用来管理响应的watcher 列表
  const dep = new Dep()

  Object.defineProperty(obj, key, {
    get() {
      Dep.target && dep.addDep(Dep.target)
      return val
    },
    set(newVal) {
      if(val !== newVal) {
        observe(val)
        val = newVal
        // watchers.forEach(w => {w && w.update()})
        dep.notify()
      }
    }
  })
}

function observe(obj) {
  if(typeof obj !== 'object' || obj === null) return

  // 创建观察者类
  new Observe(obj)
}

class Observe {
  constructor(obj) {
    this.walk(obj)
  }
  walk(obj) {
    if(Array.isArray(obj)) {
      obj.__proto__ = arrayProto
    } else {
      Object.keys(obj).forEach(key => {
        defineReactive(obj, key, obj[key])
      })
    }
  }
}

function proxy(vm) {
  Object.keys(vm.$data).forEach(key => {
    Object.defineProperty(vm, key, {
      get() {
        return vm.$data[key]
      },
      set(newVal) {
        vm.$data[key] = newVal
      }
    })
  })
  const methods = vm.$options.methods
  Object.keys(methods).forEach(key => {
    Object.defineProperty(vm, key, {
      get() {
        return methods[key]
      }
    })
  })
}

/**
 * 创建 Vue 类, 允许被实例化
 * **/
class Vue {
  constructor(options) {
    this.$options = options
    this.$data = options.data
    // 建立响应式属性及观察者模式
    observe(this.$data)

    // 设置代理
    proxy(this)

    // compile 编译模板
    new Compile(this, options.el)
  }
}

/**
 * 编译模板类
 * */
class Compile {
  constructor(vm, el) {
    this.$el = document.querySelector(el)
    this.$vm = vm

    this.compile(this.$el)
  }
  compile(el) { // 编译方法
    // 查找子节点
    if(!el) return
    const childNodes = el.childNodes
    Array.from(childNodes).forEach(node => {
      if(this.isElement(node)) { // 处理元素及动态指令
        this.compile(node)
        const attrs = node.attributes
        Array.from(attrs).forEach(attr => {
          const attrName = attr.name
          const exp = attr.value
          if(attrName.startsWith('x-')) {
            const dict = attrName.substring(2)
            this[dict] && this[dict](node, exp)
          }

          if(attrName.startsWith('@')) {
            const eventName = attrName.substring('1') // click 事件处理
            this.initEvent(node, eventName, exp)
          }
        })
      } else if(this.isInter(node)) { // 处理文本
        // 初始化动态文本内容
        this.compileText(node)
      }
    })
  }
  initEvent(node, eventName, exp) {
    node.addEventListener(eventName, (e) => {
      this.$vm[exp] && this.$vm[exp].call(this.$vm, e)
    })
  }

  model(node, exp) { // 双向数据绑定方法
    console.log(node.value, exp)
    node.addEventListener('input', () => {
      this.$vm[exp] = node.value
    })
    this.update(node, exp, 'model')
  }
  modelUpdater(node, value, exp) {
    // 初始化值
    node.value = value
  }
  update(node, exp, dict) { // updater 封装方法
    // 1、初始化内容区域
    const fn = this[dict + 'Updater']
    fn && fn(node, this.$vm[exp], exp)

    // 2、动态监听值变化

    new Watcher(this.$vm, exp, function(val) {
      fn && fn(node, val)
    })
  }
  text(node, exp) {
    this.update(node, exp,'text')
  }
  textUpdater(node, value) {
    node.textContent = value
  }
  html(node, exp) {
    // node.innerHTML = this.$vm[exp]
    this.update(node, exp, 'html')
  }
  htmlUpdater(node, value) {
    node.innerHTML = value
  }
  compileText(node) {
    // node.textContent = this.$vm[RegExp.$1.trim()]
    this.update(node, RegExp.$1.trim(), 'text')
  }

  isElement(node) {
    return node.nodeType === 1
  }
  isInter(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
  }
}
// const watchers = []

class Watcher {
  constructor(vm, key, updateFn) {
    this.vm = vm
    this.key = key
    this.updateFn = updateFn

    // watchers.push(this)

    /**
     * 主动触发 get 方法，使dep 与 watcher 建立联系
     * **/
    Dep.target = this
    this.vm[this.key]
    Dep.target = null
  }

  update() { // 被 Dep 进行调用更新
    this.updateFn.call(this.vm, this.vm[this.key])
  }
}

class Dep {
  constructor() {
    this.deps = [] // 存放watch实例
  }

  addDep(val) {
    this.deps.push(val)
  }

  notify() {
    this.deps.forEach(w => {
      w.update && w.update()
    })
  }
}
