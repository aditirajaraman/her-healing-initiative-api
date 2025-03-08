import { Config, ProcessVariables } from "../config.type";

export function getLocalConfig(processVariables: ProcessVariables): Config {
  return {
    environment: "local",
    apiEndpoint: 'https://api.example.com',
    apiPort: 5500,
    webClient: 'http://localhost:3000',
    postManClient: 'https://www.getpostman.com'
  };
}