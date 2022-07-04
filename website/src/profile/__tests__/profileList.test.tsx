import "@testing-library/jest-dom";
import { rest, RestRequest } from "msw";
import { setupServer } from "msw/lib/node";
import {
  render,
  screen,
  fireEvent,
  within,
  inputFormValue,
  waitFor,
} from "../../../utils/test-utils";
import { Profile, ProfileStep } from "../profileTypes";
import { profileApiUrl } from "../profileApi";
import ProfileList from "../profileList";
import { expectProfileStepToBeVisible, testStep } from "./profileStepView.test";

const server = setupServer();

const testProfile: Profile = {
  name: "testing profile",
  id: testStep.profileId,
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
    ...testStep,
    temperature: 345,
    timer: 26,
    Kp: 75,
    Ki: 10,
    Kd: 89,
  };

  const stub = jest.fn((_req: RestRequest) => {
    // Do nothing.
  });

  server.use(
    rest.get(profileApiUrl, (req, res, ctx) =>
      res.once(ctx.status(200), ctx.json([testProfile]))
    ),

    rest.put(profileApiUrl, (req, res, ctx) => {
      stub(req);
      return res.once(ctx.status(200));
    })
  );

  render(<ProfileList />);

  const htmlProfile = await screen.findByLabelText(
    `${testProfile.id} ${testProfile.name}`
  );
  fireEvent.click(within(htmlProfile).getByTestId("ExpandMoreIcon"));

  const step = await within(htmlProfile).findByLabelText(
    `${testProfile.name}_${testStep.id}`
  );
  expect(step).toBeVisible();
  expectProfileStepToBeVisible(step, testStep);

  server.use(
    rest.get(profileApiUrl, (req, res, ctx) => {
      const newTestProfile: Profile = {
        ...testProfile,
        steps: [newTestProfileStep],
      };
      return res.once(ctx.status(200), ctx.json([newTestProfile]));
    })
  );

  fireEvent.click(within(step).getByTestId("MoreVertIcon"));
  fireEvent.click(
    screen.queryByText(/edit/i) ?? screen.getByTestId("EditIcon")
  );

  const editStep = await screen.findByRole("form");

  const insertValue = inputFormValue.bind(undefined, editStep);
  insertValue(/temperature/i, newTestProfileStep.temperature);
  insertValue(/timer/i, newTestProfileStep.timer);
  insertValue(/Kp/i, newTestProfileStep.Kp);
  insertValue(/Ki/i, newTestProfileStep.Ki);
  insertValue(/Kd/i, newTestProfileStep.Kd);

  fireEvent.submit(editStep);

  await waitFor(() => expect(stub).toBeCalledTimes(1));

  const editedStep = await screen.findByLabelText(
    `${testProfile.name}_${testStep.id}`
  );

  expectProfileStepToBeVisible(editedStep, newTestProfileStep);
});
