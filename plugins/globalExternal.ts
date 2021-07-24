import MagicString from "magic-string";
import { Plugin } from 'vite';
function createPlugin(globals: Record<string, string>): Plugin {
  const getName = (name: string) => {
    if (Object.prototype.hasOwnProperty.call(globals, name)) {
      return globals[name];
    }
  }
  return {
    name: 'rollup-plugin-external-global',
    transform,
  }
  function transform(code, id) {
    console.log(id, id[0])
    if (Object.keys(globals).every(id => !code.includes(id))) {
      return;
    }
    const ast = this.parse(code);
    code = new MagicString(code);
    return {
      code: code.toString(),
      map: code.generateMap(),
    }
  }
}

export default createPlugin;
