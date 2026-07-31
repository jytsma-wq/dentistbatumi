import type { SiteCopy } from "../content";

export function ActionDock({ copy }: { copy: SiteCopy }) {
  return (
    <nav className="action-dock" aria-label={copy.actions.quickActions}>
      <button className="dock-whatsapp" data-whatsapp type="button">
        <span className="wa-dot" aria-hidden="true">
          WA
        </span>
        <span>
          <small>{copy.actions.quickQuestion}</small>
          {copy.actions.whatsapp}
        </span>
      </button>
      <button className="dock-booking" data-booking type="button">
        <span className="calendar-dot" aria-hidden="true">
          21
        </span>
        <span>
          <small>{copy.actions.chooseMoment}</small>
          {copy.actions.appointment}
        </span>
      </button>
    </nav>
  );
}
