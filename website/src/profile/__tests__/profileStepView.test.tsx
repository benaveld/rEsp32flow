import "@testing-library/jest-dom";
import {
  fireEvent,
  render,
  screen,
} from "../../../utils/test-utils";
import { ProfileStep } from "../profileStep";
import { ProfileStepView } from "../profileStepView";

const menuIcon = "MoreVertIcon";
const testIndex = 14235; // random index
export const testStep: ProfileStep = {
  temperature: 20,
  timer: 16,
  Kp: 43,
  Ki: 85,
  Kd: 92,
};

test("view information", () => {
  render(<ProfileStepView step={testStep} index={0} />);

  expect(screen.getByRegex({}, testStep.timer, /\s?sec/i)).toBeVisible();
  expect(screen.getByRegex({}, testStep.temperature, /\s?°C/i)).toBeVisible();

  expect(screen.getByRegex({}, /Kp\D*/i, testStep.Kp)).toBeVisible();
  expect(screen.getByRegex({}, /Ki\D*/i, testStep.Ki)).toBeVisible();
  expect(screen.getByRegex({}, /Kd\D*/i, testStep.Kd)).toBeVisible();
});

test("no menu icon", () => {
  render(<ProfileStepView step={testStep} index={0} />);
  expect(screen.queryByTestId(menuIcon)).not.toBeInTheDocument();
})

test("display menu icon", () => {
  render(<ProfileStepView onEdit={()=>{}} step={testStep} index={0} />);
  expect(screen.queryByTestId(menuIcon)).toBeVisible();
})

test("press edit", () => {
  const onEdit = jest.fn();

  render(<ProfileStepView onEdit={onEdit} step={testStep} index={testIndex} />);

  fireEvent.click(screen.getByTestId(menuIcon));
  fireEvent.click(screen.queryByText(/edit/i) ?? screen.getByTestId("EditIcon"));

  expect(onEdit).toBeCalledWith(testIndex);
});

test("delete", () => {
  const onDelete = jest.fn();

  render(
    <ProfileStepView onDelete={onDelete} step={testStep} index={testIndex} />
  );

  fireEvent.click(screen.getByTestId(menuIcon));
  fireEvent.click(
    screen.getByText(/delete/i) ?? screen.getByTestId("DeleteIcon")
  );

  expect(onDelete).toBeCalledWith(testIndex);
});
