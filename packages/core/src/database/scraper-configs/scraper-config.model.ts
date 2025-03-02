import {
  prop,
  getModelForClass,
  modelOptions,
  Severity,
} from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    collection: "scraper_configs",
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class ScraperConfig {
  @prop({ required: true, unique: true })
  public chainId!: number;

  @prop({ required: true })
  public contractAddress!: string;

  @prop({ required: true })
  public providerUri!: string;

  @prop({ required: true })
  public lastBlock!: number;

  @prop({
    type: () => ScraperSettings,
    required: true,
    default: () => new ScraperSettings(),
  })
  public settings!: ScraperSettings;
}

export class ScraperSettings {
  @prop({ required: true, default: 2000 })
  public chunkSize!: number;

  @prop({ required: true, default: true })
  public isActive!: boolean;
}

export const ScraperConfigModel = getModelForClass(ScraperConfig);
