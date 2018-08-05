import {randomUIntBelow} from "../src"
import {expect} from "chai";

describe("randomIntBelow", () => {
  it("should generate a value in the range", () => {
    expect(randomUIntBelow(1000)).to.be.within(0, 999);
  });

  it("generates values over 256", () => {
    expect(randomUIntBelow(1000000000)).to.be.greaterThan(256);
  });

  it("is non-deterministic", () => {
    const val1 = randomUIntBelow(1000000000);
    const val2 = randomUIntBelow(1000000000);
    expect(val1).to.not.equal(val2);
  });

  it("is reasonably distributed", () => {
    var counts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (var i = 0; i < counts.length * 100; i++) {
      counts[randomUIntBelow(10)] += 1;
    }
    for (var i = 0; i < counts.length; i++) {
      expect(counts[i]).to.be.greaterThan(50);
    }
  });
});
