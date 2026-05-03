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
