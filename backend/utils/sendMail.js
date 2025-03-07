require("dotenv").config();
const nodemailer = require("nodemailer");

const sendMail = async (options) => {
    try {
        console.log("✅ Vérification des variables d'environnement :");
        console.log("SMTP_HOST :", process.env.SMTP_HOST);
        console.log("SMTP_PORT :", process.env.SMTP_PORT);
        console.log("SMTP_MAIL :", process.env.SMTP_MAIL);
        console.log("SMTP_PASSWORD :", process.env.SMTP_PASSWORD ? "✅ Chargé" : "❌ Manquant !");

        if (!process.env.SMTP_HOST || !process.env.SMTP_MAIL || !process.env.SMTP_PASSWORD) {
            throw new Error("❌ Vérifie les variables SMTP dans .env !");
        }

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT || 587,
            secure: false, // STARTTLS (port 587)
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        const mailOptions = {
            from: `"Support" <${process.env.SMTP_MAIL}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: `<p>${options.message}</p>`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email envoyé à ${options.email} : ${info.response}`);
        return info;
    } catch (error) {
        console.error("❌ Erreur lors de l'envoi de l'email :", error.message);
        throw new Error(error);
    }
};

module.exports = sendMail;
