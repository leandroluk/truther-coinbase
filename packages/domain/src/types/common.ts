export type TrueType<T> = Exclude<T, undefined | null>;

// prettier-ignore
export type UpperSnakeCase<T extends string> = T extends `${infer A}_${infer B}`
  ? A extends Uppercase<A>
  ? UpperSnakeCase<B>
  : never
  : T extends Uppercase<T>
  ? T
  : never;
