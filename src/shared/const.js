import { range } from '@/shared/utils';

/**
 * Globally available settings that can be used for
 * validation, style settings, and general uniformity.
 * Match up to list variables in Bootstrap 4's.
 */

// Breakpoints that match up to Bootstrap's
export const MICO_BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};

export const MICO_DISPLAYS = [
  'none',
  'inline',
  'inline-block',
  'block',
  'table',
  'table-row',
  'table-cell',
  'flex',
  'inline-flex',
];
export const MICO_OVERFLOWS = ['auto', 'hidden'];
export const MICO_POSITIONS = ['static', 'relative', 'absolute', 'fixed', 'sticky'];

/** Create classes like `form-control-sm`. */
export const MICO_COMPONENT_SIZES = ['sm', 'lg'];

/** Create utility classes like `shadow-none`. */
export const MICO_UI_UTILITY_SIZES = ['none', 'sm', 'lg'];

/** Create responsive classes like `col-sm` and `row-md`. */
export const MICO_BREAKPOINT_SIZES = ['xs', 'sm', 'md', 'lg'];

/** Create classes like `col-sm-7`. */
export const MICO_GRID_COLUMN_SIZES = range(1, 12);

/**
 * Create utility classes that use values from the `$spacers`
 * variable list, like `mb-2`, `px-4`, etc.
 */
export const MICO_SPACER_SIZES = range(5);

/** Create classes like `btn-primary`, `bg-danger`, etc. */
export const MICO_VARIANTS = [
  'primary',
  'secondary',
  'accent',
  'success',
  'info',
  'warning',
  'danger',
  'light',
  'dark',
];

export const MICO_YIQ_VARIANTS = ['light', 'warning'];

/**
 * Framework-specific constants.
 */

/** Theming options for the admin dashboard. */
export const MICO_THEME_OPTIONS = ['dark', 'light', 'primary'];

/** Inline element sizes (for icons). */
export const MICO_INLINE_SIZES = ['12', '14', '16', '18', '24', '32', '40', '48', '64', '72'];

/** `type` attribute options for INPUT element. */
export const MICO_INPUT_TYPES = [
  'color',
  'date',
  'email',
  'file',
  'hidden',
  'text',
  'number',
  'password',
  'range',
  'search',
  'tel',
  'text',
  'time',
  'url',
];

/** UI display styles for the expansion-panel component. */
export const MICO_EXPANSION_PANEL_TYPES = ['border', 'default', 'margin', 'shadow'];

/** Input type options for toggleable form controls. */
export const MICO_TOGGLE_INPUTS = ['checkbox', 'radio'];
