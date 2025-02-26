import { Gigstack } from "../../nodes/Gigstack.node";

describe("Gigstack Node", () => {
  let gigstackNode: Gigstack;

  beforeEach(() => {
    gigstackNode = new Gigstack();
  });

  describe("Node Description", () => {
    it("should have the correct name", () => {
      expect(gigstackNode.description.name).toBe("gigstack");
    });

    it("should have the correct displayName", () => {
      expect(gigstackNode.description.displayName).toBe("Gigstack");
    });

    it("should have the correct icon", () => {
      expect(gigstackNode.description.icon).toBe("file:gigstack.svg");
    });

    it("should have the correct group", () => {
      expect(gigstackNode.description.group).toEqual(["transform"]);
    });

    it("should have the correct version", () => {
      expect(gigstackNode.description.version).toBe(2);
    });

    it("should have the correct subtitle", () => {
      expect(gigstackNode.description.subtitle).toBe(
        '={{$parameter["operation"] + ": " + $parameter["resource"]}}'
      );
    });

    it("should have the correct description", () => {
      expect(gigstackNode.description.description).toBe(
        "Interact with Gigstack API - Payments and Invoices"
      );
    });
  });

  describe("Node Resources", () => {
    it("should have payment resource", () => {
      const resourceOptions = gigstackNode.description.properties.find(
        (property) => property.name === "resource"
      )?.options;

      expect(resourceOptions).toBeDefined();
      expect(resourceOptions).toContainEqual(
        expect.objectContaining({
          name: "Payment",
          value: "payment",
        })
      );
    });

    it("should have invoice resource", () => {
      const resourceOptions = gigstackNode.description.properties.find(
        (property) => property.name === "resource"
      )?.options;

      expect(resourceOptions).toBeDefined();
      expect(resourceOptions).toContainEqual(
        expect.objectContaining({
          name: "Invoice",
          value: "invoice",
        })
      );
    });
  });

  describe("Payment Operations", () => {
    it("should have register operation for payment resource", () => {
      const operationProperty = gigstackNode.description.properties.find(
        (property) =>
          property.name === "operation" &&
          property.displayOptions?.show?.resource?.includes("payment")
      );

      expect(operationProperty).toBeDefined();
      expect(operationProperty?.options).toContainEqual(
        expect.objectContaining({
          name: "Register or request",
          value: "register",
        })
      );
    });

    it("should have get operation for payment resource", () => {
      const operationProperty = gigstackNode.description.properties.find(
        (property) =>
          property.name === "operation" &&
          property.displayOptions?.show?.resource?.includes("payment")
      );

      expect(operationProperty).toBeDefined();
      expect(operationProperty?.options).toContainEqual(
        expect.objectContaining({
          name: "Get",
          value: "get",
        })
      );
    });
  });

  describe("Invoice Operations", () => {
    it("should have create operation for invoice resource", () => {
      const operationProperty = gigstackNode.description.properties.find(
        (property) =>
          property.name === "operation" &&
          property.displayOptions?.show?.resource?.includes("invoice")
      );

      expect(operationProperty).toBeDefined();
      expect(operationProperty?.options).toContainEqual(
        expect.objectContaining({
          name: "Create",
          value: "create",
        })
      );
    });
  });
});
