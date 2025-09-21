// eslint-disable-next-line import-x/no-absolute-path
import { allDefined } from '/assets/vendor/webawesome/webawesome.js'

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
  allDefined().then(validateRegisterForm)
})
