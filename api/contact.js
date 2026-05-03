module.exports = async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({
            ok: false,
            errorKey: "contact.form.feedback.submit_error"
        });
    }

    let body = req.body ?? {};

    if (typeof body === "string") {
        try {
            body = JSON.parse(body);
        } catch {
            return res.status(400).json({
                ok: false,
                errorKey: "contact.form.feedback.submit_error"
            });
        }
    }

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const message = String(body.message ?? "").trim();

    if (name === "") {
        return res.status(400).json({
            ok: false,
            errorKey: "contact.form.feedback.name_required"
        });
    }

    if (email === "") {
        return res.status(400).json({
            ok: false,
            errorKey: "contact.form.feedback.email_required"
        });
    }

    if (!email.includes("@") || !email.includes(".")) {
        return res.status(400).json({
            ok: false,
            errorKey: "contact.form.feedback.email_invalid"
        });
    }

    if (message === "") {
        return res.status(400).json({
            ok: false,
            errorKey: "contact.form.feedback.message_required"
        });
    }

    const apiKey = process.env.MAILGUN_API_KEY;
    const domain = process.env.MAILGUN_DOMAIN;
    const toEmail = process.env.CONTACT_TO_EMAIL;
    const fromEmail = process.env.CONTACT_FROM_EMAIL;

    if (!apiKey || !domain || !toEmail || !fromEmail) {
        return res.status(500).json({
            ok: false,
            errorKey: "contact.form.feedback.submit_error"
        });
    }

    const formData = new FormData();
    formData.append("from", fromEmail);
    formData.append("to", toEmail);
    formData.append("subject", `Portfolio contact from ${name}`);
    formData.append(
        "text",
        [
            "New portfolio contact request",
            "",
            `Name: ${name}`,
            `Email: ${email}`,
            "",
            "Message:",
            message
        ].join("\n")
    );
    formData.append("h:Reply-To", `${name} <${email}>`);

    try {
        const authToken = Buffer.from(`api:${apiKey}`).toString("base64");
        const mailgunResponse = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
            method: "POST",
            headers: {
                Authorization: `Basic ${authToken}`
            },
            body: formData
        });

        if (!mailgunResponse.ok) {
            const errorText = await mailgunResponse.text().catch(() => "");
            console.error("Mailgun send failed:", mailgunResponse.status, errorText);

            return res.status(502).json({
                ok: false,
                errorKey: "contact.form.feedback.submit_error"
            });
        }
    } catch (error) {
        console.error("Mailgun request error:", error);
        return res.status(502).json({
            ok: false,
            errorKey: "contact.form.feedback.submit_error"
        });
    }

    return res.status(200).json({
        ok: true,
        messageKey: "contact.form.feedback.submit_success",
        data: {
            name,
            email,
            messageLength: message.length
        }
    });
};
