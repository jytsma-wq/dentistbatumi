type Disclosure = {
  open: boolean;
};

type ClassList = {
  add(name: string): void;
  remove(name: string): void;
};

type DialogPage = {
  documentElement: { classList: ClassList };
  body: { classList: ClassList };
};

type Dialog = {
  showModal(): void;
};

export type FocusTarget = {
  focus(): void;
  isConnected?: boolean;
};

export function closeDisclosure(disclosure: Disclosure | null) {
  if (disclosure) disclosure.open = false;
}

export function beginDialogSession(
  dialog: Dialog,
  page: DialogPage,
  trigger: FocusTarget | null | undefined,
  activeElement: FocusTarget | null,
) {
  const returnTarget = trigger ?? activeElement;
  page.documentElement.classList.add("dialog-open");
  page.body.classList.add("dialog-open");

  try {
    dialog.showModal();
  } catch (error) {
    page.documentElement.classList.remove("dialog-open");
    page.body.classList.remove("dialog-open");
    throw error;
  }

  return returnTarget;
}

export function finishDialogSession(
  page: DialogPage,
  returnTarget: FocusTarget | null,
) {
  page.documentElement.classList.remove("dialog-open");
  page.body.classList.remove("dialog-open");
  if (returnTarget?.isConnected !== false) returnTarget?.focus();
}

export function cancelDialog(
  event: { preventDefault(): void },
  close: () => void,
  canClose = true,
) {
  event.preventDefault();
  if (canClose) close();
}
