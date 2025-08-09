import { inngest } from "../index.js";
import User from "../../models/user.js";
import { NonRetriableError } from "inngest";
import { sendEmail } from "../../utils/mailer.js";

export const onUserSignup = inngest.createFunction(
  {
    id: "on-user-signup",
    retries: 2,
  },
  { event: "user/signup" },
  async ({ event, step }) => {
    // registering an user
    try {
      const { email } = event.data;
      const userDetails = await step.run("get-user-email", async () => {
        const userObject = await User.findOne({ email });
        if (!userObject) {
          throw new NonRetriableError("User does not exist in Database");
        }

        return userObject;
      });

      await step.run("send-welcome-email", async () => {
        const subject = "Welcome to AI Ticket Assistant";
        const message = `Hi , welcome to AI Ticket Assistant! We're excited to have you on board.`;

        await sendEmail(userDetails.email, subject, message);
      });

      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  }
);
