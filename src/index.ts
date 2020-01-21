import { ReactMock } from 'react-mock-component';
// eslint-disable-next-line no-use-before-define
import MatcherContext = jest.MatcherContext;
// eslint-disable-next-line no-use-before-define
import CustomMatcherResult = jest.CustomMatcherResult;

interface ReactMockExpect {
  toHaveBeenRendered(): void;
}

type ReactMockMatcher = {
  [P in keyof ReactMockExpect]: ReactMockExpect[P] extends (
    ...args: infer A
  ) => void
    ? (
        this: MatcherContext,
        mock: ReactMock<any>,
        ...args: A
      ) => CustomMatcherResult
    : never;
};

declare global {
  namespace jest {
    interface Expect {
      (mock: ReactMock<any>): ReactMockExpect & { not: ReactMockExpect };
    }
  }
}

const reactMockMatcher: ReactMockMatcher = {
  toHaveBeenRendered(this: MatcherContext, mock: ReactMock<any>) {
    return {
      message: () =>
        `expected component to ${this.isNot ? 'not ' : ''}have been rendered`,
      pass: mock.rendered
    };
  }
};

export default reactMockMatcher;
