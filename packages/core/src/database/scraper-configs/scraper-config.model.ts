import "reflect-metadata";
import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    collection: "scraper_configs",
    timestamps: true,
  },
})
export class ScraperConfig {
  @prop({ required: true, unique: true })
  public chainId!: number;

  @prop({ required: true })
  public contractAddress!: number;

  @prop({ required: true })
  public providerUri!: string;

  @prop({ required: true })
  public lastBlock!: number;
}

export const ScraperConfigModel = getModelForClass(ScraperConfig);
