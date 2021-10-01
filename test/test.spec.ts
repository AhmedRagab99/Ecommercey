import { number } from "joi";

describe("first test file", () => {
  it("should test the console logging", () => {
    const x = 1123123123;
    const z = 12312;
    expect(x).toBeGreaterThan(z);
    expect(z).toBeDefined();
  });

  it("should test the  logging", () => {
    const z = 12312;

    expect(z).toBeDefined();
  });

  it("should test the  logging", () => {
    const z = "12312";

    expect(z).toHaveLength;
  });
});
