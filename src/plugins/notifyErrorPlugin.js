import { notifyError, } from '../error';

export default {
  install(Vue) {
    Vue.prototype.$notifyError = (message) => {
      notifyError(message);
    };
  },
};
