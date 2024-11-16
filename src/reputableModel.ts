import { BigInt } from "@graphprotocol/graph-ts";
import { ModelWeights, ReputableModel } from "../generated/schema";
import { ReputableModelUpdated as ReputableModelUpdatedEvent } from "../generated/templates/ReputableModelTemplate/ReputableModel";
import { ReputableModel as ReputableModelContract } from "../generated/templates/ReputableModelTemplate/ReputableModel";
import { getEventId } from "./utils";

export function handleReputableModelUpdated(
  event: ReputableModelUpdatedEvent
): void {
  //modelWeights
  const eventId = getEventId(event);
  let modelWeights = ModelWeights.load(eventId);
  if (!modelWeights) {
    modelWeights = new ModelWeights(eventId);
    let contract = ReputableModelContract.bind(event.address);
    const _modelWeights = contract.getReputableModelWeights();

    modelWeights.commitWeight = _modelWeights.commitWeight;
    modelWeights.nbOfContributorWeight = _modelWeights.nbOfContributorWeight;
    modelWeights.contributionRecencyWeight =
      _modelWeights.contributionRecencyWeight;
    modelWeights.txWeight = _modelWeights.txWeight;
    modelWeights.uniqueFromWeight = _modelWeights.uniqueFromWeight;
    modelWeights.tveWeight = _modelWeights.tveWeight;
    modelWeights.save();
  }

  //reputableModel
  let reputableModel = ReputableModel.load(event.address);
  if (reputableModel) {
    reputableModel.modelWeights = eventId;
    reputableModel.blockNumber = event.block.number;
    reputableModel.blockTimestamp = event.block.timestamp;
    reputableModel.transactionHash = event.transaction.hash;
    reputableModel.save();
  }
}
