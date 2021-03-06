module.exports = {
  "extends": "airbnb",
  "parser": "babel-eslint",
  "env": {
    "browser": true,
    "node": true,
    "mocha": true
  },
  "globals": {
    "Babel": true,
    "React": true
  },
  "plugins": [
    "react"
  ],
  "rules": {
    "global-require": "off",
    "import/no-unresolved": "off",
    "no-underscore-dangle": "off",
    "no-new-func": "off",
    "no-param-reassign": "off",
    "react/prefer-stateless-function": "off",
    "react/no-multi-comp": "off",
    "react/jsx-no-bind": "off",
    "react/jsx-indent": "off",
    "react/jsx-first-prop-new-line": "off",
    "react/jsx-filename-extension": "off",
    "no-restricted-syntax": "off",
    'react/require-default-props': 0,
    camelcase: 1
  }
}
