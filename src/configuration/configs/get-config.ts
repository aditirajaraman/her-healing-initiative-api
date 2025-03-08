import { Config, Environment, ProcessVariables } from "../config.type";
import {getProductionConfig} from "./get-production-config";
import {getQAConfig} from "./get-qa-config";
import {getDevelopmentConfig} from "./get-development-config";
import {getLocalConfig} from "./get-local-config";

export function getConfig(processVariables: ProcessVariables): Config {
  const environment: Environment = processVariables.ENV || "local";
  switch (environment) {
    case "production":
      return getProductionConfig(processVariables);
    case "qa":
        return getQAConfig(processVariables);
    case "development":
          return getDevelopmentConfig(processVariables);
    case "local":
      return getLocalConfig(processVariables);
    default:
      throw new Error("Config cannot be null or undefined.");  
  }
}