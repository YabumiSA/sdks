import { BigNumber, ethers } from "ethers";

import { DutchLimitOrder, DutchLimitOrderInfo } from "./DutchLimitOrder";

describe("DutchLimitOrder", () => {
  const getOrderInfo = (
    data: Partial<DutchLimitOrderInfo>
  ): DutchLimitOrderInfo => {
    return Object.assign(
      {
        deadline: Math.floor(new Date().getTime() / 1000) + 1000,
        reactor: "0x0000000000000000000000000000000000000000",
        offerer: "0x0000000000000000000000000000000000000000",
        nonce: BigNumber.from(10),
        startTime: Math.floor(new Date().getTime() / 1000),
        input: {
          token: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          amount: BigNumber.from("1000000"),
        },
        outputs: [
          {
            token: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
            startAmount: BigNumber.from("1000000000000000000"),
            endAmount: BigNumber.from("900000000000000000"),
            recipient: "0x0000000000000000000000000000000000000000",
          },
        ],
      },
      data
    );
  };

  it("parses a serialized order", () => {
    const orderInfo = getOrderInfo({});
    const order = new DutchLimitOrder(orderInfo, 1);
    const serialized = order.serialize();
    const parsed = DutchLimitOrder.parse(serialized, 1);
    expect(parsed.info).toEqual(orderInfo);
  });

  it("valid signature over info", async () => {
    const order = new DutchLimitOrder(getOrderInfo({}), 1);
    const wallet = ethers.Wallet.createRandom();

    const { domain, types, values } = order.permitData();
    const signature = await wallet._signTypedData(domain, types, values);
    expect(order.getSigner(signature)).toEqual(await wallet.getAddress());
  });
});
