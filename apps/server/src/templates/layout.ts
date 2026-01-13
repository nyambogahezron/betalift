import ENV from "../config/env";
import { colors, styles } from "./styles";

interface LayoutOptions {
	title?: string;
	previewText?: string;
}

export const baseLayout = (content: string, options: LayoutOptions = {}): string => {
	const { title = "Betalift", previewText = "Notification from Betalift" } = options;

	return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
            /* Reset styles */
            body, p, h1, h2, h3, h4, h5, h6 { margin: 0; padding: 0; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
            table { border-collapse: collapse; width: 100%; }
            
            /* Client-specific styles */
            .btn:hover { background-color: ${colors.primaryHover} !important; }
        </style>
    </head>
    <body style="${styles.body}">
        <!-- Preview Text -->
        <div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">
            ${previewText}
        </div>

        <div style="${styles.container}">
            <!-- Header -->
            <div style="${styles.header}">
                <img src="${ENV.serverUrl}/public/assets/logo.png" alt="BetaLift" style="max-width: 150px; height: auto;">
            </div>

            <!-- Content -->
            <div style="${styles.content}">
                ${content}
            </div>

            <!-- Footer -->
            <div style="${styles.footer}">
                <p style="margin-bottom: 12px;">&copy; ${new Date().getFullYear()} BetaLift. All rights reserved.</p>
                <div style="margin-bottom: 12px;">
                    <a href="#" style="${styles.link}; margin: 0 8px;">Help Center</a> |
                    <a href="#" style="${styles.link}; margin: 0 8px;">Privacy Policy</a> |
                    <a href="#" style="${styles.link}; margin: 0 8px;">Terms of Service</a>
                </div>
                <p>This email was sent to you because you have an account on BetaLift.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};
