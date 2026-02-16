import { Router } from 'src/core/Router'

Router.get('/', ({ res }) => {
  res.send('Hello World')
})
