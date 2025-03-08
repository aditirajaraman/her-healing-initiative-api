import { Config, ProcessVariables } from "../config.type";

export function getQAConfig(processVariables: ProcessVariables): Config {
  return {
    environment: "qa",
    apiEndpoint: 'https://api.example.com',
    apiPort: 5500,
    webClient: 'http://localhost:9090',
    postManClient: 'https://www.getpostman.com'
  };
}