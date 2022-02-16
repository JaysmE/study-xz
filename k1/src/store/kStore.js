/**
 * 手写store
 *
 * **/

let Vue

class Store {
  constructor(options) {
    this.$options = options
    // this.state = options.state
    this._mutations = options.mutations
    this._actions = options.actions
    // console.log(this.state)
    this._wrapperGetters = options.getters

    const computed = {}
    this.getters = {}


    this.commit = this.commit.bind(this)
    this.dispatch = this.dispatch.bind(this)

    for (const key in this._wrapperGetters) {
      const _this = this
      const fn = this._wrapperGetters[key]
      computed[key] = () => {
        return fn(_this.state)
      }
      Object.defineProperty(this.getters, key, {
        get() {
          return _this._vm[key]
        }
      })
    }


    this._vm = new Vue({
      data() {
        return {
          $$state: options.state
        }
      },
      computed
    })
  }

  get state() {
    return this._vm.$data.$$state
  }
  set state(val) {
    console.warn('please use mutation replace')
  }

  commit(type, val) {
    const mutations = this._mutations
    if(mutations[type]) {
      mutations[type](this.state, val)
    } else {
      console.warn('unknow mutations' + type)
    }
  }

  dispatch(type, payload) {
    const actions = this._actions
    if(actions[type]) {
      const { commit, getters } = this
      actions[type](this, payload)
    } else {
      console.warn('unknow actions', + type)
    }
  }
}

function install (_Vue) {
  Vue = _Vue

  Vue.mixin({
    beforeCreate() {
      if(this.$options.store) {
        Vue.prototype.$store = this.$options.store
      }
    }
  })
}

export default { Store, install }
