import { Config, ProcessVariables } from "../config.type";

export function getQAConfig(processVariables: ProcessVariables): Config {
  return {
    environment: "qa",
    apiPort: 5500,
    webClient: 'http://www.her-healing-initiative.org',
    postManClient: 'https://www.getpostman.com'
  };
}