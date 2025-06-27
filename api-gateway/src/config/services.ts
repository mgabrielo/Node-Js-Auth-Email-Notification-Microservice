import { Application } from "express";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import { config } from ".";
import { ServiceConfig } from "../types";
import { customLogger } from "./logger";

export const serviceConfigs: ServiceConfig[] = [
  {
    path: "/api/v1/auth",
    url: config.AUTH_SERVICE_URL,
    pathRewrite: { "^/api/v1/auth": "" },
    name: "auth-service",
    timeout: 5000,
  },
  {
    path: "/api/v1/accounts",
    url: config.ACCOUNT_SERVICE_URL,
    name: "account-service",
    timeout: 5000,
    pathRewrite: { "^/api/v1/accounts": "" },
  },
];

const createProxyOptions = (service: ServiceConfig): Options => {
  return {
    target: service.url,
    changeOrigin: true,
    pathRewrite: service.pathRewrite,
    timeout: service.timeout || config.DEFAULT_TIMEOUT,
    on: {
      error: (err, req, res) => {
        customLogger.logCustomMessage(`Proxy error: ${err.message}`);
      },
    },
  };
};

export const setupProxy = (app: Application): void => {
  serviceConfigs.forEach((service) => {
    const proxyOptions = createProxyOptions(service);
    app.use(service.path, createProxyMiddleware(proxyOptions));
    console.log({ auth_url: config.AUTH_SERVICE_URL });

    customLogger.logCustomMessage(
      `configured proxy for ${service.name} at ${service.path}`
    );
  });
};

export const proxyServices = (app: Application): void => {
  setupProxy(app);
};
