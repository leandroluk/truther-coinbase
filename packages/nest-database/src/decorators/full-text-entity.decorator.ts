import 'reflect-metadata';
import {Entity as TypeORMEntity, type EntityOptions, type EntityTarget, type ObjectLiteral} from 'typeorm';

type Options<T extends ObjectLiteral = any> = EntityOptions & {
  fullTextFields?: Array<string & keyof T>;
};

function decorator<T extends ObjectLiteral = any>(options: Options<T>): ClassDecorator {
  return function <TFunction extends Function>(target: TFunction) {
    const {fullTextFields = [], ...restOptions} = options;
    Reflect.defineMetadata(FullTextEntity.key, fullTextFields, target);
    return TypeORMEntity(restOptions)(target);
  };
}

export const FullTextEntity = Object.assign(decorator, {
  key: Symbol('FullTextEntity'),
  get: <T extends ObjectLiteral = any>(entityTarget: EntityTarget<T>): Array<string & keyof T> => {
    return Reflect.getMetadata(FullTextEntity.key, entityTarget) ?? [];
  },
});
