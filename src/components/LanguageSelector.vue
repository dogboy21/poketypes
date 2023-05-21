<script setup>
import { computed } from 'vue'
import { useMainStore } from '../stores/main'

const mainStore = useMainStore()

function getFlagEmoji(countryCode) {
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char =>  127397 + char.charCodeAt())
        
    return String.fromCodePoint(...codePoints)
}

const languageOptions = computed(() => {
    return mainStore.languages?.pokemon_v2_language?.map(lang => {
        const langFlag = getFlagEmoji(lang.iso3166)
        const langName = mainStore.selectedLanguageData.pokemonV2LanguagenamesByLocalLanguageId.filter(locale => locale.language_id === lang.id)?.[0]?.name || lang.name

        const displayName = `${langFlag} ${langName}`

        return {
            value: lang.iso3166,
            text: displayName
        }
    }) || []
})
</script>


<template>
    <Dropdown v-model="mainStore.selectedLanguage" :options="languageOptions" optionLabel="text" optionValue="value" />
</template>

<style scoped>
.p-dropdown {
    background: transparent;
    border: none;
}
</style>