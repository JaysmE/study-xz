const arrayPrototype = Object.create(Array.prototype);
['pop', 'push', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(m => {
  const originFn = Array.prototype[m]
  arrayPrototype[m] = () => {
    originFn.apply(this, arguments)
    const ob = this.__ob__
    let inserted;
    switch (m) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if(inserted) { ob.observeArray(inserted) }


  }
})

function sameVnode(a, b) {
  return a.key === b.key && a.tag === b.tag && a.props === b.props
}

function defineReactive(obj, key, val) {
  observe(val) // 递归遍历子属性
  const dep = new Dep()
  Object.defineProperty(obj, key, {
    get() {
      Dep.target && dep.addSub(Dep.target)
      return val
    },
    set(newVal) {
      if(val !== newVal) {
        val = newVal
        dep.notify()
      }
    }
  })
}

function observe(obj) {
  if(typeof obj !== 'object' || obj === null) {
    return
  }
  const ob = new Observer(obj)
  return ob
}

class Observer {
  constructor(obj) {
    this.value = obj
    this.dep = new Dep()

    Object.defineProperty(obj, '__ob__', this)
    if(Array.isArray(obj)) {
      obj.__proto__ = arrayPrototype
      this.observeArray(obj)
    } else {
      this.walk(obj)
    }
  }
  walk(obj) {
    Object.keys(obj).forEach(k => {
      defineReactive(obj, k, obj[k])
    })
  }
  observeArray(obj) {
    for(let i ; i < obj.length; i++) {
      observe(obj[i])
    }
  }
}

class Vue {
  constructor(options) {
    this.$options = options
    this.$data = options.data
    this.$el = document.querySelector(options.el)
    observe(this.$data)
    proxy(this)
    // 开始编译
    // new Compiler()

    if(this.$options.el) {
      this.$mount(this.$el)
    }
  }
  $mount(el) {
    let { render } = this.$options
    render = render.bind(this)
    const h = this.createElement
    let updateComponent = () => {
      const vnode = render(h)
      this._update(vnode)
    }
    new Watcher(this, updateComponent)
  }
  _update(vnode) {
    const prevVnode = this._vnode
    if(!prevVnode) {
      this.patch(this.$el, vnode)
    } else {
      this.patch(prevVnode, vnode)
    }

  }
  patch(oldVnode, vnode) {
    const parent = oldVnode.parentNode
    const refElm = oldVnode.nextSibling
    if(oldVnode.nodeType) {
      const el = this.createElm(vnode)
      parent.insertBefore(el, refElm)
      parent.removeChild(this.$el)
      this.$el = vnode.elm = el

      console.log(vnode)
    } else {
      this.patchVnode(oldVnode, vnode)
    }
    this._vnode = vnode
  }
  patchVnode(oldVnode, vnode) {
    if(oldVnode === vnode) {
      return
    }
    const elm = vnode.elm = oldVnode.elm
    const oldCh = oldVnode.children
    const ch = vnode.children
    console.log(oldCh, ch)
    const oldProps = oldVnode.props || {}
    const newProps = vnode.props || {}
    // 属性更新
    for (const k in newProps) {
      if(newProps[k] !== oldProps[k]) {
        elm.setAttribute(k, newProps[k])
      }
    }
    // 属性删除
    for(const k in oldProps) {
      if(newProps[k] === undefined) {
        elm.removeAttribute(k)
      }
    }

    if(typeof ch === 'string') {
      if(typeof oldCh === 'string') {
        if(ch !== oldCh) {
          elm.textContent = ch
        }
      } else {
        elm.textContent = ch
      }
    } else if(typeof oldCh === 'string') {
      elm.innerHTML = ''
      console.log(ch, 'ch')
      ch.forEach(v => {
        const child = this.createElm(v)
        elm.append(child)
      })
    } else {
      if(oldCh && ch) {
        if(oldCh !== ch) {
          this.updateChildren(elm, oldCh, ch)
        }
      }
    }


  }

  updateChildren(parentElm, oldCh, newCh) {
    let oldStartIdx = 0
    let newStartIdx = 0
    let oldEndIdx = oldCh.length - 1
    let oldStartVnode = oldCh[0]
    let oldEndVnode = oldCh[oldEndIdx]
    let newEndIdx = newCh.length - 1
    let newStartVnode = newCh[0]
    let newEndVnode = newCh[newEndIdx]
    while(oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if(sameVnode(oldStartVnode, newStartVnode)) {
        this.patchVnode(oldStartVnode, newStartVnode)
        oldStartVnode = oldCh[++oldStartIdx]
        newStartVnode = newCh[++newStartIdx]
      }
    }
  }

  createElm(vnode) {
    const { tag, props, children } = vnode
    const el = document.createElement(tag)
    for (const k in props) {
      el.setAttribute(k, props[k])
    }
    if(vnode.children) {
      if(typeof vnode.children === 'string') {
        el.textContent = vnode.children
      } else {
        vnode.children.forEach(v => {
          const child = this.createElm(v)
          v.elm = child
          el.appendChild(child)
        })
      }
    }
    vnode.elm = el
    return el
  }

  createElement(tag, props, children) {
    return { tag, props, children }
  }
}

class Watcher {
  constructor(vm, fn) {
    this.vm = vm
    this.getter = fn

    this.get()
  }
  get() {
    Dep.target = this
    this.getter()
    Dep.target = null
  }
  update() {
    this.getter()
  }
  notify() {
    this.getter()
  }
}

class Compiler { // 编译开始
}

function proxy(vm) {
  const data = vm.$data
  Object.keys(data).forEach(k => {
    Object.defineProperty(vm, k, {
      get() {
        return data[k]
      },
      set(newVal) {
        vm.$data[k] = newVal
      }
    })
  })

}

class Dep {
  constructor() {
    this.deps = new Set()
  }
  addSub(w) {
    this.deps.add(w)
  }
  notify() {
    this.deps.forEach(w => {
      w.update && w.update()
    })
  }
}


