import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: "pages/api", // define api folder under app folder
    definition: {
      openapi: "3.0.0",
      info: {
        title: "OpenTelemetry Demo API Spec",
        version: "1.11",
      },
      security: [],
    },
  });
  return spec;
};