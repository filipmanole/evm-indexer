import {
  prop,
  getModelForClass,
  modelOptions,
  index,
} from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    collection: "fee_collected_events",
    timestamps: true,
  },
})
@index({ chainId: 1, blockNumber: 1 })
@index({ integrator: 1, timestamp: -1 })
@index(
  {
    chainId: 1,
    transactionHash: 1,
  },
  { unique: true }
)
export class FeeCollectedEvent {
  @prop({ required: true })
  public chainId!: number;

  @prop({ required: true, index: true })
  public integrator!: string;

  @prop({ required: true })
  public token!: string;

  @prop({ required: true })
  public integratorFee!: string;

  @prop({ required: true })
  public lifiFee!: string;

  @prop({ required: true })
  public blockNumber!: number;

  @prop({ required: true })
  public transactionHash!: string;

  @prop({ required: true })
  public timestamp!: Date;
}

export const FeeCollectedEventModel = getModelForClass(FeeCollectedEvent);
