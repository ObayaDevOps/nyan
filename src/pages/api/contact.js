import nodemailer from "nodemailer"

//make this a promise: https://stackoverflow.com/questions/60684227/api-resolved-without-sending-a-response-in-nextjs
export default async (req, res) => {
  const { EventName, EventDate, EventTime, EventLink, Name, Email, PhoneNumber } = req.body;
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });
const data={ from: Email,
    to: process.env.RECIPIENT_ADDRESS,
    subject: `Nekosero Event - ${EventName} - New Registered Interest!`,
      html: `
      <p>You have a person registering interest for your event!</p><br>
      <p>Please get in contact with them as soon as possible!</p><br>

        <p>Here are the details:</p><br>

        <p><strong>Event Name: </strong> ${EventName}</p><br>
        <p><strong>Event Date: </strong> ${EventDate}</p><br>
        <p><strong>Event Time: </strong> ${EventTime}</p><br>
        <p><strong>Interested Person Name: </strong> ${Name}</p><br>
        <p><strong>Interested Person Email: </strong> ${Email}</p><br>
        <p><strong>Interested Person Phone Number: </strong> ${PhoneNumber}</p><br>
      `}

      transporter.sendMail(data, function (err, info) {
        if(err){
            console.log(err)
            console.log("DID NOT SEND !")

        }
        else
        console.log("INFO SEND !") // at this point, tell the user message has successfully sent
        //toast
        //chakra tenplate modal ?

          console.log(info)
          res.send("success!!")
      })
};