// Redux helpers

// Generates a redux action with type only (no payload)
export function emptyActionGenerator(type) {
  return () => ({ type });
}

// Geneates a redux action with type and payload
export function payloadActionGenerator(type) {
  return payload => ({ type, payload });
}
