import { createApp, provide, h } from 'vue'
import App from './App.vue'

import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/lara-light-indigo/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeflex/primeflex.css'

import { createPinia } from 'pinia'

import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import { DefaultApolloClient, provideApolloClient } from '@vue/apollo-composable'

const apolloClient = new ApolloClient({
    link: createHttpLink({
        uri: 'https://beta.pokeapi.co/graphql/v1beta',
    }),
    cache: new InMemoryCache(),
})
provideApolloClient(apolloClient)

const pinia = createPinia()

const app = createApp({
    setup() {
        provide(DefaultApolloClient, apolloClient)
    },

    render: () => h(App),
})

app.use(PrimeVue)
app.use(pinia)

import Dropdown from 'primevue/dropdown'
import AutoComplete from 'primevue/autocomplete'

app.component('Dropdown', Dropdown)
app.component('AutoComplete', AutoComplete)

app.mount('#app')
