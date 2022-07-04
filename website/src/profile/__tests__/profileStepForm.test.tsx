import "@testing-library/jest-dom";
import { useActDispatch, render, screen } from "../../../utils/test-utils";
import { ProfileStepForm } from "../profileStepForm";
import { ProfileStep } from "../profileTypes";
import { editProfileStep } from "../state/profileSlice";

const testEditStep: ProfileStep = {
  temperature: 20,
  timer: 16,
  Kp: 43,
  Ki: 85,
  Kd: 92,
  profileId: 235,
  id: 40,
};

test("view initial values", async () => {
  await useActDispatch(editProfileStep(testEditStep));
  render(<ProfileStepForm />);
  const { temperature, timer, Kp, Ki, Kd } = testEditStep;

  const expectToHaveDisplayValue = (label: string | RegExp, expected: number) =>
    expect(screen.getByLabelText(label, { exact: false })).toHaveDisplayValue(
      expected.toString()
    );

  expectToHaveDisplayValue("temperature", temperature);
  expectToHaveDisplayValue("timer", timer);
  expectToHaveDisplayValue("Kp", Kp);
  expectToHaveDisplayValue("Ki", Ki);
  expectToHaveDisplayValue("Kd", Kd);
});
