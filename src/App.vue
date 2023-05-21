<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import Navbar from './components/Navbar.vue'

import PokemonInfo from './components/PokemonInfo.vue'

import { listLanguages } from './queries'

import { useMainStore } from './stores/main'

const mainStore = useMainStore()
mainStore.setLanguages(listLanguages())

const { selectedPokemon } = storeToRefs(mainStore)
</script>

<template>
    <div>
        <Navbar />

        <div class="px-4 py-8 md:px-6 lg:px-8">
            <PokemonInfo :pokemonId="selectedPokemon" :key="'pokeinfo' + selectedPokemon" v-if="selectedPokemon" />
            <Message v-else>Please search a Pokemon in the search bar above</Message>
        </div>
    </div>
</template>

<style>
body {
    margin: 0;
}
</style>
