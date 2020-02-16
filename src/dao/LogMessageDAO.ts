import Mongo from '../utils/Mongo';

export default class LogMessageDAO {
  static async saveToDB(message: object) {
    Mongo.getDB(async (DB) => {
      await DB.collection(Mongo.collectionName.message).insertOne(message);
    });
  }
}
