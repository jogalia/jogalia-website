import vuetify from 'eslint-config-vuetify'

export default vuetify({
  ts: true,
},
{
  files: ['src/**/*.{ts,vue,js}'],
  rules: {
    'unicorn/no-array-sort': 'off',
  },
})
