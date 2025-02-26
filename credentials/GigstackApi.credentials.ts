import {
  IAuthenticateGeneric,
  ICredentialType,
  INodeProperties,
} from "n8n-workflow";

export class GigstackApi implements ICredentialType {
  name = "gigstackApi";
  displayName = "Gigstack API";
  documentationUrl = "https://docs.gigstack.com";
  properties: INodeProperties[] = [
    {
      displayName: "API Key",
      name: "apiKey",
      type: "string",
      typeOptions: {
        password: true,
      },
      default: "",
    },
    {
      displayName: "Environment",
      name: "environment",
      type: "options",
      options: [
        {
          name: "Production",
          value: "production",
        },
        {
          name: "Sandbox",
          value: "sandbox",
        },
      ],
      default: "production",
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: "generic",
    properties: {
      headers: {
        Authorization: "=Bearer {{$credentials.apiKey}}",
      },
    },
  };
}
