import { GigstackApi } from "../../credentials/GigstackApi.credentials";

describe("GigstackApi Credentials", () => {
  let credentials: GigstackApi;

  beforeEach(() => {
    credentials = new GigstackApi();
  });

  it("should have the correct name", () => {
    expect(credentials.name).toBe("gigstackApi");
  });

  it("should have the correct displayName", () => {
    expect(credentials.displayName).toBe("Gigstack API");
  });

  it("should have the correct documentationUrl", () => {
    expect(credentials.documentationUrl).toBe(
      "https://github.com/disruptive-learning/gigstack_n8n/blob/main/README.md#credentials"
    );
  });

  describe("Properties", () => {
    it("should have API Key property", () => {
      const apiKeyProperty = credentials.properties.find(
        (property) => property.name === "apiKey"
      );

      expect(apiKeyProperty).toBeDefined();
      expect(apiKeyProperty?.displayName).toBe("API Key");
      expect(apiKeyProperty?.type).toBe("string");
      expect(apiKeyProperty?.typeOptions?.password).toBe(true);
    });

    it("should have Environment property with correct options", () => {
      const environmentProperty = credentials.properties.find(
        (property) => property.name === "environment"
      );

      expect(environmentProperty).toBeDefined();
      expect(environmentProperty?.displayName).toBe("Environment");
      expect(environmentProperty?.type).toBe("options");

      // Check options
      expect(environmentProperty?.options).toContainEqual({
        name: "Production",
        value: "production",
      });

      expect(environmentProperty?.options).toContainEqual({
        name: "Sandbox",
        value: "sandbox",
      });
    });
  });

  describe("Authentication", () => {
    it("should have the correct authentication type", () => {
      expect(credentials.authenticate.type).toBe("generic");
    });

    it("should set the Authorization header correctly", () => {
      const authProperties = credentials.authenticate.properties;
      expect(authProperties).toBeDefined();

      if (authProperties && authProperties.headers) {
        expect(authProperties.headers.Authorization).toBe(
          "=Bearer {{$credentials.apiKey}}"
        );
      } else {
        fail("Authentication properties or headers are not defined");
      }
    });
  });
});
