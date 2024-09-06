import { BigNumber } from "ethers";

import { DutchOrder } from "./DutchOrder";
import { CosignedPriorityOrder, UnsignedPriorityOrder } from "./PriorityOrder";
import { RelayOrder } from "./RelayOrder";
import { CosignedV2DutchOrder, UnsignedV2DutchOrder } from "./V2DutchOrder";
import { CosignedV3DutchOrder, UnsignedV3DutchOrder } from "./V3DutchOrder";

export * from "./DutchOrder";
export * from "./PriorityOrder";
export * from "./RelayOrder";
export * from "./types";
export * from "./validation";
export * from "./V2DutchOrder";
// TODO: To make v3 exports cleaner, export here but resolve ambiguous names vs V2

export type UniswapXOrder =
  | DutchOrder
  | UnsignedV2DutchOrder
  | CosignedV2DutchOrder
  | UnsignedV3DutchOrder
  | CosignedV3DutchOrder
  | UnsignedPriorityOrder
  | CosignedPriorityOrder;

export type Order = UniswapXOrder | RelayOrder;

export function originalIfZero(value: BigNumber, original: BigNumber): BigNumber {
  return value.isZero() ? original : value;
}