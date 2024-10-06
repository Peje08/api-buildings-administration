exports.recoveryMail = (resetUrl, userName) => `
    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
        <div style="padding: 20px; text-align: center;">
        <!-- LOGO -->
        <img src="https://res.cloudinary.com/dt6qx0vkb/image/upload/v1728251101/cabildo_logo_vsawtg.jpg" alt="Logo de la App" style="max-width: 150px; margin-bottom: 20px;" />

        <!-- TITLE -->
        <h2 style="color: #333; font-size: 24px; margin-bottom: 20px;">Solicitud de restablecimiento de contraseña</h2>

        <!-- MESSAGE -->
        <p style="font-size: 16px; color: #666;">Hola ${userName},</p>
        <p style="font-size: 16px; color: #666;">Has solicitado restablecer tu contraseña. Por favor, haz clic en el botón de abajo para restablecerla:</p>

        <!-- BUTTON -->
        <div style="text-align: center; margin: 20px 0;">
            <a href="${resetUrl}" style="background-color: #007BFF; color: white; padding: 15px 30px; font-size: 16px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Restablecer contraseña
            </a>
        </div>

        <!-- ALTERNATIVE URL -->
        <p style="font-size: 14px; color: #999;">O copia y pega este enlace en tu navegador:</p>
        <p style="font-size: 14px; color: #007BFF; word-break: break-all;">
            <a href="${resetUrl}" style="color: #007BFF; text-decoration: none;">${resetUrl}</a>
        </p>

        <!-- FOOTER -->
        <p style="font-size: 14px; color: #999; margin-top: 40px;">Si no solicitaste este cambio, por favor ignora este correo y tu contraseña permanecerá sin cambios.</p>
        <p style="font-size: 14px; color: #999;">Saludos cordiales,<br/>Codexar Latam</p>
        </div>
    </div>
    </div>
`
