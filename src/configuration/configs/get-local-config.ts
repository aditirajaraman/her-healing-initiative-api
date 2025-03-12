import { Config, ProcessVariables } from "../config.type";

export function getLocalConfig(processVariables: ProcessVariables): Config {
  return {
    environment: "local",
    apiPort: 5500,
    webClient: 'http://www.her-healing-initiative.org',
    postManClient: 'https://www.getpostman.com'
  };
}