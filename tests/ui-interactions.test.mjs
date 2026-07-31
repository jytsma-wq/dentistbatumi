import assert from "node:assert/strict";
import test from "node:test";

import {
  beginDialogSession,
  cancelDialog,
  closeDisclosure,
  finishDialogSession,
} from "../app/components/ui-interactions.ts";

test("closing a mobile navigation disclosure clears its open state", () => {
  const disclosure = { open: true };

  closeDisclosure(disclosure);

  assert.equal(disclosure.open, false);
});

test("opening a dialog locks page scrolling and remembers its trigger", () => {
  const rootClasses = new Set();
  const bodyClasses = new Set();
  const page = {
    documentElement: {
      classList: {
        add: (name) => rootClasses.add(name),
        remove: (name) => rootClasses.delete(name),
      },
    },
    body: {
      classList: {
        add: (name) => bodyClasses.add(name),
        remove: (name) => bodyClasses.delete(name),
      },
    },
  };
  let modalOpenCount = 0;
  const dialog = {
    showModal: () => {
      modalOpenCount += 1;
    },
  };
  const trigger = { focus() {} };
  const activeElement = { focus() {} };

  const returnTarget = beginDialogSession(
    dialog,
    page,
    trigger,
    activeElement,
  );

  assert.equal(returnTarget, trigger);
  assert.equal(modalOpenCount, 1);
  assert.equal(rootClasses.has("dialog-open"), true);
  assert.equal(bodyClasses.has("dialog-open"), true);
});

test("closing a dialog unlocks the page and restores trigger focus", () => {
  const rootClasses = new Set(["dialog-open"]);
  const bodyClasses = new Set(["dialog-open"]);
  const page = {
    documentElement: {
      classList: {
        add: (name) => rootClasses.add(name),
        remove: (name) => rootClasses.delete(name),
      },
    },
    body: {
      classList: {
        add: (name) => bodyClasses.add(name),
        remove: (name) => bodyClasses.delete(name),
      },
    },
  };
  let focusCount = 0;
  const trigger = {
    isConnected: true,
    focus: () => {
      focusCount += 1;
    },
  };

  finishDialogSession(page, trigger);

  assert.equal(rootClasses.has("dialog-open"), false);
  assert.equal(bodyClasses.has("dialog-open"), false);
  assert.equal(focusCount, 1);
});

test("a cancellable dialog handles Escape by closing explicitly", () => {
  let prevented = false;
  let closeCount = 0;

  cancelDialog(
    {
      preventDefault: () => {
        prevented = true;
      },
    },
    () => {
      closeCount += 1;
    },
  );

  assert.equal(prevented, true);
  assert.equal(closeCount, 1);
});
