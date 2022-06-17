import "@testing-library/jest-dom";
import {
  render,
  useActDispatch,
  screen,
} from "../../../utils/test-utils";
import StatusView from "../statusView";
import { setupServer } from "msw/node";
import { rest } from "msw";
import { statusApiUrl } from "../statusApi";
import { StatusState } from "../state/statusTypes";
import { updateStatus } from "../state/statusActions";

const testStatus = {
  oven: 42,
  chip: 13,
} as StatusState;

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
  await useActDispatch(updateStatus());

  expect(screen.getByRegex({}, testStatus.oven, /(\.0+)?/)).toBeVisible();
});

it("load and display chip temperature", async () => {
  render(<StatusView />);
  await useActDispatch(updateStatus());

  expect(screen.getByRegex({}, testStatus.chip, /(\.0+)?/i)).toBeVisible();
});
