import { registerIconLibrary } from "../../../../../../../public/vendor/webawesome/webawesome.js"

const getIconUrl = (name, family, variant) => {
  let folder = "solid"

  // Classic
  if (family === "classic") {
    if (variant === "regular") folder = "regular"
    if (variant === "solid") folder = "solid"
  }

  // Brands
  if (family === "brands") {
    folder = "brands"
  }

  return `/public/vendor/fontawesome/svg/${folder}/${name}.svg`
}

registerIconLibrary("default", {
  resolver(name, family = "classic", variant = "solid") {
    return getIconUrl(name, family, variant)
  },
})
