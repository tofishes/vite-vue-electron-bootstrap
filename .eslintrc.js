module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: ['plugin:vue/essential', 'standard', 'prettier'],
  parserOptions: {
    ecmaVersion: 12,
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    // 'prettier/prettier': 'error',
    camelcase: 'off', // ['error', { properties: 'never', ignoreDestructuring: true }]
    'react/prop-types': 'off',
    'react/display-name': 'off',
    'array-callback-return': 'off',
    'no-unused-vars': 'warn',
    'space-before-function-paren': 'off',
    'no-use-before-define': 'off',
    // 'max-len': ['error', { code: 80 }],
    // 'array-element-newline': ['error', 'never'], // 和prettier产生冲突
    'import/order': [
      'error',
      {
        groups: [
          'builtin', // Built-in types are first
          'external',
          'internal',
          'parent',
          'sibling',
          // ['parent', 'sibling'], // Then sibling and parent types. They can be mingled together
          'index', // Then the index file
          'object' // Then the rest: internal and external type
        ],
        'newlines-between': 'always'
      }
    ],
    'padding-line-between-statements': [
      // 块级前后加空行，表达式前后加空行
      'error',
      { blankLine: 'always', prev: 'block-like', next: '*' },
      { blankLine: 'always', prev: '*', next: 'block-like' },
      { blankLine: 'always', prev: 'expression', next: '*' },
      { blankLine: 'always', prev: '*', next: 'expression' },
      { blankLine: 'always', prev: '*', next: 'return' },
      { blankLine: 'always', prev: 'import', next: 'expression' }
    ],
    'no-else-return': ['error', { allowElseIf: false }] // if return 则去掉else
  }
}
