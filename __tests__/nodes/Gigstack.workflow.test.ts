import { Gigstack } from "../../nodes/Gigstack.node";
import { IExecuteFunctions, IHttpRequestOptions } from "n8n-workflow";

// Mock the IExecuteFunctions interface
const mockExecuteFunctions = () => {
  const mock: Partial<IExecuteFunctions> = {
    getInputData: jest.fn().mockReturnValue([{ json: {} }]),
    getNodeParameter: jest.fn(),
    getCredentials: jest.fn(),
    helpers: {
      request: jest.fn(),
      returnJsonArray: jest.fn().mockImplementation((data) => [{ json: data }]),
      constructExecutionMetaData: jest.fn().mockImplementation((data) => data),
      httpRequest: jest.fn(),
      httpRequestWithAuthentication: jest.fn(),
    },
    prepareOutputData: jest.fn().mockImplementation((data) => data),
    continueOnFail: jest.fn().mockReturnValue(false),
  };
  return mock as IExecuteFunctions;
};

describe("Gigstack Node Workflow", () => {
  let gigstackNode: Gigstack;
  let executeFunctions: IExecuteFunctions;

  beforeEach(() => {
    gigstackNode = new Gigstack();
    executeFunctions = mockExecuteFunctions();
  });

  describe("Payment Resource", () => {
    beforeEach(() => {
      (executeFunctions.getNodeParameter as jest.Mock).mockImplementation(
        (param, _) => {
          if (param === "resource") return "payment";
          return null;
        }
      );
    });

    it("should handle get operation", async () => {
      // Setup mocks for get operation
      (executeFunctions.getNodeParameter as jest.Mock).mockImplementation(
        (param, _) => {
          if (param === "resource") return "payment";
          if (param === "operation") return "get";
          if (param === "paymentId") return "test-payment-id";
          return null;
        }
      );

      (executeFunctions.getCredentials as jest.Mock).mockResolvedValue({
        apiKey: "test-api-key",
      });

      (executeFunctions.helpers.request as jest.Mock).mockResolvedValue({
        id: "test-payment-id",
        status: "completed",
      });

      // Execute the node
      await expect(
        gigstackNode.execute.call(executeFunctions)
      ).resolves.not.toThrow();

      // Verify the request was made with correct parameters
      expect(executeFunctions.helpers.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "GET",
          url: expect.stringContaining("test-payment-id"),
          headers: expect.objectContaining({
            Authorization: "Bearer test-api-key",
          }),
        })
      );
    });

    it("should handle register operation", async () => {
      // Setup mocks for register operation
      (executeFunctions.getNodeParameter as jest.Mock).mockImplementation(
        (param, _) => {
          if (param === "resource") return "payment";
          if (param === "operation") return "register";
          if (param === "paid") return true;
          if (param === "currency") return "MXN";
          if (param === "paymentMethod") return "01";
          if (param === "automateInvoiceOnComplete") return true;
          if (param === "clientId") return "test-client-id";
          if (param === "email") return "test@example.com";
          if (param === "items.itemsValues")
            return [
              {
                description: "Test Item",
                discount: 0,
                product_key: "01010101",
                unit_key: "E48",
                unit_name: "Unidad de Servicio",
                quantity: 1,
                amount: 100,
                taxes: {
                  taxesValues: [
                    {
                      factor: "Tasa",
                      inclusive: true,
                      rate: 0.16,
                      type: "IVA",
                      withholding: false,
                    },
                  ],
                },
              },
            ];
          return null;
        }
      );

      (executeFunctions.getCredentials as jest.Mock).mockResolvedValue({
        apiKey: "test-api-key",
      });

      (executeFunctions.helpers.request as jest.Mock).mockResolvedValue({
        id: "new-payment-id",
        status: "pending",
      });

      // Execute the node
      await expect(
        gigstackNode.execute.call(executeFunctions)
      ).resolves.not.toThrow();

      // Verify the request was made with correct parameters
      expect(executeFunctions.helpers.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "POST",
          url: expect.stringContaining("register"),
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: "Bearer test-api-key",
          }),
          body: expect.objectContaining({
            paid: true,
            currency: "MXN",
            paymentMethod: "01",
            automateInvoiceOnComplete: true,
            clientId: "test-client-id",
            email: "test@example.com",
          }),
        })
      );
    });
  });

  describe("Invoice Resource", () => {
    beforeEach(() => {
      (executeFunctions.getNodeParameter as jest.Mock).mockImplementation(
        (param, _) => {
          if (param === "resource") return "invoice";
          return null;
        }
      );
    });

    it("should handle create operation", async () => {
      // Setup mocks for create operation
      (executeFunctions.getNodeParameter as jest.Mock).mockImplementation(
        (param, _) => {
          if (param === "resource") return "invoice";
          if (param === "operation") return "create";
          if (param === "returnFilesUrls") return true;
          if (param === "use") return "G01";
          if (param === "series") return "A";
          if (param === "payment_form") return "03";
          if (param === "invoiceType") return "I";
          if (param === "currency") return "MXN";
          if (param === "payment_method") return "PUE";
          if (param === "emails") return ["test@example.com"];
          if (param === "useClientObject") return false;
          if (param === "clientId") return "test-client-id";
          if (param === "metadata.metadataValues") return [];
          if (param === "invoiceItems.invoiceItemsValues")
            return [
              {
                name: "Test Item",
                description: "Test Description",
                quantity: 1,
                total: 100,
                product_key: "01010101",
                unit_key: "H87",
                unit_name: "Unidad de Servicio",
                taxes: {
                  taxesValues: [
                    {
                      factor: "Tasa",
                      inclusive: true,
                      rate: 0.16,
                      type: "IVA",
                      withholding: false,
                    },
                  ],
                },
              },
            ];
          return null;
        }
      );

      (executeFunctions.getCredentials as jest.Mock).mockResolvedValue({
        apiKey: "test-api-key",
      });

      (executeFunctions.helpers.request as jest.Mock).mockResolvedValue({
        id: "new-invoice-id",
        status: "completed",
      });

      // Execute the node
      await expect(
        gigstackNode.execute.call(executeFunctions)
      ).resolves.not.toThrow();

      // Verify the request was made with correct parameters
      expect(executeFunctions.helpers.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "POST",
          url: expect.stringContaining("invoices/create"),
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: "Bearer test-api-key",
          }),
          body: expect.objectContaining({
            returnFilesUrls: true,
            use: "G01",
            series: "A",
            payment_form: "03",
            type: "create_invoice",
            invoiceType: "I",
            currency: "MXN",
            payment_method: "PUE",
            clientId: "test-client-id",
          }),
        })
      );
    });
  });

  describe("Register Payment Operation", () => {
    beforeEach(() => {
      (executeFunctions.getNodeParameter as jest.Mock).mockImplementation(
        (param: string, index: number, defaultValue: any) => {
          if (param === "resource") return "payment";
          if (param === "operation") return "register";
          if (param === "paymentMethod") return "03"; // Using a different payment method to test string input
          if (param === "automateInvoiceOnComplete") return true;
          if (param === "amount") return 100;
          if (param === "currency") return "MXN";
          if (param === "concept") return "Test payment";
          if (param === "reference") return "REF123";
          if (param === "dueDate") return "2023-12-31";
          if (param === "customerEmail") return "test@example.com";
          if (param === "customerName") return "Test Customer";
          if (param === "customerTaxId") return "XAXX010101000";
          if (param === "customerAddress") return "Test Address";
          if (param === "customerCity") return "Test City";
          if (param === "customerState") return "Test State";
          if (param === "customerZipCode") return "12345";
          if (param === "customerCountry") return "MX";
          if (param === "paid") return true;
          if (param === "clientId") return "client123";
          if (param === "email") return "test@example.com";
          if (param === "items.itemsValues") return defaultValue; // Return the default value (empty array)
          return undefined;
        }
      );

      (executeFunctions.getCredentials as jest.Mock).mockResolvedValue({
        apiKey: "test-api-key",
        environment: "sandbox",
      });

      (executeFunctions.helpers.request as jest.Mock).mockResolvedValue({
        id: "pay_123",
        status: "pending",
      });
    });

    it("should register a payment with string payment method", async () => {
      await gigstackNode.execute.call(executeFunctions);

      const lastCall = (executeFunctions.helpers.request as jest.Mock).mock
        .calls[0][0];
      expect(lastCall.method).toBe("POST");
      expect(lastCall.url).toContain("/payments");
      expect(lastCall.body.paymentMethod).toBe("03"); // Check that the string value is passed correctly
    });
  });
});
