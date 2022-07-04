import "@testing-library/jest-dom";
import { render, Screen, screen, within } from "../../../utils/test-utils";
import { ProfileStep } from "../profileTypes";
import { ProfileStepView } from "../profileStepView";

const menuIcon = "MoreVertIcon";
export const testStep: ProfileStep = {
  temperature: 20,
  timer: 16,
  Kp: 43,
  Ki: 85,
  Kd: 92,
  profileId: 35,
  id: 19,
};

export function expectProfileStepToBeVisible(
  c: HTMLElement | Screen,
  step: ProfileStep
) {
  const element = c instanceof HTMLElement ? within(c) : c;
  function testEditStep(...args: (string | number | RegExp)[]) {
    return expect(element.getByRegex({}, ...args)).toBeVisible();
  }

  testEditStep(step.timer, /\s?sec/i);
  testEditStep(step.temperature, /\s?°C/i);
  testEditStep(/Kp\D*/i, step.Kp);
  testEditStep(/Ki\D*/i, step.Ki);
  testEditStep(/Kd\D*/i, step.Kd);
}

test("view information", () => {
  render(<ProfileStepView step={testStep} />);
  expectProfileStepToBeVisible(screen, testStep);
});

test("no menu icon", () => {
  render(<ProfileStepView step={testStep} />);
  expect(screen.queryByTestId(menuIcon)).not.toBeInTheDocument();
});

test("display menu icon", () => {
  render(<ProfileStepView step={testStep} canEdit />);
  expect(screen.queryByTestId(menuIcon)).toBeVisible();
});

// test("press edit", () => {
//   const onEdit = jest.fn();

//   render(<ProfileStepView step={testStep} canEdit />);

//   fireEvent.click(screen.getByTestId(menuIcon));
//   fireEvent.click(
//     screen.queryByText(/edit/i) ?? screen.getByTestId("EditIcon")
//   );

//   expect(onEdit).toBeCalledWith(testIndex);
// });

// test("delete", () => {
//   const onDelete = jest.fn();

//   render(<ProfileStepView step={testStep} canEdit/>);

//   fireEvent.click(screen.getByTestId(menuIcon));
//   fireEvent.click(
//     screen.getByText(/delete/i) ?? screen.getByTestId("DeleteIcon")
//   );

//   expect(onDelete).toBeCalledWith(testIndex);
// });
