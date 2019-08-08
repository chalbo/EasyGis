module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb'],
  env: {
    browser: true,
    node: true,
    es6: true, 
  },
  globals: {
    // APP_TYPE: true,
  },
  rules: {
       // 缩进
       "indent": 0,
       // 要求或禁止使用分号而不是 ASI（这个才是控制行尾部分号的，）
       "no-mixed-spaces-and-tabs": [1, "smart-tabs"],
       "semi": 0,
       "no-tabs": 0,
       "space-before-function-paren": [0, "always"],
       // 强制在注释中 // 或 /* 使用一致的空格
       "spaced-comment": 0,
       // always-multiline：多行模式必须带逗号，单行模式不能带逗号
       "comma-dangle": [1, "never"],
       // 强制使用一致的反勾号、双引号或单引号
       "quotes": 0,
       // allow paren-less arrow functions
       'arrow-parens': 0,
       // allow async-await
       // 'generator-star-spacing': 0,
       // allow debugger during development
       'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
       "eqeqeq": [0, "allow-null"] 
  },
  // settings: {
  //   polyfills: ['fetch', 'promises', 'url'],
  // },
};
