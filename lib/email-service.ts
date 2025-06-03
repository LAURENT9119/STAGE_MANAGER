
import { createClient } from '@/lib/supabase/server';

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export class EmailService {
  private static async sendEmail(template: EmailTemplate): Promise<boolean> {
    try {
      // En production, utiliser un service comme Resend, SendGrid, etc.
      // Pour le développement, on log les emails
      console.log('Email envoyé:', {
        to: template.to,
        subject: template.subject,
        content: template.text
      });
      
      // Simulation d'envoi réussi
      return true;
    } catch (error) {
      console.error('Erreur envoi email:', error);
      return false;
    }
  }

  static async notifyRequestSubmitted(requestData: {
    internName: string;
    requestType: string;
    requestTitle: string;
    tutorEmail: string;
    hrEmail: string;
  }): Promise<void> {
    const subject = `Nouvelle demande: ${requestData.requestTitle}`;
    const content = `
      Bonjour,
      
      Une nouvelle demande a été soumise par ${requestData.internName}.
      
      Type: ${requestData.requestType}
      Titre: ${requestData.requestTitle}
      
      Veuillez vous connecter à la plateforme pour traiter cette demande.
      
      Cordialement,
      L'équipe RH
    `;

    // Notifier le tuteur
    await this.sendEmail({
      to: requestData.tutorEmail,
      subject,
      text: content,
      html: content.replace(/\n/g, '<br>')
    });

    // Notifier les RH
    await this.sendEmail({
      to: requestData.hrEmail,
      subject,
      text: content,
      html: content.replace(/\n/g, '<br>')
    });
  }

  static async notifyRequestStatusChange(data: {
    internEmail: string;
    internName: string;
    requestTitle: string;
    newStatus: string;
    comments?: string;
  }): Promise<void> {
    const statusMessages = {
      'tutor_review': 'en cours d\'examen par votre tuteur',
      'hr_review': 'en cours d\'examen par les RH',
      'finance_review': 'en cours d\'examen par le service finance',
      'approved': 'approuvée',
      'rejected': 'rejetée'
    };

    const subject = `Mise à jour de votre demande: ${data.requestTitle}`;
    const content = `
      Bonjour ${data.internName},
      
      Votre demande "${data.requestTitle}" est maintenant ${statusMessages[data.newStatus as keyof typeof statusMessages] || data.newStatus}.
      
      ${data.comments ? `Commentaires: ${data.comments}` : ''}
      
      Connectez-vous à la plateforme pour plus de détails.
      
      Cordialement,
      L'équipe RH
    `;

    await this.sendEmail({
      to: data.internEmail,
      subject,
      text: content,
      html: content.replace(/\n/g, '<br>')
    });
  }

  static async notifyEvaluationDue(data: {
    tutorEmail: string;
    tutorName: string;
    internName: string;
    dueDate: string;
  }): Promise<void> {
    const subject = `Évaluation à effectuer pour ${data.internName}`;
    const content = `
      Bonjour ${data.tutorName},
      
      Il est temps d'effectuer l'évaluation de votre stagiaire ${data.internName}.
      
      Date limite: ${data.dueDate}
      
      Connectez-vous à la plateforme pour compléter l'évaluation.
      
      Cordialement,
      L'équipe RH
    `;

    await this.sendEmail({
      to: data.tutorEmail,
      subject,
      text: content,
      html: content.replace(/\n/g, '<br>')
    });
  }

  static async notifyInternshipStart(data: {
    internEmail: string;
    internName: string;
    tutorName: string;
    startDate: string;
    department: string;
  }): Promise<void> {
    const subject = 'Bienvenue - Début de votre stage';
    const content = `
      Bonjour ${data.internName},
      
      Nous vous souhaitons la bienvenue pour votre stage qui commence le ${data.startDate}.
      
      Informations importantes:
      - Tuteur: ${data.tutorName}
      - Département: ${data.department}
      
      N'hésitez pas à vous connecter à la plateforme pour accéder à vos documents et soumettre vos demandes.
      
      Bon stage !
      L'équipe RH
    `;

    await this.sendEmail({
      to: data.internEmail,
      subject,
      text: content,
      html: content.replace(/\n/g, '<br>')
    });
  }
}
