import EN_US from './en-US'
import PT_BR from './pt-BR'

export enum Languages {
  EN_US = 'en-US',
  PT_BR = 'pt-BR',
}

const messages = {
  [Languages.EN_US]: EN_US,
  [Languages.PT_BR]: PT_BR,
}

const i18n = createI18n({
  locale: Languages.PT_BR,
  fallbackLocale: Languages.EN_US,
  messages,
})

export default i18n
