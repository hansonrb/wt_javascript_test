module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
    'es6': true
  },
  'parserOptions': {
    'ecmaFeatures': {
      'experimentalObjectRestSpread': true,
      'jsx': true
    },
    'sourceType': 'module'
  },
  'parser': 'babel-eslint',
  'plugins': ['react', 'flowtype'],
  'extends': ['airbnb', 'plugin:flowtype/recommended'],
  'settings': {
    'import/resolver': 'babel-root-import'
  },
  'rules': {
    'linebreak-style': [2, 'unix'],
    'jsx-quotes': [2, 'prefer-single'],
    'quotes': [2, 'single'],
    'quote-props': [2, 'consistent'],
    'semi': [2, 'never'],
    'no-unused-vars': [2, { 'vars': 'all', 'args': 'after-used', 'argsIgnorePattern': '^_' }],
    'comma-spacing': 0,
    'comma-dangle': 0,
    'object-curly-spacing': 0,
    'arrow-parens': 0,
    'new-cap': 0,
    'spaced-comment': 0,
    'no-confusing-arrow': 0,
    'no-console': 0,
    'camelcase': 0,
    'no-return-assign': 0,
    'prefer-template': 0,
    'max-len': 0,
    'no-multiple-empty-lines': 0,
    'arrow-body-style': [2, "as-needed"],
    'import/extensions': [2, 'never'],
    'import/prefer-default-export': 0,
    'react/prefer-es6-class': 0,
    'react/prefer-stateless-function': 0,
    'react/forbid-prop-types': 0,
    'react/no-unused-prop-types': 0,
    'react/jsx-space-before-closing': 0,
    'react/jsx-first-prop-new-line': 0,
    'react/jsx-boolean-value': 0,
    'react/sort-comp': 0,
    'react/jsx-closing-bracket-location': [2, 'after-props'],
    'react/jsx-wrap-multilines': 0,
    'react/jsx-filename-extension': [2, { 'extensions': ['.js', '.jsx'] }]
  }
}
