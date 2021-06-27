const svgFiles = require.context('.', true, /\.svg$/);
console.log(svgFiles.keys())
const requireSvg = context => context.keys().map(context);
requireSvg(svgFiles);
