<script setup>
import { computed } from 'vue'
import TypeTag from './TypeTag.vue'

import { getPokemonInfo } from '../queries'

const props = defineProps(['pokemonId'])

import { useMainStore } from '../stores/main'
const mainStore = useMainStore()

const pokemonInfo = getPokemonInfo(mainStore.selectedLanguageData.id, props.pokemonId)

const pokemonSprites = computed(() => {
    const spriteData = pokemonInfo.value?.pokemon_v2_pokemon?.[0]?.pokemon_v2_pokemonsprites?.[0]
    if (!spriteData) {
        return null
    }

    return JSON.parse(spriteData.sprites)
})

const groupBy = (arr, keyFn) => {
    const initialValue = {};
    return arr.reduce((acc, cval) => {
        const myAttribute = keyFn(cval);
        acc[myAttribute] = [...(acc[myAttribute] || []), cval]
        return acc;
    }, initialValue);
}

const reducedEfficacies = computed(() => {
    const rawEfficacies = pokemonInfo.value?.pokemon_v2_pokemon?.[0]?.pokemon_v2_pokemontypes
        .flatMap(type => type.pokemon_v2_type.pokemonV2TypeefficaciesByTargetTypeId)
        .map(efficacy => {
            return {
                ...efficacy,
                description: `${efficacy.pokemon_v2_type.name} -> ${efficacy.pokemonV2TypeByTargetTypeId.name}`
            }
        })

    const groupedEfficacies = groupBy(rawEfficacies, efficacy => efficacy.pokemon_v2_type.name)

    const efficacies = []

    for (let value of Object.values(groupedEfficacies)) {
        let finalDamageFactor = value.map(efficacy => efficacy.damage_factor)
            .map(damageFactor => damageFactor / 100)
            .reduce((acc, cval) => acc * cval, 1)

        efficacies.push({
            damageFactor: finalDamageFactor * 100,
            source: value[0].pokemon_v2_type.pokemon_v2_typenames[0].name
        })
    }

    return efficacies.sort((a, b) => b.damageFactor - a.damageFactor)
})
</script>

<template>
    <div class="surface-card p-4 shadow-2 border-round" v-if="pokemonInfo">
        <div class="mb-3 flex flex-column md:flex-row md:align-items-center md:justify-content-between">
            <div class="flex align-items-start">
                <img v-if="pokemonSprites" :src="pokemonSprites.front_default.replace('/media', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/')" alt="Pokemon front sprite" height="60" />
                <div>
                    <div class="text-2xl font-medium text-900 mb-2">
                        {{ pokemonInfo.pokemon_v2_pokemon[0].pokemon_v2_pokemonspecy.pokemon_v2_pokemonspeciesnames[0].name }}
                    </div>
                    <div class="font-medium text-500 mb-3 text-sm">
                        <TypeTag v-for="pokeType in pokemonInfo.pokemon_v2_pokemon[0].pokemon_v2_pokemontypes" :key="'poketype' + pokeType.pokemon_v2_type.id" :pokeType="pokeType"/>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="surface-border">
            <h2>Efficacies</h2>
            <ul>
                <li v-for="(efficacy, index) in reducedEfficacies" :key="index">
                    {{ efficacy.source }} - {{ efficacy.damageFactor }}%
                </li>
            </ul>
        </div>
    </div>  
</template>