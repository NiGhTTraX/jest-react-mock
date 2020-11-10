import { ReactMock } from 'react-mock-component';
// eslint-disable-next-line no-use-before-define
import MatcherContext = jest.MatcherContext;
// eslint-disable-next-line no-use-before-define
import CustomMatcherResult = jest.CustomMatcherResult;

type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

interface ReactMockExpect<Props> {
  /**
   * Check that the mock is currently mounted.
   *
   * @see toHaveBeenRendered
   */
  toBeMounted(): void;

  /**
   * Check that the mock has been rendered at least once.
   *
   * If the component was rendered and then unmounted, this expectation will
   * still pass.
   *
   * @see toBeMounted
   */
  toHaveBeenRendered(): void;

  /**
   * Check that the mock has been rendered at least once with the expected props.
   *
   * If you want to check only the last render use `toHaveProps`.
   *
   * @see toHaveProps
   *
   * @param expected Will be matched recursively and can support jest matchers.
   *
   * @example
   * const Mock = createReactMock({ foo: number, bar: number });
   * expect(Mock).toHaveBeenRenderedWith({ foo: 1 });
   *
   * @example
   * const Mock = createReactMock({ foo: number, bar: number });
   * expect(Mock).toHaveBeenRenderedWith(
   *   expect.objectContaining({ bar: 23 })
   * );
   *
   * @example
   * const Mock = createReactMock({ foo: { bar: number} });
   * expect(Mock).toHaveBeenRenderedWith({ foo: { bar: 1 } });
   */
  toHaveBeenRenderedWith(expected: DeepPartial<Props>): void;

  /**
   * Check that the last received props match the expected ones.
   *
   * As opposed to `toHaveBeenRenderedWith`, `toHaveProps` only checks the
   * last render.
   *
   * @see toHaveBeenRenderedWith
   *
   * @param expected Will be matched recursively and can support jest matchers.
   *
   * @example
   * const Mock = createReactMock({ foo: number, bar: number });
   * expect(Mock).toHaveProps({ foo: 1 });
   *
   * @example
   * const Mock = createReactMock({ foo: number, bar: number });
   * expect(Mock).toHaveProps(
   *   expect.objectContaining({ bar: 23 })
   * );
   *
   * @example
   * const Mock = createReactMock({ foo: { bar: number} });
   * expect(Mock).toHaveProps({ foo: { bar: 1 } });
   */
  toHaveProps(expected: DeepPartial<Props>): void;
}

type Result = CustomMatcherResult & { actual?: any; expected?: any };

type ReactMockMatcher = {
  toBeMounted: (this: MatcherContext, mock: ReactMock<any>) => Result;
  toHaveBeenRendered: (this: MatcherContext, mock: ReactMock<any>) => Result;
  toHaveBeenRenderedWith: <Props>(
    this: MatcherContext,
    mock: ReactMock<Props>,
    expected: DeepPartial<Props>
  ) => Result;
  toHaveProps: <Props>(
    this: MatcherContext,
    mock: ReactMock<Props>,
    expected: DeepPartial<Props>
  ) => Result;
};

declare global {
  namespace jest {
    // noinspection JSUnusedGlobalSymbols
    interface Expect {
      <Props>(mock: ReactMock<Props>): ReactMockExpect<Props> & {
        not: ReactMockExpect<Props>;
      };
    }
  }
}

type IndexedRender<Props> = [number, Props];

/**
 * Recursively match props.
 */
function deepEquals<Props>(
  received: Props,
  expected: DeepPartial<Props>
): boolean {
  try {
    // expect in expect, yeah.
    expect(received).toMatchObject(expected);

    return true;
  } catch (e) {
    return false;
  }
}

function getMatchingCalls<Props>(
  mock: ReactMock<Props>,
  expected: DeepPartial<Props>
): IndexedRender<Props>[] {
  const matchingCalls: IndexedRender<Props>[] = [];

  mock.renderCalls.forEach((received, i) => {
    if (deepEquals(received, expected)) {
      matchingCalls.push([i, received]);
    }
  });

  return matchingCalls;
}

