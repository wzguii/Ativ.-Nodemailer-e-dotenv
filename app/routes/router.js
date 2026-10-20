const express = require("express");
const { body, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
 
const router = express.Router();
 
router.get("/contato", (req, res) => {
    res.render("pages/contato", {
        erros: [],
        dados: {}
    });
});
 
router.post(
    "/contato",
    [
        body("nome")
            .trim()
            .notEmpty()
            .withMessage("Informe seu nome."),
 
        body("email")
            .trim()
            .isEmail()
            .withMessage("Informe um e-mail válido."),
 
        body("telefone")
            .trim()
            .notEmpty()
            .withMessage("Informe seu telefone."),
 
        body("assunto")
            .trim()
            .notEmpty()
            .withMessage("Informe o assunto."),
 
        body("mensagem")
            .trim()
            .notEmpty()
            .withMessage("Informe a mensagem.")
    ],
    async (req, res) => {
        const erros = validationResult(req);
 
        if (!erros.isEmpty()) {
            return res.status(400).render("pages/contato", {
                erros: erros.array(),
                dados: req.body
            });
        }
 
        const { nome, email, telefone, assunto, mensagem } = req.body;
 
        try {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });
 
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: process.env.EMAIL_USER,
                replyTo: email,
                subject: assunto,
                text: `
Nome: ${nome}
E-mail: ${email}
Telefone: ${telefone}
Assunto: ${assunto}
 
Mensagem:
${mensagem}
                `
            });
 
            return res.send("Mensagem enviada com sucesso!");
 
        } catch (erro) {
            console.error("Erro ao enviar e-mail:", erro.message);
 
            return res.status(500).send(
                "Não foi possível enviar a mensagem."
            );
        }
    }
);
 
module.exports = router;
 