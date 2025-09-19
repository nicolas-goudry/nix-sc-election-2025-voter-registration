import path from "node:path"
import ejs from "ejs"

export const autoConfig = {
  root: path.resolve(import.meta.dirname, "../../../templates"),
  engine: {
    ejs,
  },
  layout: "layouts/layout",
  viewExt: "ejs",
  defaultContext: {
    footerLinks: {
      discourseAnnouncement:
        "https://discourse.nixos.org/t/the-election-committee-announces-the-second-steering-committee-election/69354",
      electionRepo: "https://github.com/NixOS/SC-election-2025",
      githubAnnouncement: "https://github.com/NixOS/org/issues/163",
      sourceRepo: "https://github.com/nicolas-goudry/nix-sc-election-2025-voter-registration",
    },
    electionsEmail: "mailto:elections@nixos.org",
  },
}

/**
 * This plugins adds support for templating engines
 *
 * @see {@link https://github.com/fastify/fastify-view}
 */

export { default } from "@fastify/view"
