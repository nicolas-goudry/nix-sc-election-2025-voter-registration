import { Buffer } from "node:buffer"
import papa from "papaparse"

export default async function register(fastify) {
  fastify.get("/", async function (request, reply) {
    const isSessionValid = await fastify.validateSession(request, reply)

    if (!isSessionValid) {
      request.log.error("User session is not valid")

      return reply.viewAsync("error", {
        title: "Unauthorized",
        message: "Authentication is required to access the registration service.",
      })
    }

    const eligibility = await fastify.getEligibility(request)

    return reply.viewAsync("register", {
      eligibility,
    })
  })

  fastify.decorate("getEligibility", async (request, reply) => {
    const token = request.session.get("token")
    let csvContent

    try {
      request.log.info("Get eligible CSV file from election repository")

      const response = await fastify.axios.github.get("/repos/nixos/sc-election-2025/contents/eligible.csv", {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      })

      request.log.info(`Got HTTP ${response.status} response from GitHub API`)

      if (response.status < 300) {
        request.log.info(response.data, "JSON response")

        csvContent = Buffer.from(response.data.content, "base64").toString()
      }
    } catch (error) {
      request.log.error(error, "Failed to get CSV file content")

      return reply.viewAsync("register", {
        error: {
          title: "Oops!",
          message: `There was an error while retrieving the list of eligible voters: ${error.message}.`,
        },
      })
    }

    request.log.info("Parse CSV content")

    const { data, errors, meta } = papa.parse(csvContent, {
      dynamicTyping: true,
      header: true,
    })

    request.log.info({ entries: data.length, errors, meta }, "CSV parse results")

    if (data.length === 0) {
      return reply.viewAsync("register", {
        error: {
          title: "Oops!",
          message: `There was an error while parsing the list of eligible voters.`,
        },
      })
    }

    const user = request.session.get("user")
    const voter = data.find(({ githubId }) => githubId === user.id)

    request.log.info(`User is ${voter ? "" : "not "}eligible`)

    if (!voter) {
      return {
        email: undefined,
        isEligible: false,
      }
    }

    return {
      email: voter.email || user.email,
      isEligible: true,
      isRegistered: Boolean(voter.email),
    }
  })
}
