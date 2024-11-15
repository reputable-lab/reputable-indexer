import {
  NewReputableModel as NewReputableModelEvent,
  Transfer as TransferEvent,
} from "../generated/ReputableHub/ReputableHub";
import { ReputableModel as ReputableModelContract } from "../generated/templates/ReputableModelTemplate/ReputableModel";
import { ReputableModelTemplate } from "../generated/templates";
import { ModelWeights, ReputableModel } from "../generated/schema";
import { BigInt } from "@graphprotocol/graph-ts";
import { getEventId, intToAddress } from "./utils";

export function handleNewReputableModel(event: NewReputableModelEvent): void {
  //modelWeights
  const eventId = getEventId(event);
  let modelWeights = ModelWeights.load(eventId);
  if (!modelWeights) {
    modelWeights = new ModelWeights(eventId);
    let contract = ReputableModelContract.bind(event.params.reputableModel);
    const _modelWeights = contract.getReputableModelWeights();

    modelWeights.commitWeight = new BigInt(_modelWeights.commitWeight);
    modelWeights.nbOfContributorWeight = new BigInt(
      _modelWeights.nbOfContributorWeight
    );
    modelWeights.contributionRecencyWeight = new BigInt(
      _modelWeights.contributionRecencyWeight
    );
    modelWeights.txWeight = new BigInt(_modelWeights.txWeight);
    modelWeights.uniqueFromWeight = new BigInt(_modelWeights.uniqueFromWeight);
    modelWeights.tveWeight = new BigInt(_modelWeights.tveWeight);
    modelWeights.save();
  }

  //reputableModel
  let reputableModel = ReputableModel.load(event.params.reputableModel);
  if (!reputableModel) {
    reputableModel = new ReputableModel(event.params.reputableModel);
    let contract = ReputableModelContract.bind(event.params.reputableModel);

    reputableModel.modelName = event.params.args;
    reputableModel.owner = contract.owner();
    reputableModel.modelWeights = eventId;
    reputableModel.blockNumber = event.block.number;
    reputableModel.blockTimestamp = event.block.timestamp;
    reputableModel.transactionHash = event.transaction.hash;
    reputableModel.save();
  }
}

export function handleTransferReputationModel(event: TransferEvent): void {
  const reputableModelAddress = intToAddress(event.params.tokenId);
  let reputableModel = ReputableModel.load(reputableModelAddress);
  if (reputableModel) {
    reputableModel.owner = event.params.to;
    reputableModel.save();
  }
  // create template to listen events from reputableModel contract
  ReputableModelTemplate.create(reputableModelAddress);
}
