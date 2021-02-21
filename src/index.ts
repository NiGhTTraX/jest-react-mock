/* istanbul ignore file */
import { reactMockMatcher } from './matcher';

expect.extend(reactMockMatcher);

// Only exporting this to make TS emit the matcher declaration.
export { reactMockMatcher };
