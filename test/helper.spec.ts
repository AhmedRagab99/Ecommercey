import {
  compareHashedValue,
  convertToLocalTimeormat,
  hash,
} from "../src/utils/helperfunctions";

const exampleString: string = "123456";
const anotherExampleString: string = "123";
const exampleDate: number = Date.now();

describe("test helper functions", () => {
  test("test hash function", async () => {
    try {
      const res = await hash(exampleString, 12);
      expect(res).resolves.toHaveReturned;
      expect(hash).toBeDefined();
      expect(res).not.toEqual(exampleString);
      console.log(res);
    } catch {
      expect("error with hash").toThrow();
    }
  });

  test("test compare function to be true", async () => {
    try {
      const hashed = await hash(exampleString);
      const res = await compareHashedValue(exampleString, hashed);
      console.log(res);
      expect(compareHashedValue).toBeDefined();
      expect(res).resolves.toHaveReturned;
      expect(res).toBeTruthy();
    } catch {
      expect("error with compare").toThrow();
    }
  });

  test("test compare function to be false", async () => {
    try {
      const hashed = await hash(exampleString);
      const res = await compareHashedValue(anotherExampleString, hashed);
      console.log(res);
      expect(compareHashedValue).toBeDefined();
      expect(res).resolves.toHaveReturned;
      expect(res).toBeFalsy();
    } catch {
      expect("error with compare").toThrow();
    }
  });

  test("test convert time method", () => {
    try {
      const res = convertToLocalTimeormat(exampleDate);
      expect(convertToLocalTimeormat).toBeDefined();
      expect(res).toHaveReturned;
      expect(res).toHaveLength;
      console.log(res);
    } catch {
      expect("error with convert time method").toThrow();
    }
  });
});
