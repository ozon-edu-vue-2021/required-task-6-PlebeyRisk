module.exports = {
  plugins: [
    require('postcss-cssnext')({
      features: {
        customProperties: {
          variables: require('./src/constants/colors.js'),
        },
      },
    }),
  ],
};
