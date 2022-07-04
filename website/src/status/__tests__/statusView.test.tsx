import "@testing-library/jest-dom";
import { render, screen } from "../../../utils/test-utils";
import StatusView from "../statusView";
import { setupServer } from "msw/node";
import { rest } from "msw";
import { statusApiUrl, StatusGetResponse } from "../statusApi";

const testStatus: StatusGetResponse = {
  oven: 42,
  chip: 13,
  fault: 0,
  faultText: [],
  uptime: 1234,
};

const server = setupServer(
  rest.get(statusApiUrl, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(testStatus));
  })
);

// Enable API mocking before tests.
beforeAll(() => server.listen());

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers());

// Disable API mocking after the tests are done.
afterAll(() => server.close());

it("loads and display oven temperature", async () => {
  render(<StatusView />);

  expect(
    await screen.findByText(testStatus.oven, { exact: false })
  ).toBeVisible();
});

it("load and display chip temperature", async () => {
  render(<StatusView />);

  expect(
    await screen.findByText(testStatus.chip, { exact: false })
  ).toBeVisible();
});
