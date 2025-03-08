import { Config, ProcessVariables } from "../config.type";

export function getProductionConfig(processVariables: ProcessVariables): Config {
  return {
    environment: "production",
    apiEndpoint: 'https://api.example.com',
    apiPort: 5500,
    webClient: 'http://localhost:3000',
    postManClient: 'https://www.getpostman.com'
  };
}