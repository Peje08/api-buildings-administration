exports.administrationNotificationMail = (adminName, streetAddress, numberAddress) => `
  <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
      <div style="padding: 20px; text-align: center;">
        <!-- LOGO -->
        <img src="https://res.cloudinary.com/dt6qx0vkb/image/upload/v1728251101/cabildo_logo_vsawtg.jpg" alt="Logo de la App" style="max-width: 150px; margin-bottom: 20px;" />
        
        <p style="font-size: 16px; color: #666;">¡Hola ${adminName}!</p>
        <p style="font-size: 16px; color: #666;">La información para tu domicilio ${streetAddress} ${numberAddress} fue cargada con éxito. Vamos a enviar los usuarios y contraseñas correspondientes a los mails que nos proporcionaste.</p>
        
        <p style="font-size: 16px; color: #666;">Por cualquier consulta, duda o reclamo, no dudes en escribirnos a <a href="mailto:codexar.latam@gmail.com">codexar.latam@gmail.com</a>.</p>
        
        <p style="font-size: 16px; color: #666;">¡Gracias!</p>
        <p style="font-size: 16px; color: #666;">Saludos, el equipo de Codexar.</p>
      </div>
    </div>
  </div>
`
