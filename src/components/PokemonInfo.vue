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

const reducedWeaknesses = computed(() => {
    const rawEfficacies = pokemonInfo.value?.pokemon_v2_pokemon?.[0]?.pokemon_v2_pokemontypes
        .flatMap(type => type.pokemon_v2_type.pokemonV2TypeefficaciesByTargetTypeId)

    const groupedEfficacies = groupBy(rawEfficacies, efficacy => efficacy.pokemon_v2_type.name)

    const efficacies = []

    for (let value of Object.values(groupedEfficacies)) {
        let finalDamageFactor = value.map(efficacy => efficacy.damage_factor)
            .map(damageFactor => damageFactor / 100)
            .reduce((acc, cval) => acc * cval, 1)

        efficacies.push({
            damageFactor: finalDamageFactor * 100,
            source: value[0].pokemon_v2_type
        })
    }

    return efficacies
})

const weaknesses = computed(() => {
    const groupedByDamage = groupBy(reducedWeaknesses.value, weakness => weakness.damageFactor)
    const sortFn = (a, b) => a.pokemon_v2_typenames[0].name.localeCompare(b.pokemon_v2_typenames[0].name)
    return [
        {
            x0: groupedByDamage?.[0]?.map(weakness => weakness.source)?.sort(sortFn) || [],
            xp25: groupedByDamage?.[25]?.map(weakness => weakness.source)?.sort(sortFn) || [],
            xp5: groupedByDamage?.[50]?.map(weakness => weakness.source)?.sort(sortFn) || [],
            x1: groupedByDamage?.[100]?.map(weakness => weakness.source)?.sort(sortFn) || [],
            x2: groupedByDamage?.[200]?.map(weakness => weakness.source)?.sort(sortFn) || [],
            x4: groupedByDamage?.[400]?.map(weakness => weakness.source)?.sort(sortFn) || [],
        }
    ]
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
            <div>
                <h2>Weaknesses</h2>
                <DataTable :value="weaknesses">
                    <Column field="x0" header="0%">
                        <template #body="slotProps">
                            <div class="mb-1" v-for="pokeType in slotProps.data.x0" :key="'poketypeWeakness' + pokeType.id">
                                <TypeTag :pokeType="pokeType"/>
                            </div>
                        </template>
                    </Column>
                    <Column field="xp25" header="25%">
                        <template #body="slotProps">
                            <div class="mb-1" v-for="pokeType in slotProps.data.xp25" :key="'poketypeWeakness' + pokeType.id">
                                <TypeTag :pokeType="pokeType"/>
                            </div>
                        </template>
                    </Column>
                    <Column field="xp5" header="50%">
                        <template #body="slotProps">
                            <div class="mb-1" v-for="pokeType in slotProps.data.xp5" :key="'poketypeWeakness' + pokeType.id">
                                <TypeTag :pokeType="pokeType"/>
                            </div>
                        </template>
                    </Column>
                    <Column field="x1" header="100%">
                        <template #body="slotProps">
                            <div class="mb-1" v-for="pokeType in slotProps.data.x1" :key="'poketypeWeakness' + pokeType.id">
                                <TypeTag :pokeType="pokeType"/>
                            </div>
                        </template>
                    </Column>
                    <Column field="x2" header="200%">
                        <template #body="slotProps">
                            <div class="mb-1" v-for="pokeType in slotProps.data.x2" :key="'poketypeWeakness' + pokeType.id">
                                <TypeTag :pokeType="pokeType"/>
                            </div>
                        </template>
                    </Column>
                    <Column field="x4" header="400%">
                        <template #body="slotProps">
                            <div class="mb-1" v-for="pokeType in slotProps.data.x4" :key="'poketypeWeakness' + pokeType.id">
                                <TypeTag :pokeType="pokeType"/>
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>  
</template>