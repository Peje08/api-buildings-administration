exports.activationMail = (userName, activationLink) => `
  <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
      <div style="padding: 20px; text-align: center;">
        <!-- LOGO -->
        <img src="https://res.cloudinary.com/dt6qx0vkb/image/upload/v1728251101/cabildo_logo_vsawtg.jpg" alt="Logo de la App" style="max-width: 150px; margin-bottom: 20px;" />

        <!-- TITLE -->
        <h2 style="color: #333; font-size: 24px; margin-bottom: 20px;">¡Activa tu cuenta en Cabildo!</h2>

        <!-- MESSAGE -->
        <p style="font-size: 16px; color: #666;">Hola ${userName},</p>
        <p style="font-size: 16px; color: #666;">Para activar tu cuenta, por favor haz clic en el siguiente enlace:</p>

        <!-- ACTIVATION BUTTON -->
        <div style="text-align: center; margin: 20px 0;">
          <a href="${activationLink}" style="background-color: #319795; color: white; padding: 15px 30px; font-size: 16px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Activar cuenta
          </a>
        </div>

        <p style="font-size: 14px; color: #999;">Si no solicitaste esta activación, puedes ignorar este mensaje.</p>
      </div>
    </div>
  </div>
`
