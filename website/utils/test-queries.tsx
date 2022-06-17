import {
  buildQueries,
  queryAllByText,
  SelectorMatcherOptions,
} from "@testing-library/react";

export const queryAllByRegex = (
  c: HTMLElement,
  options: SelectorMatcherOptions,
  ...args: (string | RegExp | number)[]
): HTMLElement[] => {
  const searchText = args
    .map((value) => {
      if (value instanceof RegExp) return value.source;
      if (typeof value === "number") return value.toString();
      return value;
    })
    .reduce((preValue, value) => preValue + value);
  return queryAllByText(c, new RegExp(searchText), options);
};

const getRegexMultipleError = (
  c: Element | null,
  options: SelectorMatcherOptions,
  ...args: (string | RegExp | number)[]
) => `Found multiple elements with the text of ${args}`;

const getRegexMissingError = (
  c: Element | null,
  options: SelectorMatcherOptions,
  ...args: (string | RegExp | number)[]
) => `Unable to find an element with text that matches ${args}`;

export const [
  queryByRegex,
  getAllByRegex,
  getByRegex,
  findAllByRegex,
  findByRegex,
] = buildQueries(queryAllByRegex, getRegexMultipleError, getRegexMissingError);
