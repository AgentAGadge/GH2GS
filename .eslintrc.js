module.exports = {
  "extends": [
    "standard",
    "plugin:jsdoc/recommended-error"
  ],
  "overrides": [
  ],
  "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
  },
  "globals": {
      "browser": true,
      "console": true
    },
    "rules": {
      "no-unused-vars": "off",
      "no-undef": "off",
      "yoda": "off",
      "jsdoc/require-jsdoc": ["error", {"require": {
        "FunctionExpression": true,
        "ClassDeclaration": true,
        "MethodDefinition": true,
        "ArrowFunctionExpression": true,
        "ClassExpression": true
      }}],
    },
    "plugins": [
      "jsdoc"
  ]
}  