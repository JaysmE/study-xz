import SvgIcon from '@/components/svg-icon.vue'

const req = import.meta.globEager('../svg/*.svg')
console.log(req)

Object.keys(req).forEach(key => {
  // console.log(key)
  const wx = require('@/svg/wx.svg')
})
export default function(app) {
  app.component('svg-icon', SvgIcon)
}