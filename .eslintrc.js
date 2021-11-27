module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential'],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'semi': 'error',
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'curly': 'error',
    // "comma-dangle": ["error", {
    //   "arrays": "always",
    //   "objects": "always",
    //   "imports": "always",
    //   "exports": "always",
    //   "functions": "never"
    // }]
    // 'prettier/prettier': [
    //   'warn',
    //   {
    //     tabWidth: 2,
    //     singleQuote: true,
    //   },
    // ],
  },
};
