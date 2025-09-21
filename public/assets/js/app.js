// eslint-disable-next-line import-x/no-absolute-path
import { registerIconLibrary } from '/assets/vendor/webawesome/webawesome.js'

function getIconUrl (name, family, variant) {
  let dir = 'solid'

  // Classic
  if (family === 'classic') {
    if (variant === 'regular') dir = 'regular'
    if (variant === 'solid') dir = 'solid'
  }

  // Brands
  if (family === 'brands') {
    dir = 'brands'
  }

  return `/assets/vendor/fontawesome/svg/${dir}/${name}.svg`
}

document.addEventListener('DOMContentLoaded', () => {
  registerIconLibrary('default', {
    resolver (name, family = 'classic', variant = 'solid') {
      return getIconUrl(name, family, variant)
    },
  })
})
