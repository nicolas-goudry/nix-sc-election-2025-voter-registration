import fp from 'fastify-plugin'
import { v4 as uuid } from 'uuid'
import { type Operation, OperationStatus } from '../../../schemas/operation.js'

declare module 'fastify' {
  interface FastifyInstance {
    operation: ReturnType<typeof createOperationManager>;
  }
}

const operationStore = new Map<string, Operation>()

function createOperationManager () {
  function create (): Operation {
    const id = uuid()
    const operation = {
      id,
      status: OperationStatus.run,
    }

    operationStore.set(id, operation)

    return operation
  }

  function get (id: string): Operation | undefined {
    if (has(id)) {
      return operationStore.get(id) as Operation
    }
  }

  function has (id: string) {
    return operationStore.has(id)
  }

  function remove (id: string) {
    operationStore.delete(id)
  }

  function update (id: string): Operation {
    const operation = get(id)

    if (!operation) {
      throw new Error('Unknown operation')
    }

    return operation
  }

  return {
    create,
    get,
    has,
    remove,
    update,
  }
}

export default fp(async function (fastify) {
  fastify.decorate('operation', createOperationManager())
})
