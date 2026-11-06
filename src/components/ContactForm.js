import { useRef, useState } from "react";
const common = [
  ["name", "Name", "text"],
  ["email", "Email", "email"],
  ["phone", "Phone number", "tel"],
];
const rental = [
  ["businessName", "Business Name", "text"],
  ["website", "Business Website or Socials", "url"],
  ["budget", "Monthly Rental Budget (UGX)", "number"],
  ["floorArea", "Requested Floor Area (Square Meters)", "number"],
];
export default function ContactForm({ type, eventId }) {
  const isRental = type === "rental";
  const rentalCommon = [
    ["name", "Your Name", "text"],
    ["email", "Contact Email", "email"],
    ["phone", "Phone Number", "tel"],
  ];
  const [pending, setPending] = useState(false),
    [status, setStatus] = useState(""),
    [errors, setErrors] = useState({}),
    lock = useRef(false),
    id = useRef(null);
  async function submit(e) {
    e.preventDefault();
    if (lock.current) return;
    lock.current = true;
    setPending(true);
    setStatus("");
    setErrors({});
    const form = e.currentTarget;
    id.current ||= crypto.randomUUID();
    try {
      const body = {
        ...Object.fromEntries(new FormData(form)),
        type,
        eventId,
        submissionId: id.current,
      };
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      if (!response.ok) {
        setErrors(result.errors || {});
        throw new Error(result.error || "Please try again later.");
      }
      setStatus(result.message);
      form.reset();
      id.current = null;
    } catch (error) {
      setStatus(error.message);
    } finally {
      lock.current = false;
      setPending(false);
    }
  }
  return (
    <form
      className={`contact-form${isRental ? " rental-form" : ""}`}
      onSubmit={submit}
      onChange={() => {
        if (!lock.current) id.current = null;
      }}
    >
      <fieldset
        disabled={pending}
        style={{ border: 0, padding: 0, display: "contents" }}
      >
        {[
          ...(type === "rental" ? rental : []),
          ...(isRental ? rentalCommon : common),
          ...(type === "rental"
            ? [
                ["referral", "How did you find out about us?", "textarea"],
                [
                  "extra",
                  "Anything else you would like us to know?",
                  "textarea",
                ],
              ]
            : []),
        ].map(([key, label, kind]) => (
          <div key={key}>
            <label htmlFor={`${type}-${key}`}>
              {label}
              {isRental && !["referral", "extra"].includes(key) && (
                <span className="required-marker" aria-hidden="true">
                  *
                </span>
              )}
            </label>
            {kind === "textarea" ? (
              <textarea
                id={`${type}-${key}`}
                name={key}
                maxLength={key === "referral" ? 200 : 4000}
              />
            ) : (
              <input
                id={`${type}-${key}`}
                name={key}
                type={kind}
                required={key !== "referral"}
                maxLength={
                  key === "website"
                    ? 2048
                    : key === "email"
                      ? 254
                      : key === "phone"
                        ? 40
                        : 120
                }
                min={kind === "number" ? "0.01" : undefined}
                step={kind === "number" ? "any" : undefined}
                aria-invalid={!!errors[key]}
                aria-describedby={
                  errors[key] ? `${type}-${key}-error` : undefined
                }
              />
            )}
            {errors[key] && (
              <small id={`${type}-${key}-error`}>{errors[key]}</small>
            )}
          </div>
        ))}
        <div className="honeypot" aria-hidden="true">
          <label>
            Leave blank
            <input name="companyFax" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <button className="button" type="submit" disabled={pending}>
          {pending ? "Sending…" : isRental ? "Submit" : "Submit interest"}
        </button>
      </fieldset>
      {status && (
        <p className="status" role="status">
          {status}
        </p>
      )}
    </form>
  );
}
