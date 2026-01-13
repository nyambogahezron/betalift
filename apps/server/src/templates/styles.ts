export const colors = {
	primary: "#007bff",
	primaryHover: "#0056b3",
	background: "#f4f4f4",
	containerBg: "#ffffff",
	text: "#333333",
	textLight: "#666666",
	border: "#e0e0e0",
	white: "#ffffff",
};

export const styles = {
	body: `
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: ${colors.background};
        margin: 0;
        padding: 0;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    `,
	container: `
        max-width: 600px;
        margin: 40px auto;
        background-color: ${colors.containerBg};
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        overflow: hidden;
    `,
	header: `
        background-color: ${colors.white};
        padding: 30px 40px;
        text-align: center;
        border-bottom: 1px solid ${colors.border};
    `,
	headerText: `
        color: ${colors.primary};
        font-size: 24px;
        font-weight: bold;
        margin: 0;
        letter-spacing: -0.5px;
    `,
	content: `
        padding: 40px;
        color: ${colors.text};
        line-height: 1.6;
        font-size: 16px;
    `,
	footer: `
        background-color: ${colors.background};
        padding: 24px;
        text-align: center;
        font-size: 13px;
        color: ${colors.textLight};
        border-top: 1px solid ${colors.border};
    `,
	button: `
        display: inline-block;
        padding: 14px 32px;
        background-color: ${colors.primary};
        color: ${colors.white} !important;
        text-decoration: none;
        border-radius: 6px;
        font-weight: 600;
        text-align: center;
        margin: 24px 0;
        transition: background-color 0.2s;
    `,
	link: `
        color: ${colors.primary};
        text-decoration: none;
    `,
	heading: `
        color: ${colors.text};
        margin-top: 0;
        margin-bottom: 24px;
        font-size: 22px;
        font-weight: 700;
    `,
	paragraph: `
        margin-bottom: 24px;
        margin-top: 0;
    `,
	codeBlock: `
        font-family: 'Courier New', Courier, monospace;
        font-size: 24px;
        letter-spacing: 4px;
        color: #333;
        text-align: center;
        background-color: #f4f4f4;
        padding: 16px;
        border-radius: 4px;
        margin: 24px 0;
        border: 1px dashed #ccc;
        cursor: text;
    `,
};
