import { nighttraxReact } from "@nighttrax/eslint-config-tsx";

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export default nighttraxReact([], {
  ignores: ["dist", "tests/results"],
  devDeps: ["jest.config.ts"],
});
