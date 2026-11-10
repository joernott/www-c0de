import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import { languageOf, pathIn, type Language } from './language'
import { activeChapter, activeTab, localize, type Localized, type Navigation } from './navigation'
import { texts } from './texts'

export interface ThemeConfig {
  navigation: Navigation
}

// useBinder gives the components the language, the texts and the position of the current
// page in the navigation.
export function useBinder() {
  const { theme, page, frontmatter } = useData<ThemeConfig>()
  const route = useRoute()

  const language = computed<Language>(() => languageOf(route.path))
  const t = computed(() => texts[language.value])
  const navigation = computed(() => theme.value.navigation)
  const tab = computed(() => activeTab(navigation.value, route.path))
  const chapter = computed(() => activeChapter(tab.value, route.path))
  const notFound = computed(() => page.value.isNotFound || !!frontmatter.value.notFound)
  const atHome = computed(() => !notFound.value && pathIn(route.path, 'en') === '/')
  // The language switch leads to the same page in the other language.
  const otherLanguage = computed<Language>(() => (language.value === 'de' ? 'en' : 'de'))
  const otherPath = computed(() => pathIn(route.path, otherLanguage.value))

  // link returns the path of a page in the current language.
  const link = (path: string) => pathIn(path, language.value)
  const label = (text: Localized) => localize(text, language.value)

  // The imported pages name the mod and its version, and whether they are translated.
  const source = computed(() => frontmatter.value.source as string | undefined)
  const untranslated = computed(() => !!frontmatter.value.untranslated)

  return {
    route,
    language,
    t,
    navigation,
    tab,
    chapter,
    notFound,
    atHome,
    source,
    untranslated,
    otherLanguage,
    otherPath,
    link,
    label,
  }
}
