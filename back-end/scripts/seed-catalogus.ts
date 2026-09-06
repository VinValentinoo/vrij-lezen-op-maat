import 'dotenv/config';
import mongoose from 'mongoose';
import { CatalogusItem, CatalogusItemSchema } from '../src/modules/catalogus/schemas/catalogus-item.schema';

const catalogusData = [
    {
        titel: 'De Brief van Anna',
        beschrijving: 'Een jonge vrouw ontdekt een oude brief die het geheim van haar familie onthult.',
        taalniveau: 'A2',
        genre: 'Drama',
        onderwerp: 'Familie',
        lengte: 'Kort',
    },
    {
        titel: 'Het Laatste Station',
        beschrijving: 'Een treinreiziger raakt verstrikt in een mysterieuze verdwijning.',
        taalniveau: 'B1',
        genre: 'Thriller',
        onderwerp: 'Mysterie',
        lengte: 'Middel',
    },
    {
        titel: 'Sterren boven Rotterdam',
        beschrijving: 'Twee jongeren uit verschillende werelden vinden elkaar in een zomer vol verandering.',
        taalniveau: 'B1',
        genre: 'Romantiek',
        onderwerp: 'Liefde',
        lengte: 'Kort',
    },
    {
        titel: 'De Vergeten Stad',
        beschrijving: 'Een archeoloog ontdekt een verloren beschaving diep onder de Sahara.',
        taalniveau: 'B2',
        genre: 'Avontuur',
        onderwerp: 'Geschiedenis',
        lengte: 'Lang',
    },
    {
        titel: 'Machines van Morgen',
        beschrijving: 'Een toegankelijke inleiding in kunstmatige intelligentie voor nieuwsgierige lezers.',
        taalniveau: 'B2',
        genre: 'Non-fictie',
        onderwerp: 'Technologie',
        lengte: 'Middel',
    },
    {
        titel: 'De Ontdekking van de Hemel',
        beschrijving: 'Een filosofische roman over vriendschap, lot en de zoektocht naar betekenis.',
        taalniveau: 'C1',
        genre: 'Literaire fictie',
        onderwerp: 'Filosofie',
        lengte: 'Lang',
    },
    {
        titel: 'Kleine Stappen, Grote Sprongen',
        beschrijving: 'Praktische tips voor wie worstelt met uitstelgedrag en motivatie.',
        taalniveau: 'A2',
        genre: 'Zelfhulp',
        onderwerp: 'Persoonlijke ontwikkeling',
        lengte: 'Kort',
    },
    {
        titel: 'Het Web van Verraad',
        beschrijving: 'Een advocate ontrafelt een complot dat tot in de hoogste kringen reikt.',
        taalniveau: 'C1',
        genre: 'Thriller',
        onderwerp: 'Politiek',
        lengte: 'Lang',
    },
    {
        titel: 'Reis naar het Noorderlicht',
        beschrijving: 'Een reisverslag door Scandinavië, vol observaties over cultuur en natuur.',
        taalniveau: 'B1',
        genre: 'Non-fictie',
        onderwerp: 'Reizen',
        lengte: 'Middel',
    },
    {
        titel: 'De Laatste Pagina',
        beschrijving: 'Een schrijver ontdekt dat zijn eigen boek de werkelijkheid begint te veranderen.',
        taalniveau: 'B2',
        genre: 'Fantasy',
        onderwerp: 'Mysterie',
        lengte: 'Lang',
    },
    {
        titel: 'Buurtgenoten',
        beschrijving: 'Korte, luchtige verhalen over het dagelijks leven in een Nederlandse straat.',
        taalniveau: 'A2',
        genre: 'Drama',
        onderwerp: 'Dagelijks leven',
        lengte: 'Kort',
    },
    {
        titel: 'Het Klimaatdilemma',
        beschrijving: 'Een heldere uitleg van de wetenschap en politiek achter klimaatverandering.',
        taalniveau: 'C1',
        genre: 'Non-fictie',
        onderwerp: 'Wetenschap',
        lengte: 'Middel',
    },
    {
        titel: 'De Erfenis van Oma Riet',
        beschrijving: 'Een familie komt samen om een oud huis leeg te ruimen, en stuit op oude geheimen.',
        taalniveau: 'B1',
        genre: 'Drama',
        onderwerp: 'Familie',
        lengte: 'Middel',
    },
    {
        titel: 'Sprong in het Diepe',
        beschrijving: 'Een jonge ondernemer waagt de stap naar haar eigen bedrijf, met vallen en opstaan.',
        taalniveau: 'B2',
        genre: 'Non-fictie',
        onderwerp: 'Persoonlijke ontwikkeling',
        lengte: 'Kort',
    },
    {
        titel: 'De Wachters van Eldoria',
        beschrijving: 'In een rijk vol magie moet een groep jonge helden hun koninkrijk redden.',
        taalniveau: 'A2',
        genre: 'Fantasy',
        onderwerp: 'Avontuur',
        lengte: 'Lang',
    },
    {
        titel: 'Stilte in de Stad',
        beschrijving: 'Een rechercheur onderzoekt een reeks onopgeloste zaken in een slapende provinciestad.',
        taalniveau: 'C1',
        genre: 'Thriller',
        onderwerp: 'Mysterie',
        lengte: 'Middel',
    },
];

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