import {
  act,
  fireEvent,
  queries as dltQueries,
  Queries,
  render,
  RenderOptions,
  screen,
  SelectorMatcherOptions,
  within,
} from "@testing-library/react";
import { FC, ReactElement, ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "../src/state";
import * as customQueries from "./test-queries";

export const queries = { ...dltQueries, ...customQueries };

export const useActDispatch = (...args: Parameters<typeof store.dispatch>) =>
  act(async () => {
    await store.dispatch(...args);
  });

export const inputFormValue = (
  form: HTMLElement,
  label: string | RegExp,
  value: any,
  options?: SelectorMatcherOptions
) =>
  fireEvent.input(within(form).getByLabelText(label, options), {
    target: { value },
  });

export const expectParamToBe = (url: URL, param: string, value: any) => {
  const paramValue = url.searchParams.get(param);
  expect(paramValue).not.toBe(null);
  if (typeof value === "number") return expect(+paramValue!).toBe(value);
  expect(paramValue!).toBe(value);
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => {
  const AllProviders: FC<{ children: ReactNode }> = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };
  return render(ui, {
    wrapper: AllProviders,
    queries: { ...queries },
    ...options,
  });
};

function customWithin<
  QueriesToBind extends Queries = typeof queries,
  // Extra type parameter required for reassignment.
  T extends QueriesToBind = QueriesToBind
>(element: HTMLElement, queriesToBind?: T) {
  if (queriesToBind === undefined) {
    return within<typeof queries>(element, queries);
  }
  return within<typeof queriesToBind & typeof queries>(element, {
    ...queries,
    ...queriesToBind,
  });
}

const customScreen = { ...screen, ...customWithin(document.body) };

export * from "@testing-library/react";
export {
  customRender as render,
  customScreen as screen,
  customWithin as within,
};
export type Screen = typeof customScreen;
