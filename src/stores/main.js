import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
    state: () => ({
        languages: {},
        selectedLanguage: 'de',
    }),

    getters: {
        selectedLanguageData: (state) => {
            return state.languages?.pokemon_v2_language?.filter(lang => lang.iso3166 === state.selectedLanguage)?.[0]
        },
    },

    actions: {
        setLanguages(languages) {
            this.languages = languages
        },
        setSelectedLanguage(language) {
            this.selectedLanguage = language
        },
    }
})