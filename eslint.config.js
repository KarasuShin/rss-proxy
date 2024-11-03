import { karasu } from '@karasushin/eslint-config'

export default karasu({
  typescript: true,
}).concat({
  rules: {
    'no-console': 'off',
  },
})
