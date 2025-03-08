export type Environment =
  // The service running in a production cluster available for customers
  | "production"
  | "qa"
  | "development"
  // The service running locally on a development machine
  | "local";

export interface Config {
  environment: Environment;
  apiEndpoint: string;
  apiPort: number;
  webClient: string;
  postManClient?: string; // Optional property
}

export interface ProcessVariables {
  ENV?: Environment;
}