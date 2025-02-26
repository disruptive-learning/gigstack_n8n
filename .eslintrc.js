module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    sourceType: "module",
  },
  plugins: ["eslint-plugin-n8n-nodes-base"],
  extends: ["plugin:n8n-nodes-base/recommended"],
  rules: {
    "n8n-nodes-base/node-param-default-missing": "off",
    "n8n-nodes-base/node-class-description-empty-string": "off",
  },
};
