package com.peterfonkel.webMagazine.login.email;

import java.util.Properties;
import javax.mail.*;
import javax.mail.internet.*;

import org.springframework.beans.factory.annotation.Value;



public class EmailSender {
	
	@Value("${correoAdmin}")
	String correoAdmin;
	
	@Value("${passwordGmailAdmin}")
	String passwordGmailAdmin;
	
	
	
    public boolean enviarEmail(String destinatario, String subject, String text) {
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");

        Session session = Session.getInstance(props, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(correoAdmin, passwordGmailAdmin);
            }
        });

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(correoAdmin));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(destinatario)); // Reemplaza con la dirección de correo electrónico del destinatario
            message.setSubject(subject);
            message.setText(text);

            Transport.send(message);

            System.out.println("El correo electrónico ha sido enviado con éxito.");
            return true;
        } catch (MessagingException e) {
            System.out.println("Error al enviar el correo electrónico: " + e.getMessage());
            return false;
        }
    }
}

