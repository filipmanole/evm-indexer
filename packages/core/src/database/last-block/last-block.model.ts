import "reflect-metadata";
import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    collection: "last_processed_blocks",
    timestamps: true,
  },
})
export class LastBlock {
  @prop({ required: true, unique: true })
  public chainId!: number;

  @prop({ required: true })
  public lastBlock!: number;
}

export const LastBlockModel = getModelForClass(LastBlock);
