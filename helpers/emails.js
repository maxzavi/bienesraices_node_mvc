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

            <p>Si tu no creaste esta cuenta, ignora este mensaje</p>
        `
    })
}

const emailResetPassword = async (data)=>{
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
        subject: 'Restablece tu password en Bienes Raices',
        text: 'Restablece tu password en Bienes Raices',
        html: `
            <p>Hola ${data.name}, haz solicitado restablecer tu password en BienesRaices.com</p>

            <p>Para restablecer tu password haz click en  el siguiente enlace
            <a href="${process.env.HOST_URL}:${process.env.port ?? 3000}/user/recovery-password/${data.token}">Restablecer password</a>
            </p>

            <p>Si tu no solicitaste restablecer tu password, ignora este mensaje</p>

        `
    })
}

export {
    emailRegister,
    emailResetPassword
}