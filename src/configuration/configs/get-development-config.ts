import { Config, ProcessVariables } from "../config.type";

export function getDevelopmentConfig(processVariables: ProcessVariables): Config {
  return {
    environment: "development",
    apiPort: 5000,
    webClient: 'http://www.her-healing-initiative.org',
    postManClient: 'https://www.getpostman.com'
  };
}