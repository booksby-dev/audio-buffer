declare module "tape" {
  interface Test {
    end(): void;
    equal(actual: any, expected: any, msg?: string): void;
    deepEqual(actual: any, expected: any, msg?: string): void;
  }

  function tape(name: string, cb: (t: Test) => void): void;
  export = tape;
}
