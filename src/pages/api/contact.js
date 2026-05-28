import { Resend } from 'resend';
import {
  EventAutoConfirmationEmail,
  EventNotificationEmail,
  RentalAutoConfirmationEmail,
  RentalNotificationEmail,
} from '../../components/emails/contactEmailTemplates';

const TEST_RECIPIENT = 'obayadralega18@gmail.com';
const DEFAULT_FROM_ADDRESS = 'Nekosero <forms@nekosero.ug>';

const sendWithResend = async (resend, payload) => {
  const response = await resend.emails.send(payload);
  if (response.error) {
    throw new Error(response.error.message || JSON.stringify(response.error) || 'Failed to send email');
  }
  return response;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { RESEND_API_KEY, RESEND_FROM } = process.env;
  const resendFrom = RESEND_FROM || DEFAULT_FROM_ADDRESS;
  const recipientAddresses = (process.env.RECIPIENT_ADDRESS || TEST_RECIPIENT)
    .split(',')
    .map((email) => email.trim())
    .filter(Boolean);

  if (!RESEND_API_KEY) {
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

  const resend = new Resend(RESEND_API_KEY);

  if (isRentalSubmission) {
    if (!BusinessName || !BusinessWebsiteOrSocials || !RentalBudget || !FloorArea || !ClientName || !ClientEmail || !ClientPhoneNumber) {
      return res.status(400).json({ error: 'Missing required rental form fields' });
    }

    const rentalData = {
      BusinessName,
      BusinessWebsiteOrSocials,
      RentalBudget,
      FloorArea,
      ClientName,
      ClientEmail,
      ClientPhoneNumber,
      FindOut,
      ExtraInfo,
    };

    try {
      await sendWithResend(resend, {
        from: resendFrom,
        to: recipientAddresses,
        subject: 'Nekosero - New Rental Interest!',
        replyTo: ClientEmail,
        react: <RentalNotificationEmail data={rentalData} />,
      });

      try {
        await sendWithResend(resend, {
          from: resendFrom,
          to: [ClientEmail],
          subject: 'Nekosero - We Received Your Rental Interest',
          react: <RentalAutoConfirmationEmail data={rentalData} />,
        });
      } catch (error) {
        console.error('Rental auto-confirmation failed:', error);
        return res.status(200).json({
          message: 'Rental interest received, but auto-confirmation failed.',
        });
      }

      return res.status(200).json({ message: 'Rental interest email sent successfully' });
    } catch (error) {
      console.error('Failed to send rental interest email:', error);
      return res.status(500).json({ error: 'Failed to send rental emails' });
    }
  }

  if (!EventName || !Name || !Email || !PhoneNumber) {
    return res.status(400).json({ error: 'Missing required event form fields' });
  }

  const eventData = {
    EventName,
    EventDate,
    EventTime,
    EventLink,
    Name,
    Email,
    PhoneNumber,
  };

  try {
    await sendWithResend(resend, {
      from: resendFrom,
      to: recipientAddresses,
      subject: `Nekosero - New Event Interest: ${EventName}`,
      replyTo: Email,
      react: <EventNotificationEmail data={eventData} />,
    });

    try {
      await sendWithResend(resend, {
        from: resendFrom,
        to: [Email],
        subject: `Nekosero - We Received Your Interest in ${EventName}`,
        react: <EventAutoConfirmationEmail data={eventData} />,
      });
    } catch (error) {
      console.error('Event auto-confirmation failed:', error);
      return res.status(200).json({
        message: 'Event interest received, but auto-confirmation failed.',
      });
    }

    return res.status(200).json({ message: 'Event interest email sent successfully' });
  } catch (error) {
    console.error('Failed to send event interest email:', error);
    return res.status(500).json({ error: 'Failed to send event emails' });
  }
}
