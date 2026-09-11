import 'dotenv/config';
import mongoose from 'mongoose';
import { CatalogusItem, CatalogusItemSchema } from '../src/modules/catalogus/schemas/catalogus-item.schema';
import catalogusData from './catalogus-data.json';

async function seed() {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI ontbreekt in .env');

    await mongoose.connect(uri);
    console.log('Vebonden met MongoDb');

    const CatalogusItemModel = mongoose.model(CatalogusItem.name, CatalogusItemSchema);

    await CatalogusItemModel.deleteMany({});
    console.log('Bestaande catalogus gewist');

    await CatalogusItemModel.insertMany(catalogusData);
    console.log(`${catalogusData.length} titels toegevoegd`);


    await mongoose.disconnect();
    console.log('Verbinding gesloten');
}

seed();