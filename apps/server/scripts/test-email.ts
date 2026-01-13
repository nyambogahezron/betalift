import nodemailer from 'nodemailer';
import ENV from '../src/config/env';

const testEmail = async () => {
    console.log('Starting email test...');
    console.log(`SMTP Host: ${ENV.smtpHost}`);
    console.log(`SMTP Port: ${ENV.smtpPort}`);
    console.log(`SMTP User: ${ENV.smtpUser ? '***' : 'Not set'}`);

    const transporter = nodemailer.createTransport({
        host: ENV.smtpHost,
        port: ENV.smtpPort,
        secure: ENV.smtpSecure,
        auth: {
            user: ENV.smtpUser,
            pass: ENV.smtpPassword,
        },
    });

    try {
        console.log('Verifying connection...');
        await transporter.verify();
        console.log('Connection verified successfully');

        const testRecipient = process.argv[2] || ENV.emailFrom;
        if (!testRecipient) {
            console.error('No recipient provided and no EMAIL_FROM set.');
            process.exit(1);
        }

        console.log(`Sending test email to: ${testRecipient}`);
        const info = await transporter.sendMail({
            from: ENV.emailFrom,
            to: testRecipient,
            subject: 'BetaLift SMTP Test',
            html: '<h1>SMTP Test</h1><p>This is a test email from your BetaLift server to verify SMTP configuration.</p>',
        });

        console.log(`Email sent successfully! Message ID: ${info.messageId}`);
    } catch (error) {
        console.error('Error during email test:', error);
        process.exit(1);
    }
};

testEmail();
