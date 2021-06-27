const path = require('path');
const platform = process.platform;

module.exports = {
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', path.join(__dirname, 'src'))
    config.module
      .rule('svg')
      .exclude.add(path.join(__dirname, 'src/assets/icon'))
      .end();

    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(path.join(__dirname, 'src/assets/icon'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        // symbolId: 'icon-[name]'
        symbolId: function(paths) {
          const res = paths.substr(path.join(__dirname, 'src/assets/icon').length + 1).split(platform === 'linux' ? '/' : '\\');
          let symbolId = '';
          res.forEach((item, index) => {
            if (index === 0) {
              symbolId += item;
            } else {
              symbolId += item.replace(/^./, item.slice(0, 1).toUpperCase());
            }
          })
          return `icon-${path.basename(symbolId, '.svg')}`;
        }
      });
  }
}
