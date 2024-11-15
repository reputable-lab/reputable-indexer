import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";

export function getEventId(event: ethereum.Event): string {
  return (
    event.transaction.hash.toHex() + "_" + event.transactionLogIndex.toString()
  );
}

export function intToAddress(value: BigInt): Address {
  return Address.fromString(
    value.toHex().substring(2).padStart(40, "0")
  ) as Address;
}
