import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
} from "n8n-workflow";

export class Gigstack implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Gigstack",
    name: "gigstack",
    icon: "file:gigstack.svg",
    group: ["transform"],
    version: 2,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: "Interact with Gigstack API - Payments and Invoices",
    defaults: {
      name: "Gigstack",
    },
    inputs: ["main"],
    outputs: ["main"],
    credentials: [
      {
        name: "gigstackApi",
        required: true,
      },
    ],
    properties: [
      {
        displayName: "Resource",
        name: "resource",
        type: "options",
        noDataExpression: true,
        options: [
          {
            name: "Payment",
            value: "payment",
            description: "Work with payments",
          },
          {
            name: "Invoice",
            value: "invoice",
            description: "Work with invoices",
          },
        ],
        default: "payment",
        description: "Resource to use",
      },
      {
        displayName: "Operation",
        name: "operation",
        type: "options",
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ["payment"],
          },
        },
        options: [
          {
            name: "Create",
            value: "create",
            description: "Create a new payment",
            action: "Create a payment",
          },
          {
            name: "Get",
            value: "get",
            description: "Get payment details",
            action: "Get a payment",
          },
          {
            name: "Register",
            value: "register",
            description: "Register a new payment",
            action: "Register a payment",
          },
        ],
        default: "create",
      },
      {
        displayName: "Amount",
        name: "amount",
        type: "number",
        required: true,
        displayOptions: {
          show: {
            operation: ["create"],
            resource: ["payment"],
          },
        },
        default: 0,
        description: "Amount to be paid",
      },
      {
        displayName: "Currency",
        name: "currency",
        type: "string",
        required: true,
        displayOptions: {
          show: {
            operation: ["create"],
            resource: ["payment"],
          },
        },
        default: "USD",
        description: "Currency for the payment",
      },
      {
        displayName: "Payment ID",
        name: "paymentId",
        type: "string",
        required: true,
        displayOptions: {
          show: {
            operation: ["get"],
            resource: ["payment"],
          },
        },
        default: "",
        description: "ID of the payment to retrieve",
      },
      {
        displayName: "Paid",
        name: "paid",
        type: "boolean",
        required: true,
        displayOptions: {
          show: {
            operation: ["register"],
            resource: ["payment"],
          },
        },
        default: true,
        description: "Whether the payment is already paid",
      },
      {
        displayName: "Currency",
        name: "currency",
        type: "string",
        required: true,
        displayOptions: {
          show: {
            operation: ["register"],
            resource: ["payment"],
          },
        },
        default: "MXN",
        description: "Currency for the payment",
      },
      {
        displayName: "Payment Method",
        name: "paymentMethod",
        type: "options",
        noDataExpression: true,
        required: true,
        displayOptions: {
          show: {
            operation: ["register"],
            resource: ["payment"],
          },
        },
        options: [
          {
            name: "Efectivo (01)",
            value: "01",
          },
          {
            name: "Cheque nominativo (02)",
            value: "02",
          },
          {
            name: "Transferencia electrónica de fondos (03)",
            value: "03",
          },
          {
            name: "Tarjeta de crédito (04)",
            value: "04",
          },
          {
            name: "Monedero electrónico (05)",
            value: "05",
          },
          {
            name: "Dinero electrónico (06)",
            value: "06",
          },
          {
            name: "Vales de despensa (08)",
            value: "08",
          },
          {
            name: "Dación en pago (12)",
            value: "12",
          },
          {
            name: "Pago por subrogación (13)",
            value: "13",
          },
          {
            name: "Pago por consignación (14)",
            value: "14",
          },
          {
            name: "Condonación (15)",
            value: "15",
          },
          {
            name: "Compensación (17)",
            value: "17",
          },
          {
            name: "Novación (23)",
            value: "23",
          },
          {
            name: "Confusión (24)",
            value: "24",
          },
          {
            name: "Remisión de deuda (25)",
            value: "25",
          },
          {
            name: "Prescripción o caducidad (26)",
            value: "26",
          },
          {
            name: "A satisfacción del acreedor (27)",
            value: "27",
          },
          {
            name: "Tarjeta de débito (28)",
            value: "28",
          },
          {
            name: "Tarjeta de servicios (29)",
            value: "29",
          },
          {
            name: "Aplicación de anticipos (30)",
            value: "30",
          },
          {
            name: "Intermediario pagos (31)",
            value: "31",
          },
          {
            name: "Por definir (99)",
            value: "99",
          },
        ],
        default: "01",
        description: "Payment method code",
      },
      {
        displayName: "Automate Invoice On Complete",
        name: "automateInvoiceOnComplete",
        type: "boolean",
        required: true,
        displayOptions: {
          show: {
            operation: ["register"],
            resource: ["payment"],
          },
        },
        default: true,
        description:
          "Whether to automatically generate an invoice when payment is complete",
      },
      {
        displayName: "Client ID",
        name: "clientId",
        type: "string",
        required: false,
        displayOptions: {
          show: {
            operation: ["register"],
            resource: ["payment"],
          },
        },
        default: "",
        description: "ID of the client",
      },
      {
        displayName: "Email",
        name: "email",
        type: "string",
        required: false,
        displayOptions: {
          show: {
            operation: ["register"],
            resource: ["payment"],
          },
        },
        default: "",
        description: "Email address for the payment",
      },
      {
        displayName: "Items",
        name: "items",
        placeholder: "Add Item",
        type: "fixedCollection",
        typeOptions: {
          multipleValues: true,
        },
        displayOptions: {
          show: {
            operation: ["register"],
            resource: ["payment"],
          },
        },
        default: {},
        options: [
          {
            name: "itemsValues",
            displayName: "Item",
            values: [
              {
                displayName: "Description",
                name: "description",
                type: "string",
                default: "",
                description: "Description of the item",
              },
              {
                displayName: "Discount",
                name: "discount",
                type: "number",
                default: 0,
                description: "Discount amount for the item",
              },
              {
                displayName: "Product Key",
                name: "product_key",
                type: "string",
                default: "01010101",
                description: "Product key for the item",
              },
              {
                displayName: "Unit Key",
                name: "unit_key",
                type: "string",
                default: "E48",
                description: "Unit key for the item",
              },
              {
                displayName: "Unit Name",
                name: "unit_name",
                type: "string",
                default: "Unidad de Servicio",
                description: "Unit name for the item",
              },
              {
                displayName: "Quantity",
                name: "quantity",
                type: "number",
                default: 1,
                description: "Quantity of the item",
              },
              {
                displayName: "Amount",
                name: "amount",
                type: "number",
                default: 0,
                description: "Amount for the item",
              },
              {
                displayName: "Taxes",
                name: "taxes",
                placeholder: "Add Tax",
                type: "fixedCollection",
                typeOptions: {
                  multipleValues: true,
                },
                default: {},
                options: [
                  {
                    name: "taxesValues",
                    displayName: "Tax",
                    values: [
                      {
                        displayName: "Factor",
                        name: "factor",
                        type: "string",
                        default: "Tasa",
                        description: "Factor type for the tax",
                      },
                      {
                        displayName: "Inclusive",
                        name: "inclusive",
                        type: "boolean",
                        default: true,
                        description: "Whether the tax is inclusive",
                      },
                      {
                        displayName: "Rate",
                        name: "rate",
                        type: "number",
                        default: 0.16,
                        description: "Tax rate",
                      },
                      {
                        displayName: "Type",
                        name: "type",
                        type: "string",
                        default: "IVA",
                        description: "Type of tax",
                      },
                      {
                        displayName: "Withholding",
                        name: "withholding",
                        type: "boolean",
                        default: false,
                        description: "Whether the tax is withholding",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        displayName: "Operation",
        name: "operation",
        type: "options",
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ["invoice"],
          },
        },
        options: [
          {
            name: "Create",
            value: "create",
            description: "Create a new invoice",
            action: "Create an invoice",
          },
        ],
        default: "create",
      },
      {
        displayName: "Return Files URLs",
        name: "returnFilesUrls",
        type: "boolean",
        required: true,
        displayOptions: {
          show: {
            operation: ["create"],
            resource: ["invoice"],
          },
        },
        default: true,
        description: "Whether to return URLs for the generated files",
      },
      {
        displayName: "Use",
        name: "use",
        type: "string",
        required: true,
        displayOptions: {
          show: {
            operation: ["create"],
            resource: ["invoice"],
          },
        },
        default: "G01",
        description: "Use code for the invoice",
      },
      {
        displayName: "Series",
        name: "series",
        type: "string",
        required: true,
        displayOptions: {
          show: {
            operation: ["create"],
            resource: ["invoice"],
          },
        },
        default: "",
        description: "Series for the invoice",
      },
      {
        displayName: "Payment Form",
        name: "payment_form",
        type: "options",
        noDataExpression: true,
        required: true,
        displayOptions: {
          show: {
            operation: ["create"],
            resource: ["invoice"],
          },
        },
        options: [
          {
            name: "Efectivo (01)",
            value: "01",
          },
          {
            name: "Cheque nominativo (02)",
            value: "02",
          },
          {
            name: "Transferencia electrónica de fondos (03)",
            value: "03",
          },
          {
            name: "Tarjeta de crédito (04)",
            value: "04",
          },
          {
            name: "Monedero electrónico (05)",
            value: "05",
          },
          {
            name: "Dinero electrónico (06)",
            value: "06",
          },
          {
            name: "Vales de despensa (08)",
            value: "08",
          },
          {
            name: "Dación en pago (12)",
            value: "12",
          },
          {
            name: "Pago por subrogación (13)",
            value: "13",
          },
          {
            name: "Pago por consignación (14)",
            value: "14",
          },
          {
            name: "Condonación (15)",
            value: "15",
          },
          {
            name: "Compensación (17)",
            value: "17",
          },
          {
            name: "Novación (23)",
            value: "23",
          },
          {
            name: "Confusión (24)",
            value: "24",
          },
          {
            name: "Remisión de deuda (25)",
            value: "25",
          },
          {
            name: "Prescripción o caducidad (26)",
            value: "26",
          },
          {
            name: "A satisfacción del acreedor (27)",
            value: "27",
          },
          {
            name: "Tarjeta de débito (28)",
            value: "28",
          },
          {
            name: "Tarjeta de servicios (29)",
            value: "29",
          },
          {
            name: "Aplicación de anticipos (30)",
            value: "30",
          },
          {
            name: "Intermediario pagos (31)",
            value: "31",
          },
          {
            name: "Por definir (99)",
            value: "99",
          },
        ],
        default: "03",
        description: "Payment form code",
      },
      {
        displayName: "Invoice Type",
        name: "invoiceType",
        type: "options",
        noDataExpression: true,
        required: true,
        displayOptions: {
          show: {
            operation: ["create"],
            resource: ["invoice"],
          },
        },
        options: [
          {
            name: "Ingreso (I)",
            value: "I",
          },
          {
            name: "Egreso (E)",
            value: "E",
          },
          {
            name: "Traslado (T)",
            value: "T",
          },
          {
            name: "Nómina (N)",
            value: "N",
          },
          {
            name: "Pago (P)",
            value: "P",
          },
        ],
        default: "I",
        description: "Type of invoice",
      },
      {
        displayName: "Currency",
        name: "currency",
        type: "options",
        noDataExpression: true,
        required: true,
        displayOptions: {
          show: {
            operation: ["create"],
            resource: ["invoice"],
          },
        },
        options: [
          {
            name: "MXN - Mexican Peso",
            value: "MXN",
          },
          {
            name: "USD - US Dollar",
            value: "USD",
          },
          {
            name: "EUR - Euro",
            value: "EUR",
          },
        ],
        default: "MXN",
        description: "Currency for the invoice",
      },
      {
        displayName: "Payment Method",
        name: "payment_method",
        type: "options",
        noDataExpression: true,
        required: true,
        displayOptions: {
          show: {
            operation: ["create"],
            resource: ["invoice"],
          },
        },
        options: [
          {
            name: "PUE - Pago en una sola exhibición",
            value: "PUE",
          },
          {
            name: "PPD - Pago en parcialidades o diferido",
            value: "PPD",
          },
        ],
        default: "PUE",
        description: "Payment method code",
      },
      {
        displayName: "Emails",
        name: "emails",
        type: "string",
        typeOptions: {
          multipleValues: true,
        },
        required: false,
        displayOptions: {
          show: {
            operation: ["create"],
            resource: ["invoice"],
          },
        },
        default: [],
        description: "Email addresses to send the invoice to",
      },
      {
        displayName: "Client ID",
        name: "clientId",
        type: "string",
        required: false,
        displayOptions: {
          show: {
            operation: ["create"],
            resource: ["invoice"],
          },
          hide: {
            useClientObject: [true],
          },
        },
        default: "",
        description: "ID of an existing client",
      },
      {
        displayName: "Use Client Object",
        name: "useClientObject",
        type: "boolean",
        required: true,
        displayOptions: {
          show: {
            operation: ["create"],
            resource: ["invoice"],
          },
        },
        default: false,
        description:
          "Whether to specify client details instead of using a client ID",
      },
      {
        displayName: "Client RFC",
        name: "clientRfc",
        type: "string",
        required: true,
        displayOptions: {
          show: {
            operation: ["create"],
            resource: ["invoice"],
            useClientObject: [true],
          },
        },
        default: "",
        description: "RFC of the client",
      },
      {
        displayName: "Client Legal Name",
        name: "clientLegalName",
        type: "string",
        required: true,
        displayOptions: {
          show: {
            operation: ["create"],
            resource: ["invoice"],
            useClientObject: [true],
          },
        },
        default: "",
        description: "Legal name of the client",
      },
      {
        displayName: "Client Tax System",
        name: "clientTaxSystem",
        type: "options",
        noDataExpression: true,
        required: true,
        displayOptions: {
          show: {
            operation: ["create"],
            resource: ["invoice"],
            useClientObject: [true],
          },
        },
        options: [
          {
            name: "General de Ley Personas Morales (601)",
            value: "601",
          },
          {
            name: "Personas Morales con Fines no Lucrativos (603)",
            value: "603",
          },
          {
            name: "Sueldos y Salarios e Ingresos Asimilados a Salarios (605)",
            value: "605",
          },
          {
            name: "Arrendamiento (606)",
            value: "606",
          },
          {
            name: "Régimen de Enajenación o Adquisición de Bienes (607)",
            value: "607",
          },
          {
            name: "Demás ingresos (608)",
            value: "608",
          },
          {
            name: "Residentes en el Extranjero sin Establecimiento Permanente en México (610)",
            value: "610",
          },
          {
            name: "Régimen de Incorporación Fiscal (612)",
            value: "612",
          },
          {
            name: "Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras (620)",
            value: "620",
          },
          {
            name: "Régimen Simplificado de Confianza (626)",
            value: "626",
          },
        ],
        default: "601",
        description: "Tax system of the client",
      },
      {
        displayName: "Client ZIP Code",
        name: "clientZipCode",
        type: "string",
        required: false,
        displayOptions: {
          show: {
            operation: ["create"],
            resource: ["invoice"],
            useClientObject: [true],
          },
        },
        default: "",
        description: "ZIP code of the client",
      },
      {
        displayName: "Client Country",
        name: "clientCountry",
        type: "string",
        required: true,
        displayOptions: {
          show: {
            operation: ["create"],
            resource: ["invoice"],
            useClientObject: [true],
          },
        },
        default: "MEX",
        description: "Country code of the client (e.g., MEX for Mexico)",
      },
      {
        displayName: "Metadata",
        name: "metadata",
        placeholder: "Add Metadata",
        type: "fixedCollection",
        typeOptions: {
          multipleValues: true,
        },
        displayOptions: {
          show: {
            operation: ["create"],
            resource: ["invoice"],
          },
        },
        default: {},
        options: [
          {
            name: "metadataValues",
            displayName: "Metadata",
            values: [
              {
                displayName: "Key",
                name: "key",
                type: "string",
                default: "",
                description: "Key of the metadata",
              },
              {
                displayName: "Value",
                name: "value",
                type: "string",
                default: "",
                description: "Value of the metadata",
              },
            ],
          },
        ],
      },
      {
        displayName: "Invoice Items",
        name: "invoiceItems",
        placeholder: "Add Invoice Item",
        type: "fixedCollection",
        typeOptions: {
          multipleValues: true,
        },
        displayOptions: {
          show: {
            operation: ["create"],
            resource: ["invoice"],
          },
        },
        default: {},
        options: [
          {
            name: "invoiceItemsValues",
            displayName: "Item",
            values: [
              {
                displayName: "Name",
                name: "name",
                type: "string",
                default: "",
                description: "Name of the item",
              },
              {
                displayName: "Description",
                name: "description",
                type: "string",
                default: "",
                description: "Description of the item",
              },
              {
                displayName: "Quantity",
                name: "quantity",
                type: "number",
                default: 1,
                description: "Quantity of the item",
              },
              {
                displayName: "Total",
                name: "total",
                type: "number",
                default: 0,
                description: "Total amount for the item",
              },
              {
                displayName: "Product Key",
                name: "product_key",
                type: "string",
                default: "01010101",
                description: "Product key for the item",
              },
              {
                displayName: "Unit Key",
                name: "unit_key",
                type: "string",
                default: "H87",
                description: "Unit key for the item",
              },
              {
                displayName: "Unit Name",
                name: "unit_name",
                type: "string",
                default: "Unidad de Servicio",
                description: "Unit name for the item",
              },
              {
                displayName: "Taxes",
                name: "taxes",
                placeholder: "Add Tax",
                type: "fixedCollection",
                typeOptions: {
                  multipleValues: true,
                },
                default: {},
                options: [
                  {
                    name: "taxesValues",
                    displayName: "Tax",
                    values: [
                      {
                        displayName: "Factor",
                        name: "factor",
                        type: "string",
                        default: "Tasa",
                        description: "Factor type for the tax",
                      },
                      {
                        displayName: "Inclusive",
                        name: "inclusive",
                        type: "boolean",
                        default: true,
                        description: "Whether the tax is inclusive",
                      },
                      {
                        displayName: "Rate",
                        name: "rate",
                        type: "number",
                        default: 0.16,
                        description: "Tax rate",
                      },
                      {
                        displayName: "Type",
                        name: "type",
                        type: "string",
                        default: "IVA",
                        description: "Type of tax",
                      },
                      {
                        displayName: "Withholding",
                        name: "withholding",
                        type: "boolean",
                        default: false,
                        description: "Whether the tax is withholding",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const resource = this.getNodeParameter("resource", 0) as string;
    const operation = this.getNodeParameter("operation", 0) as string;
    const credentials = await this.getCredentials("gigstackApi");

    let responseData;

    for (let i = 0; i < items.length; i++) {
      try {
        if (resource === "payment") {
          if (operation === "get") {
            const paymentId = this.getNodeParameter("paymentId", i) as string;

            // Make API call
            const options = {
              method: "GET",
              url: `https://gigstack-cfdi-bjekv7t4.uc.gateway.dev/v1/payments/view?id=${paymentId}`,
              headers: {
                Authorization: `Bearer ${credentials.apiKey}`,
              },
              json: true,
            };

            responseData = await this.helpers.request(options);
          }
          if (operation === "register") {
            // Get parameters
            const paid = this.getNodeParameter("paid", i) as boolean;
            const currency = this.getNodeParameter("currency", i) as string;
            const paymentMethod = this.getNodeParameter(
              "paymentMethod",
              i
            ) as string;
            const automateInvoiceOnComplete = this.getNodeParameter(
              "automateInvoiceOnComplete",
              i
            ) as boolean;
            const clientId = this.getNodeParameter("clientId", i) as string;
            const email = this.getNodeParameter("email", i) as string;

            // Get items
            const itemsData = this.getNodeParameter(
              "items.itemsValues",
              i,
              []
            ) as Array<{
              description: string;
              discount: number;
              product_key: string;
              unit_key: string;
              unit_name: string;
              quantity: number;
              amount: number;
              taxes: {
                taxesValues: Array<{
                  factor: string;
                  inclusive: boolean;
                  rate: number;
                  type: string;
                  withholding: boolean;
                }>;
              };
            }>;

            // Format items for API request
            const items = itemsData.map((item) => {
              const formattedItem: any = {
                description: item.description,
                discount: item.discount,
                product_key: item.product_key,
                unit_key: item.unit_key,
                unit_name: item.unit_name,
                quantity: item.quantity,
                amount: item.amount,
              };

              if (
                item.taxes &&
                item.taxes.taxesValues &&
                item.taxes.taxesValues.length > 0
              ) {
                formattedItem.taxes = item.taxes.taxesValues.map((tax) => ({
                  factor: tax.factor,
                  inclusive: tax.inclusive,
                  rate: tax.rate,
                  type: tax.type,
                  withholding: tax.withholding,
                }));
              }

              return formattedItem;
            });

            // Prepare request body
            const body = {
              paid,
              items,
              currency,
              paymentMethod,
              automateInvoiceOnComplete,
              clientId,
              email,
            };

            // Make API call
            const options = {
              method: "POST",
              url: "https://gigstack-cfdi-bjekv7t4.uc.gateway.dev/v1/payments/register",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${credentials.apiKey}`,
              },
              body,
              json: true,
            };

            responseData = await this.helpers.request(options);
          }
        }

        if (resource === "invoice") {
          if (operation === "create") {
            // Get parameters
            const returnFilesUrls = this.getNodeParameter(
              "returnFilesUrls",
              i
            ) as boolean;
            const use = this.getNodeParameter("use", i) as string;
            const series = this.getNodeParameter("series", i) as string;
            const payment_form = this.getNodeParameter(
              "payment_form",
              i
            ) as string;
            const invoiceType = this.getNodeParameter(
              "invoiceType",
              i
            ) as string;
            const currency = this.getNodeParameter("currency", i) as string;
            const payment_method = this.getNodeParameter(
              "payment_method",
              i
            ) as string;
            const emails = this.getNodeParameter("emails", i, []) as string[];
            const useClientObject = this.getNodeParameter(
              "useClientObject",
              i
            ) as boolean;

            // Get invoice items
            const invoiceItemsData = this.getNodeParameter(
              "invoiceItems.invoiceItemsValues",
              i,
              []
            ) as Array<{
              name: string;
              description: string;
              quantity: number;
              total: number;
              product_key: string;
              unit_key: string;
              unit_name: string;
              taxes: {
                taxesValues: Array<{
                  factor: string;
                  inclusive: boolean;
                  rate: number;
                  type: string;
                  withholding: boolean;
                }>;
              };
            }>;

            // Format invoice items for API request
            const invoiceItems = invoiceItemsData.map((item) => {
              const formattedItem: any = {
                name: item.name,
                description: item.description,
                quantity: item.quantity,
                total: item.total,
                product_key: item.product_key,
                unit_key: item.unit_key,
                unit_name: item.unit_name,
              };

              if (
                item.taxes &&
                item.taxes.taxesValues &&
                item.taxes.taxesValues.length > 0
              ) {
                formattedItem.taxes = item.taxes.taxesValues.map((tax) => ({
                  factor: tax.factor,
                  inclusive: tax.inclusive,
                  rate: tax.rate,
                  type: tax.type,
                  withholding: tax.withholding,
                }));
              }

              return formattedItem;
            });

            // Get metadata
            const metadataData = this.getNodeParameter(
              "metadata.metadataValues",
              i,
              []
            ) as Array<{
              key: string;
              value: string;
            }>;

            // Format metadata for API request
            const metadata: Record<string, string> = {};
            if (metadataData.length > 0) {
              metadataData.forEach((item) => {
                metadata[item.key] = item.value;
              });
            }

            // Prepare request body
            const body: Record<string, any> = {
              returnFilesUrls,
              use,
              series,
              payment_form,
              type: "create_invoice",
              relation: null,
              emails,
              related: null,
              invoiceType,
              currency,
              export: null,
              payment_method,
              items: invoiceItems,
              metadata,
            };

            // Add client information
            if (useClientObject) {
              const clientRfc = this.getNodeParameter("clientRfc", i) as string;
              const clientLegalName = this.getNodeParameter(
                "clientLegalName",
                i
              ) as string;
              const clientTaxSystem = this.getNodeParameter(
                "clientTaxSystem",
                i
              ) as string;
              const clientZipCode = this.getNodeParameter(
                "clientZipCode",
                i,
                ""
              ) as string;
              const clientCountry = this.getNodeParameter(
                "clientCountry",
                i
              ) as string;

              body.client = {
                rfc: clientRfc,
                legal_name: clientLegalName,
                tax_system: {
                  label: "", // The label is not used by the API
                  value: clientTaxSystem,
                },
                bcc: [],
                address: {
                  zip: clientZipCode,
                  country: clientCountry,
                },
              };
            } else {
              const clientId = this.getNodeParameter(
                "clientId",
                i,
                ""
              ) as string;
              if (clientId) {
                body.clientId = clientId;
              }
            }

            // Make API call
            const options = {
              method: "POST",
              url: "https://gigstack-cfdi-bjekv7t4.uc.gateway.dev/v1/invoices/create",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${credentials.apiKey}`,
              },
              body,
              json: true,
            };

            responseData = await this.helpers.request(options);
          }
        }

        const executionData = this.helpers.constructExecutionMetaData(
          this.helpers.returnJsonArray(responseData),
          { itemData: { item: i } }
        );

        returnData.push(...executionData);
      } catch (error: any) {
        if (this.continueOnFail()) {
          const executionErrorData = this.helpers.constructExecutionMetaData(
            this.helpers.returnJsonArray({ error: error.message }),
            { itemData: { item: i } }
          );
          returnData.push(...executionErrorData);
          continue;
        }
        throw error;
      }
    }

    return this.prepareOutputData(returnData);
  }
}
