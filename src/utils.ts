export type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

export function diffProps<Props>(
  actual: Props,
  expected: DeepPartial<Props>
): string {
  try {
    expect(actual).toMatchObject(expected);

    return '';
  } catch (e) {
    // The error message will look like this:
    // Error: expect(received).toMatchObject(expected)
    //
    // - Expected  - 1
    // + Received  + 1
    //
    //   Object {
    //   "a": 1,
    // -   "b": 3,
    // +   "b": 2,
    //     }

    return e.message.split('\n').slice(5).join('\n');
  }
}
