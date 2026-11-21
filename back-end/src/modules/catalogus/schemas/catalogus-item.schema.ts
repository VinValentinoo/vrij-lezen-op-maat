import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class CatalogusItem extends Document {
  @Prop({ required: true })
  titel!: string;

  @Prop({ required: true })
  beschrijving!: string;

  // Indexen op de velden waarop de catalogus gefilterd wordt (zie
  // CatalogusService.findAll en de matching in AdviesService).
  @Prop({ required: true, index: true })
  taalniveau!: string;

  @Prop({ required: true, index: true })
  genre!: string;

  @Prop({ required: true, index: true })
  onderwerp!: string;

  @Prop({ required: true, index: true })
  lengte!: string;
}

export const CatalogusItemSchema = SchemaFactory.createForClass(CatalogusItem);
