export type TIndexable = {
  /** @type {BIGINT} */
  id: number;
};

export type TUpdatable = {
  /** @type {TIMESTAMPTZ[3]} */
  updatedAt: Date;
};

export type TCreatable = {
  /** @type {TIMESTAMPTZ[3]} */
  createdAt: Date;
};

export type TRemovable = {
  /** @type {TIMESTAMPTZ[3] | NULL} */
  removedAt: Date | null;
};
