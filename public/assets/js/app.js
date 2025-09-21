// eslint-disable-next-line import-x/no-absolute-path
import { registerIconLibrary } from '/assets/vendor/webawesome/webawesome.js'

const getIconUrl = (name, family, variant) => {
  let folder = 'solid'

  // Classic
  if (family === 'classic') {
    if (variant === 'regular') folder = 'regular'
    if (variant === 'solid') folder = 'solid'
  }

  // Brands
  if (family === 'brands') {
    folder = 'brands'
  }

  return `/assets/vendor/fontawesome/svg/${folder}/${name}.svg`
}

registerIconLibrary('default', {
  resolver (name, family = 'classic', variant = 'solid') {
    return getIconUrl(name, family, variant)
  },
})
