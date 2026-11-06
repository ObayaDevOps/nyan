import { safeUrl } from "./navigation.mjs";
export class InputError extends Error {
  constructor(errors) {
    super("Please check the form fields.");
    this.errors = errors;
  }
}
export function validateSubmission(body) {
  const errors = {},
    data = {};
  if (!body || Array.isArray(body) || !["event", "rental"].includes(body.type))
    throw new InputError({ type: "Invalid submission type" });
  const fields = {
    name: 120,
    email: 254,
    phone: 40,
    submissionId: 80,
    ...(body.type === "event"
      ? { eventId: 200 }
      : {
          businessName: 120,
          website: 2048,
          budget: 30,
          floorArea: 30,
          referral: 200,
          extra: 4000,
        }),
  };
  for (const [key, max] of Object.entries(fields)) {
    const v =
      body[key] ?? (["referral", "extra"].includes(key) ? "" : undefined);
    if (
      typeof v !== "string" ||
      v.length > max ||
      /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(v)
    )
      errors[key] = "Invalid value";
    else data[key] = v.trim();
    if (!["referral", "extra"].includes(key) && !data[key])
      errors[key] = "This field is required";
  }
  if (!/^[^\s@\r\n]+@[^\s@\r\n]+\.[^\s@\r\n]+$/.test(data.email || ""))
    errors.email = "Enter a valid email";
  if (!/^[+\d ()-]{7,40}$/.test(data.phone || ""))
    errors.phone = "Enter a valid phone number";
  if (!/^[a-zA-Z0-9_-]{16,80}$/.test(data.submissionId || ""))
    errors.submissionId = "Refresh the form and try again";
  if (body.type === "rental") {
    if (!safeUrl(data.website))
      errors.website = "Enter a complete HTTP or HTTPS URL";
    for (const k of ["budget", "floorArea"])
      if (
        !Number.isFinite(Number(data[k])) ||
        Number(data[k]) <= 0 ||
        Number(data[k]) > 1e12
      )
        errors[k] = "Enter a positive number";
  }
  if (Object.keys(errors).length) throw new InputError(errors);
  return { ...data, type: body.type };
}
