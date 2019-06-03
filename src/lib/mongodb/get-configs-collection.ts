import mongodb from 'mongodb';
import { IntegrationConfig } from '../../types';

const { MONGO_URI } = process.env;

export default async function getConfigsCollection() {
    const client = await mongodb.connect(MONGO_URI!, { useNewUrlParser: true });
    const db = await client.db('zcord');
    return db.collection<IntegrationConfig>('integrations');
}


