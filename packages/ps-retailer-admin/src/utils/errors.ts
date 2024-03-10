export type ErrorStatus =
  | 400
  | 401
  | 403
  | 404
  | 405
  | 406
  | 409
  | 410
  | 413
  | 414
  | 415
  | 422
  | 429;

export const ERROR_STATUS_DICTIONARY: Partial<Record<ErrorStatus, string>> = {
  400: 'Server error'
};
