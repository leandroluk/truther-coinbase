import {LoggerService} from '@backend-libs/logger';

export function Retry(retries = 10, delayMs = 1000): MethodDecorator {
  return function (target, propertyKey, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]): Promise<any> {
      let attempts = 0;
      const loggerService = new LoggerService(`${target.constructor.name}.${String(propertyKey)}`);
      for (let attempt = 1; attempt <= retries + 1; attempt += 1) {
        try {
          return await originalMethod.apply(this, args);
        } catch (error: any) {
          attempts++;
          const argsString = args
            .map(arg => {
              try {
                return JSON.stringify(arg);
              } catch {
                return '[Unserializable]';
              }
            })
            .join(', ');
          if (attempts > retries) {
            loggerService.error(`Failed. ${error.message} args: ${argsString}`);
            throw error;
          }
          loggerService.warn(`Failed on attempt ${attempt}. ${error.message} args: ${argsString}`);
          await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
        }
      }
    };
    return descriptor;
  };
}
