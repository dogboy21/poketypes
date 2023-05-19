import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

export function listLanguages() {
    const { result } = useQuery(gql`
        query listLanguages {
            pokemon_v2_language(where: {official: {_eq: true}}) {
                id
                iso3166
                name
                pokemonV2LanguagenamesByLocalLanguageId {
                    language_id
                    name
                }
            }
        }
    `)

    return result
}

export function searchForPokemonInLanguage(languageId, query) {
    const { result } = useQuery(gql`
        query searchForPokemonInLanguage($langId: Int!, $query:String!) {
            pokemon_v2_pokemonspecies(
                limit: 10, 
                where: {
                    pokemon_v2_pokemonspeciesnames: {
                        pokemon_v2_language: { id: {_eq: $langId} }
                        name: { _iregex: $query }
                    }
                }
            ) {
                pokemon_v2_pokemonspeciesnames(where: { pokemon_v2_language: { id: {_eq: $langId} } }) {
                    name
                }
                id
            }
        }
    `, {
        langId: languageId,
        query: `.*${query}.*`
    })

    return result
}

export function getPokemonInfo(langId, specyId) {
    const { result } = useQuery(gql`
        query getPokemonInfo($langId: Int!, $specyId: Int!) {
            pokemon_v2_pokemon(where: {pokemon_v2_pokemonspecy: {id: {_eq: $specyId}}}) {
                id
                name
                pokemon_v2_pokemontypes {
                    pokemon_v2_type {
                        name
                        id
                        pokemon_v2_typenames(where: {language_id:{_eq: $langId}}) {
                            name
                        }
                        pokemonV2TypeefficaciesByTargetTypeId {
                            id
                            damage_factor
                            pokemonV2TypeByTargetTypeId {
                                id
                                name
                            }
                            pokemon_v2_type {
                                name
                                id
                                pokemon_v2_typenames(where: {language_id:{_eq: $langId}}) {
                                name
                                }
                            }
                        }
                    }
                }
                pokemon_v2_pokemonspecy {
                    pokemon_v2_pokemonspeciesnames(where: {language_id: {_eq: $langId}}) {
                        name
                    }
                }
                pokemon_v2_pokemonsprites {
                    sprites
                }
            }
        }
    `, {
        langId, specyId
    })

    return result
}
