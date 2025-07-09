import 'reflect-metadata';
import {type EntityTarget, type ObjectLiteral, ViewEntity as TypeORMViewEntity} from 'typeorm';
import {type ViewEntityOptions} from 'typeorm/decorator/options/ViewEntityOptions';

type Options<T extends ObjectLiteral = any> = ViewEntityOptions & {
  fullTextFields?: Array<string & keyof T>;
};

function decorator<T extends ObjectLiteral = any>(options: Options<T>): ClassDecorator {
  return function <TFunction extends Function>(target: TFunction) {
    const {fullTextFields = [], ...restOptions} = options;
    Reflect.defineMetadata(FullTextView.key, fullTextFields, target);
    return TypeORMViewEntity(restOptions)(target);
  };
}

export const FullTextView = Object.assign(decorator, {
  key: Symbol('FullTextView'),
  get: <T extends ObjectLiteral = any>(entityTarget: EntityTarget<T>): Array<string & keyof T> => {
    return Reflect.getMetadata(FullTextView.key, entityTarget) ?? [];
  },
});
