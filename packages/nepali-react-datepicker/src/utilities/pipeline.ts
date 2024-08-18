/* eslint-disable @typescript-eslint/no-explicit-any */
export type Next<T> = (context?: T) => T;

export type Middleware<T> = (context: T, next: Next<T>) => void;

interface IPipeline<T> {
  push: (middleware: Middleware<T>) => IPipeline<T>;
  guard: (guardFn: Guard<T>) => IPipeline<T>;
  execute: (context: T) => T;
}

export type Guard<T> = (context: T) => boolean;

export function Pipeline<T>(
  ...middlewares: Array<Middleware<T>>
): IPipeline<T> {
  const stack: Array<{ middleware: Middleware<T>, guard?: Guard<T> }> = [];
  let currentGuard: Guard<T> | undefined = undefined;

  const push: IPipeline<T>['push'] = (middleware) => {
    stack.push({ middleware, guard: currentGuard });
    currentGuard = undefined; // Reset currentGuard after pushing
    return { push, guard, execute };
  };

  const guard: IPipeline<T>['guard'] = (guardFn) => {
    currentGuard = guardFn;
    return { push, guard, execute };
  };

  const execute: IPipeline<T>['execute'] = context => {
    let prevIndex = -1;

    const runner = (index: number, context: T): T => {
      if (index === prevIndex) {
        throw new Error('next() called multiple times');
      }

      prevIndex = index;

      const item = stack[index];

      if (item) {
        const { middleware, guard } = item;
        if (!guard || guard(context)) {
          middleware(context, (newContext: any) => {
            // Pass the modified context to the next middleware
            return runner(index + 1, newContext || context);
          });
        } else {
          return runner(index + 1, context);
        }
      }

      return context; // Return the modified context
    };

    return runner(0, context);
  };

  // Initialize stack with initial middlewares
  middlewares.forEach(middleware => push(middleware));

  return { push, guard, execute };
}
