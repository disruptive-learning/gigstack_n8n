# Gigstack n8n Node

This is a custom n8n node for integrating with the Gigstack API. It allows you to create and manage payments and invoices directly from your n8n workflows.

## Features

- **Payment Operations**:

  - Create payments
  - Get payment details
  - Register payments

- **Invoice Operations**:
  - Create invoices with detailed information
  - Support for multiple payment methods and currencies
  - Customizable invoice items and taxes

## Installation

You can install this node in your n8n instance using npm:

```bash
npm install n8n-nodes-gigstack
```

## Configuration

To use this node, you need to configure your Gigstack API credentials in n8n:

1. Go to **Settings** > **Credentials**
2. Click on **New Credential**
3. Select **Gigstack API**
4. Enter your API Key
5. Save the credential

## Usage

After installation, the Gigstack node will be available in the nodes panel. You can use it in your workflows to:

- Create payment links
- Register payments
- Generate invoices
- Retrieve payment information

## Development

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## License

MIT
