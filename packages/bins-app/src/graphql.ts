import { ApolloClient, InMemoryCache } from '@apollo/client'

//const uri = 'http://localhost:4010'
//const uri = 'https://bins.joshbalfour.co.uk/api'
const uri = 'https://bins.home.fa.gl/api'

export const client = new ApolloClient({
  uri,
  cache: new InMemoryCache()
})
