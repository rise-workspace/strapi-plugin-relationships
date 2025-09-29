export type FakeChangeEvent<T> = {
  target: {
    name: string;
    value: T;
  };
};
