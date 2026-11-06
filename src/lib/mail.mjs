// Staff delivery is authoritative. Confirmation failure must not invite a duplicate inquiry.
export async function deliverInquiry(send) {
  await send("staff");
  try {
    await send("confirmation");
    return {
      message:
        "Thank you. Your interest was received and a confirmation is on its way.",
    };
  } catch {
    return {
      message:
        "Your interest was received. The confirmation email could not be sent.",
    };
  }
}
