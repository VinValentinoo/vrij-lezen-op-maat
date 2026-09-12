import 'dotenv/config';
import mongoose from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import { CatalogusItem, CatalogusItemSchema } from '../src/modules/catalogus/schemas/catalogus-item.schema';

const catalogusDataPath = path.join(__dirname, 'catalogus-data.json');
const catalogusData = JSON.parse(fs.readFileSync(catalogusDataPath, 'utf-8'));

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