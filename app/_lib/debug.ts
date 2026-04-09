const DEBUG_TRUE_VALUES = new Set(["1", "true", "yes", "on"]);

export function isDebugEnabled() {
  // Keep debug parsing tolerant so teams can use common env styles across hosts.
  const rawValue = process.env.NEXT_PUBLIC_DEBUG?.trim().toLowerCase();

  return rawValue ? DEBUG_TRUE_VALUES.has(rawValue) : false;
}
