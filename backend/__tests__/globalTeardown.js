import { config } from "./utils/config"

global.globalTeardown = async function() {
  if (config.Memory) {
    const instance = global.__MONGOINSTANCE;
    await instance.stop();
  }
};
