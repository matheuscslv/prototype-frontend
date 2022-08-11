export default function getValidationErrors(err: any) {
  const validationErrors: any = {};

  err.inner.forEach((error: any) => {
    validationErrors[error.path] = error.message;
  });

  return validationErrors;
}
