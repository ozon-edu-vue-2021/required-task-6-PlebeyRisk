const defaultTypes = {
  array(defaultValue = () => []) {
    return {
      type: Array,
      default: defaultValue,
    };
  },
  object(defaultValue = () => ({})) {
    return {
      type: Object,
      default: defaultValue,
    };
  },
  boolean(defaultValue = false) {
    return {
      type: Boolean,
      default: defaultValue,
    };
  },
  string(defaultValue) {
    return {
      type: String,
      default: defaultValue,
    };
  },
  number(defaultValue) {
    return {
      type: Number,
      default: defaultValue,
    };
  },
};

export default defaultTypes;
