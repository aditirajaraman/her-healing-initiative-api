import { Config, ProcessVariables } from "../config.type";

export function getProductionConfig(processVariables: ProcessVariables): Config {
  return {
    environment: "production",
    apiPort: 5500,
    webClient: 'http://www.her-healing-initiative.org',
    postManClient: 'https://www.getpostman.com'
  };
}