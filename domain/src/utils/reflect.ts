import 'reflect-metadata';

export const reflect = {
  get<T = any>(metadataKey: string | symbol, target: any, propertyKey?: string | symbol): T | undefined {
    let current: any = target;
    while (current) {
      const meta = propertyKey
        ? Reflect.getMetadata(metadataKey, current, propertyKey)
        : Reflect.getMetadata(metadataKey, current);
      if (meta !== undefined) {
        return meta;
      }
      current = Object.getPrototypeOf(current);
    }
    return undefined;
  },
  set(metadataKey: any, metadataValue: any, target: object): void {
    Reflect.defineMetadata(metadataKey, metadataValue, target);
  },
};
