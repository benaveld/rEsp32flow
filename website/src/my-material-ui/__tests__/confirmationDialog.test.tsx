import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "../../../utils/test-utils";
import ConfirmationDialog from "../confirmationDialog";

test("open dialog with correct text", () => {
  const title = "Testing dialog";
  const confirmationText = "Confirm";
  const cancelText = "Cancel";

  render(
    <ConfirmationDialog
      title={title}
      onClose={(_) => {}}
      confirmationText={confirmationText}
      cancelText={cancelText}
      open={true}
    />
  );

  const expectVisibleText = (...args: Parameters<typeof screen["getByText"]>) =>
    expect(screen.getByText(...args)).toBeVisible();

  expectVisibleText(title, { exact: false });
  expectVisibleText(confirmationText, { exact: false });
  expectVisibleText(cancelText, { exact: false });
});

test("close dialog with close button", () => {
  const title = "Testing dialog";
  const cancelText = "Cancel";
  const handleClose = jest.fn();

  render(
    <ConfirmationDialog
      title={title}
      onClose={handleClose}
      cancelText={cancelText}
      open={true}
    />
  );

  fireEvent.click(screen.getByText(cancelText, { exact: false }));

  expect(handleClose).toBeCalledWith(false);
});

test("confirm dialog", () => {
  const title = "Testing dialog";
  const confirmationText = "Confirm";
  const handleClose = jest.fn();

  render(
    <ConfirmationDialog
      title={title}
      onClose={handleClose}
      confirmationText={confirmationText}
      open={true}
    />
  );

  fireEvent.click(screen.getByText(confirmationText, { exact: false }));

  expect(handleClose).toBeCalledWith(true);
});

test("display dialog children", () => {
  const title = "Testing dialog";
  const text = "Testing with children";

  render(
    <ConfirmationDialog title={title} onClose={(_) => {}} open={true}>
      <p>{text}</p>
    </ConfirmationDialog>
  );

  expect(screen.getByText(text)).toBeVisible();
});

// test("close dialog by pressing outside the dialog", async () => {
//   const id = "tests";
//   const title = "xxx Testing dialog outside xxx";
//   const handleClose = jest.fn();

//   render(
//     <ConfirmationDialog
//       id={id}
//       title={title}
//       onClose={handleClose}
//       open={true}
//     />
//   );

//   await screen.findByText(title, { exact: false });

//   const dialog = screen.getByRole("dialog").parentNode;
//   if(dialog !== null){
//     fireEvent.click(dialog);
//     console.log("click");
//   }

//   fireEvent.click(document.body);
//   screen.debug(dialog);

//   expect(handleClose).toBeCalledWith(false);
// });
