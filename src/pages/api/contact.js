import nodemailer from "nodemailer"

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { SMTP_USER, SMTP_PASSWORD, RECIPIENT_ADDRESS } = process.env;
  if (!SMTP_USER || !SMTP_PASSWORD || !RECIPIENT_ADDRESS) {
    return res.status(500).json({ error: 'Email service is not configured' });
  }

  const {
    EventName,
    EventDate,
    EventTime,
    EventLink,
    Name,
    Email,
    PhoneNumber,
    BusinessName,
    BusinessWebsiteOrSocials,
    RentalBudget,
    FloorArea,
    ClientName,
    ClientEmail,
    ClientPhoneNumber,
    FindOut,
    ExtraInfo,
  } = req.body || {};

  const isRentalSubmission = Boolean(BusinessName || ClientName || ClientEmail || ClientPhoneNumber);
  const isEventSubmission = Boolean(EventName || Name || Email || PhoneNumber);

  if (!isRentalSubmission && !isEventSubmission) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD
    }
  });

  let mailOptions;

  if (isRentalSubmission) {
    if (!BusinessName || !BusinessWebsiteOrSocials || !RentalBudget || !FloorArea || !ClientName || !ClientEmail || !ClientPhoneNumber) {
      return res.status(400).json({ error: 'Missing required rental form fields' });
    }

    mailOptions = {
      from: SMTP_USER,
      to: RECIPIENT_ADDRESS,
      replyTo: ClientEmail,
      subject: 'Nekosero - New Rental Interest!',
      html: `
        <p>You have a person registering interest for rental space at Nekosero.</p>
        <p>Please get in contact with them as soon as possible.</p>
        <p><strong>Business Name:</strong> ${BusinessName}</p>
        <p><strong>Business Website or Socials:</strong> ${BusinessWebsiteOrSocials}</p>
        <p><strong>Monthly Rental Budget (UGX):</strong> ${RentalBudget}</p>
        <p><strong>Requested Floor Area (Square Meters):</strong> ${FloorArea}</p>
        <p><strong>Interested Person Name:</strong> ${ClientName}</p>
        <p><strong>Interested Person Email:</strong> ${ClientEmail}</p>
        <p><strong>Interested Person Phone Number:</strong> ${ClientPhoneNumber}</p>
        <p><strong>How did they find out about us? (optional):</strong> ${FindOut || 'N/A'}</p>
        <p><strong>Extra Information (optional):</strong> ${ExtraInfo || 'N/A'}</p>
      `
    };
  } else {
    if (!EventName || !Name || !Email || !PhoneNumber) {
      return res.status(400).json({ error: 'Missing required event form fields' });
    }

    mailOptions = {
      from: SMTP_USER,
      to: RECIPIENT_ADDRESS,
      replyTo: Email,
      subject: `Nekosero - New Event Interest: ${EventName}`,
      html: `
        <p>You have a person registering interest in an event at Nekosero.</p>
        <p><strong>Event Name:</strong> ${EventName}</p>
        <p><strong>Event Date:</strong> ${EventDate || 'N/A'}</p>
        <p><strong>Event Time:</strong> ${EventTime || 'N/A'}</p>
        <p><strong>Event Link:</strong> ${EventLink || 'N/A'}</p>
        <p><strong>Name:</strong> ${Name}</p>
        <p><strong>Email:</strong> ${Email}</p>
        <p><strong>Phone Number:</strong> ${PhoneNumber}</p>
      `
    };
  }

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Failed to send contact email:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
