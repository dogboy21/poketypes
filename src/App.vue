<script setup>
import { ref } from 'vue'

import LanguageSelector from './components/LanguageSelector.vue'
import PokemonSearch from './components/PokemonSearch.vue'
import PokemonInfo from './components/PokemonInfo.vue'

import { listLanguages, getPokemonTypes } from './queries'

import { useMainStore } from './stores/main'

const selectedPokemon = ref(null)

const mainStore = useMainStore()
mainStore.setLanguages(listLanguages())
</script>

<template>
    <div>
        <LanguageSelector />
        <PokemonSearch v-model="selectedPokemon" />
        <PokemonInfo :pokemonId="selectedPokemon" :key="'pokeinfo' + selectedPokemon" v-if="selectedPokemon" />
    </div>
</template>

<style scoped>

</style>
