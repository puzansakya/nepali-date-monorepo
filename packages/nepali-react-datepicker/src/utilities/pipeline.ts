// MIDDLEWARE PATTERN
export type Next<T> = (context?: T) => Promise<T> | T

type Middleware<T> = (context: T, next: Next<T>) => Promise<void> | void

type Pipeline<T> = {
  push: (...middlewares: Middleware<T>[]) => void
  execute: (context: T) => Promise<T> // Change the return type to Promise<T>
}

export function Pipeline<T>(...middlewares: Middleware<T>[]): Pipeline<T> {
  const stack: Middleware<T>[] = middlewares

  const push: Pipeline<T>['push'] = (...middlewares) => {
    stack.push(...middlewares)
  }

  const execute: Pipeline<T>['execute'] = async (context) => {
    let prevIndex = -1

    const runner = async (index: number, context: T): Promise<T> => {
      if (index === prevIndex) {
        throw new Error('next() called multiple times')
      }

      prevIndex = index

      const middleware = stack[index]

      if (middleware) {
        await middleware(context, (newContext: any) => {
          // Pass the modified context to the next middleware
          return runner(index + 1, newContext || context)
        })
      }

      return context // Return the modified context
    }

    return runner(0, context)
  }

  return { push, execute }
}
