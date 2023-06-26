package com.peterfonkel.webMagazine.login.email;
import java.util.Properties;
import javax.mail.*;
import javax.mail.internet.*;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.peterfonkel.webMagazine.ClaseConfiguracionJava;

@Component
public class EmailSender {
	
	@Value("${correo.remitente}")
	private String username;
	
	@Value("${password.email}")
	private String password;
	
    private final Session session;

    public EmailSender() {
    	
       
        // Configuración de las propiedades del servidor de correo
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.office365.com");
        props.put("mail.smtp.port", "587");
        props.put("mail.smtp.ssl.protocols: TLSv1.2", "mail.smtp.ssl.ciphersuites: TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256");

        // Crear la sesión de correo
        session = Session.getInstance(props, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });
    }

    public void sendEmail(String recipient, String subject, String content) {
        try {
        	System.out.println(recipient + "/" + subject + "/" + content + "/" + username + "/" + password);
            // Crear el mensaje de correo
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(username)); // Remitente
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(recipient)); // Destinatario
            message.setSubject(subject); // Asunto del correo
            message.setText(content); // Contenido del correo

            // Enviar el mensaje de correo
            Transport.send(message);

            System.out.println("El correo electrónico ha sido enviado con éxito.");
        } catch (MessagingException e) {
            System.out.println("Error al enviar el correo electrónico: " + e.getMessage());
        }
    }
}
