import js from '@eslint/js'
import typescript from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import prettier from 'eslint-config-prettier'

export default [
  js.configs.recommended,
  ...typescript.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  prettier,
  {
    files: ['*.vue', '**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: typescript.parser,
      },
    },
  },
  {
    ignores: ['dist/', 'node_modules/'],
  },
  {
    // TypeScript gère déjà la vérification des variables non définies.
    // no-undef ne connaît pas les types DOM (HTMLDivElement, etc.) sans config browser.
    files: ['**/*.ts', '**/*.vue'],
    rules: {
      'no-undef': 'off',
    },
  },
]
