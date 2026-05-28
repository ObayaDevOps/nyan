import React from 'react';

const styles = {
  body: {
    margin: 0,
    padding: '24px',
    backgroundColor: '#f7f7f7',
    fontFamily: 'Arial, sans-serif',
    color: '#111111',
  },
  container: {
    maxWidth: '640px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e5e5',
    padding: '24px',
  },
  heading: {
    margin: '0 0 16px 0',
    fontSize: '20px',
  },
  text: {
    margin: '0 0 12px 0',
    lineHeight: 1.5,
    fontSize: '15px',
  },
  list: {
    margin: 0,
    padding: 0,
    listStyle: 'none',
  },
  listItem: {
    margin: '0 0 10px 0',
    fontSize: '15px',
  },
  label: {
    fontWeight: 700,
  },
  footer: {
    marginTop: '20px',
    color: '#666666',
    fontSize: '13px',
  },
};

const EmailLayout = ({ heading, intro, footer, children }) => (
  <div style={styles.body}>
    <div style={styles.container}>
      <h1 style={styles.heading}>{heading}</h1>
      {intro ? <p style={styles.text}>{intro}</p> : null}
      {children}
      {footer ? <p style={styles.footer}>{footer}</p> : null}
    </div>
  </div>
);

export const RentalNotificationEmail = ({ data }) => (
  <EmailLayout
    heading="New Rental Interest Submission"
    intro="A new rental interest form was submitted on the Nekosero site."
    footer="Nekosero Website Notifications"
  >
    <ul style={styles.list}>
      <li style={styles.listItem}><span style={styles.label}>Business Name:</span> {data.BusinessName}</li>
      <li style={styles.listItem}><span style={styles.label}>Business Website or Socials:</span> {data.BusinessWebsiteOrSocials}</li>
      <li style={styles.listItem}><span style={styles.label}>Monthly Rental Budget (UGX):</span> {data.RentalBudget}</li>
      <li style={styles.listItem}><span style={styles.label}>Requested Floor Area (Square Meters):</span> {data.FloorArea}</li>
      <li style={styles.listItem}><span style={styles.label}>Contact Name:</span> {data.ClientName}</li>
      <li style={styles.listItem}><span style={styles.label}>Contact Email:</span> {data.ClientEmail}</li>
      <li style={styles.listItem}><span style={styles.label}>Contact Phone:</span> {data.ClientPhoneNumber}</li>
      <li style={styles.listItem}><span style={styles.label}>How They Found Us:</span> {data.FindOut || 'N/A'}</li>
      <li style={styles.listItem}><span style={styles.label}>Extra Info:</span> {data.ExtraInfo || 'N/A'}</li>
    </ul>
  </EmailLayout>
);

export const RentalAutoConfirmationEmail = ({ data }) => (
  <EmailLayout
    heading="We Received Your Rental Interest"
    intro={`Hi ${data.ClientName}, thanks for your interest in renting at Nekosero.`}
    footer="Nekosero Team"
  >
    <p style={styles.text}>Our team will review your details and reach out soon.</p>
    <p style={styles.text}>Summary:</p>
    <ul style={styles.list}>
      <li style={styles.listItem}><span style={styles.label}>Business Name:</span> {data.BusinessName}</li>
      <li style={styles.listItem}><span style={styles.label}>Monthly Rental Budget (UGX):</span> {data.RentalBudget}</li>
      <li style={styles.listItem}><span style={styles.label}>Requested Floor Area (Square Meters):</span> {data.FloorArea}</li>
    </ul>
  </EmailLayout>
);

export const EventNotificationEmail = ({ data }) => (
  <EmailLayout
    heading="New Event Interest Submission"
    intro="A new event interest form was submitted on the Nekosero site."
    footer="Nekosero Website Notifications"
  >
    <ul style={styles.list}>
      <li style={styles.listItem}><span style={styles.label}>Event Name:</span> {data.EventName}</li>
      <li style={styles.listItem}><span style={styles.label}>Event Date:</span> {data.EventDate || 'N/A'}</li>
      <li style={styles.listItem}><span style={styles.label}>Event Time:</span> {data.EventTime || 'N/A'}</li>
      <li style={styles.listItem}><span style={styles.label}>Event Link:</span> {data.EventLink || 'N/A'}</li>
      <li style={styles.listItem}><span style={styles.label}>Name:</span> {data.Name}</li>
      <li style={styles.listItem}><span style={styles.label}>Email:</span> {data.Email}</li>
      <li style={styles.listItem}><span style={styles.label}>Phone Number:</span> {data.PhoneNumber}</li>
    </ul>
  </EmailLayout>
);

export const EventAutoConfirmationEmail = ({ data }) => (
  <EmailLayout
    heading="We Received Your Event Interest"
    intro={`Hi ${data.Name}, thanks for registering your interest in ${data.EventName}.`}
    footer="Nekosero Team"
  >
    <p style={styles.text}>We will contact you with next steps shortly.</p>
    <p style={styles.text}>Summary:</p>
    <ul style={styles.list}>
      <li style={styles.listItem}><span style={styles.label}>Event Name:</span> {data.EventName}</li>
      <li style={styles.listItem}><span style={styles.label}>Event Date:</span> {data.EventDate || 'N/A'}</li>
      <li style={styles.listItem}><span style={styles.label}>Event Time:</span> {data.EventTime || 'N/A'}</li>
    </ul>
  </EmailLayout>
);
