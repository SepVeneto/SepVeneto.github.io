import bcTable from './bcTable';
import bcSearch from './bcSearch';
import bcInput from './bcInput';
import SvgIcon from './SvgIcon.vue';
const bcComponents = require.context('.', false, /bc.*\.(jsx|vue)+/);
const requireComp = context => context.keys().map(context);

const install = function (Vue) {
  [...requireComp(bcComponents), bcTable, bcSearch, bcInput, SvgIcon].forEach(item => {
    if (item.name) {
      Vue.component(item.name, item);
    } else {
      Vue.component(item.default.name, item.default);
    }
  })
}

export default install;
