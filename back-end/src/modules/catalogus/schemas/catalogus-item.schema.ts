import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class CatalogusItem extends Document {
  @Prop({ required: true })
  titel!: string;

  @Prop({ required: true })
  beschrijving!: string;

  @Prop({ required: true })
  taalniveau!: string;

  @Prop({ required: true })
  genre!: string;

  @Prop({ required: true })
  onderwerp!: string;

  @Prop({ required: true })
  lengte!: string;
}

export const CatalogusItemSchema = SchemaFactory.createForClass(CatalogusItem);
