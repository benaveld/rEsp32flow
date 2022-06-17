import "@testing-library/jest-dom";
import { rest, RestRequest } from "msw";
import { setupServer } from "msw/lib/node";
import {
  render,
  screen,
  fireEvent,
  within,
  waitFor,
  expectParamToBe,
  inputFormValue,
} from "../../../utils/test-utils";
import { Profile } from "../profile";
import { profileApiUrl } from "../profileApi";
import ProfileList from "../profileList";
import { ProfileStep } from "../profileStep";
import { testStep } from "./profileStepView.test";

const server = setupServer();

const testProfile: Profile = {
  name: "testing profile",
  id: 123,
  steps: [testStep],
};

// Enable API mocking before tests.
beforeAll(() => server.listen());

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers());

// Disable API mocking after the tests are done.
afterAll(() => server.close());

test("edit and save step", async () => {
  const newTestProfileStep: ProfileStep = {
    temperature: 345,
    timer: 26,
    Kp: 75,
    Ki: 10,
    Kd: 89,
  };

  const stub = jest.fn((req: RestRequest) => {});

  server.use(
    rest.get(profileApiUrl, (req, res, ctx) => {
      return res(ctx.status(200), ctx.json([testProfile]));
    }),
    rest.put(profileApiUrl, (req, res, ctx) => {
      stub(req);
      return res(ctx.status(200));
    })
  );

  render(<ProfileList />);
  
  const htmlProfile = await screen.findByLabelText("profile: " + testProfile.id);
  fireEvent.click(within(htmlProfile).getByTestId("ExpandMoreIcon"));

  const step = await within(htmlProfile).findByLabelText(testProfile.name + "_0");
  expect(step).toBeVisible();

  fireEvent.click(within(step).getByTestId("MoreVertIcon"));
  fireEvent.click(
    screen.queryByText(/edit/i) ?? screen.getByTestId("EditIcon")
  );

  const editStep = await screen.findByRole("form");

  inputFormValue(editStep, /temperature/i, newTestProfileStep.temperature);
  inputFormValue(editStep, /timer/i, newTestProfileStep.timer);
  inputFormValue(editStep, /Kp/i, newTestProfileStep.Kp);
  inputFormValue(editStep, /Ki/i, newTestProfileStep.Ki);
  inputFormValue(editStep, /Kd/i, newTestProfileStep.Kd);

  fireEvent.submit(editStep);

  await waitFor(() => expect(stub).toHaveBeenCalledTimes(1));

  const req = stub.mock.lastCall[0];
  expectParamToBe(req.url, "id", testProfile.id);
  expectParamToBe(req.url, "stepId", 0);

  const apiStep = req.body as ProfileStep;
  expect(+apiStep.temperature).toBe(newTestProfileStep.temperature);
  expect(+apiStep.timer).toBe(newTestProfileStep.timer);
  expect(+apiStep.Kp).toBe(newTestProfileStep.Kp);
  expect(+apiStep.Ki).toBe(newTestProfileStep.Ki);
  expect(+apiStep.Kd).toBe(newTestProfileStep.Kd);

  const editedStep = await screen.findByLabelText(testProfile.name + "_0");

  expect(within(editedStep).getByRegex({}, newTestProfileStep.timer, /\s?sec/i)).toBeVisible();
  expect(within(editedStep).getByRegex({}, newTestProfileStep.temperature, /\s?°C/i)).toBeVisible();

  expect(within(editedStep).getByRegex({}, /Kp\D*/i, newTestProfileStep.Kp)).toBeVisible();
  expect(within(editedStep).getByRegex({}, /Ki\D*/i, newTestProfileStep.Ki)).toBeVisible();
  expect(within(editedStep).getByRegex({}, /Kd\D*/i, newTestProfileStep.Kd)).toBeVisible();
});
