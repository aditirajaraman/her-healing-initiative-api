import { Config, ProcessVariables } from "../config.type";

export function getLocalConfig(processVariables: ProcessVariables): Config {
  return {
    environment: "local",
    apiPort: 5000,
    webClient: 'http://localhost:3000',
    postManClient: 'https://www.getpostman.com'
  };
}