<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

import { ref, computed, watch } from 'vue'
import { useMainStore } from '../stores/main'
import { searchForPokemonInLanguage } from '../queries'

const mainStore = useMainStore()

const searchValue = ref('')

const responseItems = ref({})
const suggestionItems = ref([])

function onSearch(event) {
    const results = searchForPokemonInLanguage(mainStore.selectedLanguageData.id, event.query)
    responseItems.value = results
}

function onChange(event) {
    if (event.value.code) {
        emit('update:modelValue', event.value.code)
    }
}

watch(responseItems, (newValue, oldValue) => {
    if (!newValue.value) {
        return
    }

    suggestionItems.value = newValue.value.pokemon_v2_pokemonspecies.map(species => {
        return {
            code: species.id,
            name: species.pokemon_v2_pokemonspeciesnames?.[0]?.name
        }
    })
}, { deep: true })
</script>

<template>
    <AutoComplete v-model="searchValue" :suggestions="suggestionItems" optionLabel="name" @complete="onSearch" @change="onChange" />
</template>