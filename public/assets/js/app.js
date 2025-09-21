// eslint-disable-next-line import-x/no-absolute-path
import { allDefined, registerIconLibrary } from '/assets/vendor/webawesome/webawesome.js'

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

async function validateRegisterForm () {
  const registerForm = document.getElementById('register')

  if (!registerForm) {
    return
  }

  const emailInput = registerForm.querySelector('wa-input')
  const realEmailInput = emailInput.shadowRoot.querySelector('input[name="email"]')
  const errorDialog = document.getElementById('error-dialog')

  registerForm.addEventListener('submit', (e) => {
    e.preventDefault()

    if (realEmailInput.value === emailInput.defaultValue) {
      errorDialog.open = true

      return
    }

    e.target.submit()
  })
}

document.addEventListener('DOMContentLoaded', () => {
  registerIconLibrary('default', {
    resolver (name, family = 'classic', variant = 'solid') {
      return getIconUrl(name, family, variant)
    },
  })

  allDefined().then(validateRegisterForm)
})
