import { BigNumber } from "ethers";

import { DutchLimitOrderBuilder } from "./DutchLimitOrderBuilder";

describe("DutchLimitOrderBuilder", () => {
  let builder: DutchLimitOrderBuilder;

  beforeEach(() => {
    builder = new DutchLimitOrderBuilder(1);
  });

  it("Builds a valid order", () => {
    const deadline = Math.floor(new Date().getTime() / 1000) + 1000;
    const order = builder
      .deadline(deadline)
      .endTime(deadline)
      .startTime(deadline - 100)
      .nonce(BigNumber.from(100))
      .input({
        token: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        amount: BigNumber.from("1000000"),
      })
      .output({
        token: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        startAmount: BigNumber.from("1000000000000000000"),
        endAmount: BigNumber.from("900000000000000000"),
        recipient: "0x0000000000000000000000000000000000000000",
      })
      .build();

    expect(order.info.startTime).toEqual(deadline - 100);
    expect(order.info.endTime).toEqual(deadline);
    expect(order.info.outputs.length).toEqual(1);
  });

  it("Builds a valid order with multiple outputs", () => {
    const deadline = Math.floor(new Date().getTime() / 1000) + 1000;
    const order = builder
      .deadline(deadline)
      .endTime(deadline)
      .startTime(deadline - 100)
      .nonce(BigNumber.from(100))
      .input({
        token: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        amount: BigNumber.from("1000000"),
      })
      .output({
        token: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        startAmount: BigNumber.from("1000000000000000000"),
        endAmount: BigNumber.from("900000000000000000"),
        recipient: "0x0000000000000000000000000000000000000000",
      })
      .output({
        token: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        startAmount: BigNumber.from("1000000000000000000"),
        endAmount: BigNumber.from("900000000000000000"),
        recipient: "0x0000000000000000000000000000000000000001",
      })
      .build();

    expect(order.info.startTime).toEqual(deadline - 100);
    expect(order.info.endTime).toEqual(deadline);
    expect(order.info.outputs.length).toEqual(2);
  });

  it("Deadline already passed", () => {
    expect(() => builder.deadline(1234)).toThrow(
      "Deadline must be in the future: 1234"
    );
  });

  it("Start time must be before endTime", () => {
    expect(() => builder.endTime(1234).startTime(1235)).toThrow(
      "startTime must be before endTime: 1235"
    );
  });

  it("Start time must be before deadline", () => {
    const deadline = Math.floor(new Date().getTime() / 1000) + 1000;
    expect(() => builder.deadline(deadline).startTime(deadline + 1)).toThrow(
      `startTime must be before deadline: ${deadline + 1}`
    );
  });

  it("End time must be after deadline", () => {
    const deadline = Math.floor(new Date().getTime() / 1000) + 1000;
    expect(() => builder.deadline(deadline).endTime(deadline + 1)).toThrow(
      `endTime must be before deadline: ${deadline + 1}`
    );
  });

  it("End time equals deadline passes", () => {
    const deadline = Math.floor(new Date().getTime() / 1000) + 1000;
    builder.deadline(deadline).endTime(deadline);
  });

  it("Unknown chainId", () => {
    const chainId = 99999999;
    expect(() => new DutchLimitOrderBuilder(chainId)).toThrow(
      `Missing configuration for reactor: ${chainId}`
    );
  });
});
