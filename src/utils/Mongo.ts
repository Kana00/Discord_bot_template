import MongoClient from 'mongodb';
import Logger from './Logger';

export default class Mongo {
  static collectionName = {
    message: 'message'
  }
  static async getDB(callback: (db: MongoClient.Db) => Promise<void>) {
    try {
      const database = await MongoClient.connect('mongodb://localhost:27017/bot_db', { useNewUrlParser: true });
      let dbo = database.db("bot_db");
      await callback(dbo);
      await database.close();
    } catch (error) {
      Logger.warn(error);
      process.kill(process.pid, "SIGINT");
    }
  }
}
