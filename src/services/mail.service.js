import nodemailer from "nodemailer";
import handlebars from "handlebars";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Recreate __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Create the Nodemailer transporter using your .env variables (if not defined, it will return null and the email will not be sent)
const transporter = process.env.SMTP_HOST
	? nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: process.env.SMTP_PORT,
			secure: process.env.SMTP_PORT === "465", // true for 465, false for 587 or other ports
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASS,
			},
		})
	: null;

/**
 * Send an email using a Handlebars template
 * @param {string} to - The recipient's email address
 * @param {string} subject - The subject of the email
 * @param {string} templateName - The name of the Handlebars file without extension (e.g., 'welcome')
 * @param {Object} context - Data to inject into the Handlebars template
 */
export const sendTemplatedEmail = async (
	to,
	subject,
	templateName,
	context = {},
) => {
	if (!transporter) {
		console.warn("Mail service not configured. Skipping email.");
		return;
	}
	try {
		// 2. Build the absolute path to your Handlebars template
		const templatePath = path.join(
			__dirname,
			"..",
			"templates",
			`${templateName}.hbs`,
		);

		// 3. Read the template file asynchronously
		const templateSource = await fs.readFile(templatePath, "utf8");

		// 4. Compile the template using Handlebars
		const compiledTemplate = handlebars.compile(templateSource);

		// 5. Generate the HTML by passing the data context
		const renderedHtml = compiledTemplate({
			...context,
			subject, // optionally pass the subject down so the <title> can use it
		});

		// 6. Send the email containing the compiled HTML
		const info = await transporter.sendMail({
			from:
				process.env.SMTP_FROM ||
				'"Checkmate API" <noreply@checkmate.api>',
			to,
			subject,
			html: renderedHtml,
		});

		console.log(`Email sent successfully: ${info.messageId}`);
		return info;
	} catch (error) {
		console.error(`Failed to send email to ${to}:`, error);
		throw new Error("Mail sending service failed");
	}
};