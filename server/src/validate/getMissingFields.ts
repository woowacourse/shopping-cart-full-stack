export const getMissingFields = (
  request: Record<string, unknown>,
  requiredFields: string[],
) => {
  const missingFields = requiredFields.filter(
    (field) => request[field] === undefined,
  );

  return missingFields;
};
