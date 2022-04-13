const path = require('path')
const HappyPack = require('HappyPack')
const CompressionPlugin = require('compression-webpack-plugin')
const Sprites = require('webpack-spritesmith')

module.exports = {
  publicPath: '/base-path',
  devServer: {
    port: 8000
  },
  // configureWebpack: {
  //   resolve: {
  //     alias: {
  //       '@': path.join(__dirname, 'src'),
  //       '@components': path.join(__dirname, 'src/components')
  //     }
  //   }
  // },
  configureWebpack: config => {
    config.name = 'vue.config'
    config.resolve.alias['@'] = path.join(__dirname, 'src')
    config.resolve.alias['@components'] = path.join(__dirname, 'src/components')
    config.resolve.plugins = [
      // new Sprites({
      //   src: {
      //     cwd: path.join(__dirname, 'src/assets/images/icon'),
      //     glob: '*.png'
      //   },
      //   target: {
      //     image: path.join(__dirname, 'src/assets/images/icon-output/sprite.png'),
      //     css: path.join(__dirname, 'src/assets/css/sprite.css')
      //   },
      //   apiOptions: {
      //     cssImageRef: '~sprite.png'
      //   }
      // })
    ]
  },
  chainWebpack: config => {
    config.module.rule('svg').exclude.add(path.join(__dirname, 'src/assets/images/svg'))

    const iconSvg = config.module.rule('iconSvg').include.add(path.join(__dirname, 'src/assets/images/svg')).end()
    iconSvg.test(/\.svg$/).use('svg-sprite-loader').loader('svg-sprite-loader').options({ symbolId: 'icon-[name]' })
  },

  runtimeCompiler: true
}
