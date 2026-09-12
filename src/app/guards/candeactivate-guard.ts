import { CanDeactivateFn } from '@angular/router';

export interface CanDeactivateComponent {
  hasUnsavedChanges: () => boolean;
}

export const candeactivateGuard: CanDeactivateFn<CanDeactivateComponent> = (component) => {
  if (!component.hasUnsavedChanges()) {
    return true;
  }

  return window.confirm('You have unsaved employee changes. Do you want to leave this page?');
};
