import js from '@eslint/js'
import prettier from 'eslint-config-prettier/flat'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['.vitepress/cache/', '.vitepress/.temp/', 'node_modules/', '.cache/', 'public/img/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
  },
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  // Prettier formats the code; the formatting rules of ESLint are switched off.
  prettier,
)
