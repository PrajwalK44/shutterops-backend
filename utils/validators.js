const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isValidUUID(value) {
  return typeof value === "string" && uuidRegex.test(value);
}

function ensureRequiredString(value, fieldName) {
  if (typeof value !== "string" || !value.trim()) {
    return `${fieldName} is required and must be a non-empty string.`;
  }

  return null;
}

module.exports = {
  isValidUUID,
  ensureRequiredString,
};
