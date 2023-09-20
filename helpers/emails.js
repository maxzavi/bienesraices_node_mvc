import nodemailer from 'nodemailer'

const emailRegister = async (data)=>{
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PAASSWORD
        }
      });
    await transport.sendMail({
        from:'admin@bienesraices.com',
        to: data.email,
        subject: 'Confirma tu cuenta en Bienes Raices',
        text: 'Confirma tu cuenta en Bienes Raices',
        html: `
            <p>Hola ${data.name}, comprueba tu cuenta en BienesRaices.com</p>

            <p>Tu cuenta está lista, solo debes confirmar en el siguiente enlace
            <a href="${process.env.HOST_URL}:${process.env.port ?? 3000}/user/confirm/${data.token}">Confirma cuenta</a>
            </p>

            <p>Si tu no createst esta cuenta, ignora este mensaje</p>
        `
    })
}

export {
    emailRegister
}