import "@testing-library/jest-dom";
import {
  useActDispatch,
  render,
  screen,
} from "../../../utils/test-utils";
import { ProfileStepForm } from "../profileStepForm";
import { editProfileStep, EditProfileStepParam } from "../state/profileSlice";

const testEdit: EditProfileStepParam = {
  profile: {
    name: "test",
    id: 123,
    steps: [],
  },
  step: {
    temperature: 20,
    timer: 16,
    Kp: 43,
    Ki: 85,
    Kd: 92,
  },
  stepIndex: 0,
};

test("view initial values", async () => {
  await useActDispatch(editProfileStep(testEdit));
  render(<ProfileStepForm />);
  const { temperature, timer, Kp, Ki, Kd} = testEdit.step;

  const expectToHaveDisplayValue = (label: string | RegExp, expected: number) =>
    expect(screen.getByLabelText(label, {exact: false})).toHaveDisplayValue(
      expected.toString()
    );

  expectToHaveDisplayValue("temperature", temperature);
  expectToHaveDisplayValue("timer", timer);
  expectToHaveDisplayValue("Kp", Kp);
  expectToHaveDisplayValue("Ki", Ki);
  expectToHaveDisplayValue("Kd", Kd);
});