const reactMockMatcher: ReactMockMatcher = {
  toBeMounted(this: MatcherContext, mock: ReactMock<any>) {
    const { isNot } = this;
    const { printReceived, matcherHint } = this.utils;

    const hint = matcherHint('toBeMounted', `mock`, '', {
      isNot,
    });
    const expected = !isNot
      ? 'Expected the mock to currently be mounted, but it is not.'
      : `Expected the mock to currently not be mounted, but it is.`;
    const received = printReceived(mock.renderCalls.length);

    return {
      message: () =>
        `${hint}

${expected}
Previous number of renders: ${received}`,
      pass: mock.mounted,
    };
  },

  toHaveBeenRendered(this: MatcherContext, mock: ReactMock<any>) {
    const { isNot } = this;
    const { printExpected, printReceived, matcherHint } = this.utils;

    const hint = matcherHint('toHaveBeenRendered', `mock`, '', {
      isNot,
    });
    const expected = isNot ? '0' : `>= ${printExpected(1)}`;
    const received = isNot
      ? printReceived(mock.renderCalls.length)
      : `   ${printReceived(mock.renderCalls.length)}`;

    return {
      message: () =>
        `${hint}

Expected number of renders: ${expected}
Received number of renders: ${received}`,
      pass: mock.rendered,
    };
  },

  toHaveBeenRenderedWith<Props>(
    this: MatcherContext,
    mock: ReactMock<Props>,
    expected: DeepPartial<Props>
  ) {
    const { isNot } = this;
    const {
      printExpected,
      printReceived,
      matcherHint,
      EXPECTED_COLOR,
      RECEIVED_COLOR,
      diff,
    } = this.utils;

    const hint = matcherHint('toHaveBeenRenderedWith', `mock`, 'props', {
      isNot,
    });

    const matchingCalls = getMatchingCalls(mock, expected);
    const calls: IndexedRender<Props>[] = mock.renderCalls.map((props, i) => [
      i,
      props,
    ]);

    const pass = matchingCalls.length > 0;

    const indentation = '    ';

    const intro = `${hint}

Expected: ${isNot ? 'not ' : ''}${printExpected(expected)}
Received:`;

    const outro = `
Total number of renders: ${mock.renderCalls.length}`;

    return {
      message: !pass
        ? () => `${intro}
${EXPECTED_COLOR('- Expected')}
${RECEIVED_COLOR('+ Received')}
${calls
  .map(
    ([i, received]) =>
      `${indentation}Render ${i}\n${indentation}${diff(expected, received)
        ?.split('\n')
        .slice(3)
        .join(`\n${indentation}`)}`
  )
  .join('\n')}
${outro}`
        : () => `${intro}
${matchingCalls
  .map(
    ([i, received]) => `${indentation}Render ${i}: ${printReceived(received)}`
  )
  .join('\n')}
${outro}`,
      pass,
    };
  },

  toHaveProps<Props>(
    this: MatcherContext,
    mock: ReactMock<Props>,
    expected: DeepPartial<Props>
  ) {
    const { isNot } = this;
    const {
      matcherHint,
      diff,
      printExpected,
      printReceived,
      EXPECTED_COLOR,
      RECEIVED_COLOR,
    } = this.utils;

    const hint = matcherHint('toHaveProps', `mock`, 'props', {
      isNot,
    });

    const pass = deepEquals(mock.lastProps, expected);

    return {
      message: () =>
        !pass
          ? `${hint}

${diff(mock.lastProps, expected)}

Number of renders: ${mock.renderCalls.length}`
          : `${hint}

${EXPECTED_COLOR('Expected: ')}not ${printExpected(expected)}
${RECEIVED_COLOR('Received: ')}${printReceived(mock.lastProps)}

Number of renders: ${mock.renderCalls.length}`,
      pass,
      actual: mock.lastProps,
      expected,
    };
  },
};

export default reactMockMatcher;
