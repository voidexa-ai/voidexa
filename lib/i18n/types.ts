export type Locale = 'en' | 'da'

export const LOCALES: Locale[] = ['en', 'da']
export const DEFAULT_LOCALE: Locale = 'en'

export interface Dict {
  common: {
    loading: string
    comingSoon: string
    close: string
    back: string
    viewDetails: string
    showAll: string // with {{count}}
    showLess: string
    unlocked: string
    locked: string
    getInTouch: string
  }
  nav: {
    home: string
    products: string
    universe: string
    about: string
    breakRoom: string
    items: Record<string, { label: string; description?: string }>
  }
  footer: {
    operating: string
    rights: string
  }
  home: {
    hint: string
    kcpTitle: string
    kcpSessions: string
    kcpCompress: string
    kcpRange: string
    kcpStatus: string
  }
  shop: {
    eyebrow: string
    title: string
    subtitle: string
    newPilotBundle: string
    starterPack: string
    starterDesc: string
    dailyFeatured: string
    resetsIn: string
    limitedEdition: string
    limited: string
    packContents: string
    previewNote: string
    comingSoonStripe: string
    metaTitle: string
    metaDescription: string
    tabs: {
      all: string
      featured: string
      ships: string
      trails: string
      cardPacks: string
      cockpits: string
      attachments: string
      effects: string
      emotes: string
    }
    rarity: {
      Common: string
      Uncommon: string
      Rare: string
      Epic: string
      Legendary: string
    }
    category: {
      ShipSkin: string
      Attachment: string
      Effect: string
      Trail: string
      CockpitTheme: string
      Emote: string
      CardPack: string
    }
    items: Record<string, { name: string; description: string }>
  }
  achievements: {
    metaTitle: string
    metaDescription: string
    eyebrow: string
    title: string
    progress: string // "{{unlocked}} / {{total}} unlocked"
    closeEsc: string
    titleComposer: string
    preview: string
    availableFragments: string
    emptyComposer: string
    categories: {
      Product: string
      Exploration: string
      PvP: string
    }
    tiers: {
      Bronze: string
      Silver: string
      Gold: string
    }
    items: Record<string, { name: string; description: string; titleFragment: string }>
  }
  languageSwitcher: {
    english: string
    danish: string
    switchTo: string
  }
  notFound: {
    title: string
    message: string
    backHome: string
  }
}
