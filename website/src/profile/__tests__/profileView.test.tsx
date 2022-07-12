import "@testing-library/jest-dom";
import { setupServer } from "msw/lib/node";
import { doNothing, render, screen } from "../../../utils/test-utils";
import { Profile } from "../profileTypes";
import { ProfileView } from "../profileView";
import { testStep } from "./profileStepView.test";

const server = setupServer();

const testProfile: Profile = {
  name: "testing profile",
  id: 123,
  steps: [],
};

// Enable API mocking before tests.
beforeAll(() => server.listen());

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers());

// Disable API mocking after the tests are done.
afterAll(() => server.close());

test("view name", () => {
  render(<ProfileView profile={testProfile} onDelete={doNothing} />);
  expect(screen.getByText(testProfile.name)).toBeVisible();
});

test("view name with step", () => {
  render(
    <ProfileView
      profile={{ ...testProfile, steps: [testStep] }}
      onDelete={doNothing}
    />
  );
  expect(screen.getByText(testProfile.name)).toBeVisible();
});
