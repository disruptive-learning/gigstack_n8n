# n8n-nodes-gigstack

This is a community node for [n8n](https://n8n.io/) that integrates with the [Gigstack API](https://gigstack.com). It allows you to create and manage payments and invoices directly from your n8n workflows.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Resources](#resources)  
[Version history](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Community Node Installation

1. Open your n8n instance
2. Go to **Settings** > **Community Nodes**
3. Select **Install**
4. Enter `n8n-nodes-gigstack` in **Enter npm package name**
5. Agree to the risks of using community nodes: select **I understand the risks of installing unverified code from a third party**
6. Select **Install**

After installing the node, you can use it like any other node. If you're using Docker, you need to restart your n8n container for the node to show up.

## Operations

### Payment Operations

- **Create**: Create a new payment
- **Get**: Get payment details
- **Register**: Register a new payment

### Invoice Operations

- **Create**: Create a new invoice with detailed information

## Credentials

To use this node, you need to configure your Gigstack API credentials in n8n:

1. Go to **Settings** > **Credentials**
2. Click on **New Credential**
3. Select **Gigstack API**
4. Enter your API Key
5. Select the environment (Production or Sandbox)
6. Save the credential

## Compatibility

This node has been tested with n8n version 0.214.0 and Gigstack API v1.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Gigstack API documentation](https://docs.gigstack.com)

## Version history

### 1.1.0

- Added Invoice resource with Create operation
- Fixed Get Payment operation to use correct API endpoint
- Updated node version to 2

### 1.0.0

- Initial release
- Added Payment resource with Create, Get, and Register operations
