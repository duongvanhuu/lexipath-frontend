import next from "eslint-config-next";

const eslintConfig = [
  ...next,
  {
    ignores: ["playwright-report/**", "coverage/**", "test-results/**"],
  },
];

export default eslintConfig;
