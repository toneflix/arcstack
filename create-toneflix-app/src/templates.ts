/*
 * create-h3ravel
 *
 * (c) H3ravel Framework
 *
 * The H3ravel framework and all it's base packages are
 * open-sourced software licensed under the MIT license.
 */

/**
 * List of first party templates
 */
export const templates: {
  name: string;
  alias: "express" | "h3";
  hint: string;
  source: string;
  prereleaseSource?: string;
}[] = [
  {
    name: "Express Starter Kit",
    alias: "express",
    hint: "An Express application starter kit",
    source: "github:toneflix/toneflix-nodejs",
  },
  {
    name: "H3 Starter Kit",
    alias: "h3",
    hint: "A H3 application starter kit",
    source: "github:toneflix/toneflix-nodejs",
  },
];
