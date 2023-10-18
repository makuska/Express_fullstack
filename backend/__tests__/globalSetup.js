import { MongoMemoryServer } from "mongodb-memory-server"
import { config } from "./utils/config.js"

global.globalSetup = async function() {
  if (config.Memory) {
    const instance = await MongoMemoryServer.create();
    const uri = instance.getUri();
    global.__MONGOINSTANCE = instance;
    process.env.MONGO_URI = uri.slice(0, uri.lastIndexOf("/"));
  } else {
    process.env.MONGO_URI = `mongodb://${config.IP}:${config.Port}`;
  }
};
