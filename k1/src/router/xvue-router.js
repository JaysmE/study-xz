/**
 * 创建新的路由构造函数
 *
 * **/
let Vue

/**
 * 创建路由实例的时候
 * **/
class VueRouter {
  constructor(options) {
    const { defineReactive } = Vue.util
    this.$options = options
    this.current = window.location.hash.slice(1) || '/'
    // defineReactive(this, 'current', window.location.hash.slice(1) || '/')
    /**
     * matched 用来匹配当前路由
     * **/
    defineReactive(this, 'matched', [])
    this.match()

    window.addEventListener('hashchange', () => {
      this.current = location.hash.slice(1)
      this.matched = []
      this.match()
    })
  }

  match(routes) {
    routes = routes || this.$options.routes || []

    for (const route of routes) {
      if(route.path === '/' && this.current === '/') {
        this.matched.push(route)
        return
      }

      if(route.path !== '/' && this.current.indexOf(route.path) !== -1) {
        this.matched.push(route)
        if(route.children) {
          this.match(route.children)
        }
        return
      }

    }
  }
}

// install 方法执行比实例化路由要早一些
VueRouter.install = function (_Vue) {
  Vue = _Vue

  // 全局混入
  Vue.mixin({
    beforeCreate() {
      if(this.$options.router) { // 根实例组件第一次执行的时候
        // 每个组件实例上面都挂载 $router 对象
        Vue.prototype.$router = this.$options.router
      }
    }
  })

  Vue.component('router-link', {
    props: {
      to: {
        require: true,
        type: [String, Object]
      }
    },
    render(h) {
      return h('a', { attrs: { href: '#' + this.to } }, this.$slots.default)
    }
  })
  Vue.component('router-view', {
    render(h) {
      /**
       * 获取当前路径, 重新渲染 router-view
       *
       * **/
      this.$vnode.data.routerView = true
      /**
       * 查找父级组件
       * **/
      let parent = this.$parent
      let depth = 0

      while(parent) {
        const vNodeData = parent.$vnode && parent.$vnode.data
        if(vNodeData) {
          if(vNodeData.routerView) {
            depth++
          }
        }
        parent = parent.$parent
      }
      console.log(this.$router.matched)
      let component = null
      const route = this.$router.matched[depth]
      return h(route ? route.component : null)
    }
  })
}

export default VueRouter