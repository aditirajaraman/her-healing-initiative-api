import { Config, ProcessVariables } from "../config.type";

export function getDevelopmentConfig(processVariables: ProcessVariables): Config {
  return {
    environment: "development",
    apiEndpoint: 'https://api.exampledev.com',
    apiPort: 5000,
    webClient: 'http://localhost:3000',
    postManClient: 'https://www.getpostman.com'
  };
}