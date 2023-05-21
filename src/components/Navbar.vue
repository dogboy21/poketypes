<script setup>
import LanguageSelector from './LanguageSelector.vue'
import PokemonSearch from './PokemonSearch.vue'

import { storeToRefs } from 'pinia'
import { useMainStore } from '../stores/main'

const mainStore = useMainStore()
const { selectedPokemon } = storeToRefs(mainStore)
</script>

<template>
    <div class="bg-gray-900 shadow-2 flex relative lg:static" style="min-height: 84px">
        <div class="flex align-items-center justify-content-center px-5 bg-gray-800">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" alt="Image" height="64">
        </div>
        <div class="flex flex-1 px-3">
            <span class="flex align-items-center">
                <i class="pi pi-search text-gray-500"></i>
            </span>
            <PokemonSearch v-model="selectedPokemon" />
        </div>
        <a v-ripple class="cursor-pointer flex align-items-center justify-content-center lg:hidden text-white pr-5 mt-1 p-ripple"
            v-styleclass="{ selector: '@next', enterClass: 'hidden', leaveToClass: 'hidden', hideOnOutsideClick: true }">
            <i class="pi pi-bars text-4xl"></i>
        </a>
        <div class="lg:flex hidden absolute lg:static left-0 top-100 z-1 shadow-2 lg:shadow-none lg:pr-5 w-full lg:w-auto bg-gray-900">
            <ul class="list-none p-0 m-0 flex select-none flex-column lg:flex-row border-top-1 border-gray-800 lg:border-top-none">
                <li>
                    <span class="h-full flex px-6 py-3 lg:px-3 lg:py-0 align-items-center text-gray-500 font-medium">
                        <LanguageSelector />
                    </span>
                </li>
            </ul>
        </div>
    </div>
</template>