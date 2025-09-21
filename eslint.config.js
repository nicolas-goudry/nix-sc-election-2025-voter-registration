import neo from 'neostandard'

export default [
  ...neo({
    ts: true,
  }),
  {
    rules: {
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
    },
  },
]
