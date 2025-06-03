
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export interface DocumentTemplate {
  type: 'convention' | 'attestation' | 'prolongation' | 'evaluation';
  title: string;
  content: string;
  variables: Record<string, string>;
}

export class PDFService {
  static async generateConvention(data: {
    internName: string;
    tutorName: string;
    startDate: string;
    endDate: string;
    department: string;
    university: string;
    project?: string;
  }): Promise<Blob> {
    const doc = new jsPDF();
    
    // En-tête
    doc.setFontSize(20);
    doc.text('CONVENTION DE STAGE', 105, 30, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text('Entre:', 20, 60);
    
    // Informations entreprise
    doc.text('L\'entreprise : [NOM ENTREPRISE]', 20, 80);
    doc.text('Adresse : [ADRESSE ENTREPRISE]', 20, 90);
    doc.text('Représentée par : [REPRÉSENTANT]', 20, 100);
    
    doc.text('Et:', 20, 120);
    
    // Informations stagiaire
    doc.text(`Le stagiaire : ${data.internName}`, 20, 140);
    doc.text(`Université : ${data.university}`, 20, 150);
    doc.text(`Tuteur : ${data.tutorName}`, 20, 160);
    doc.text(`Département : ${data.department}`, 20, 170);
    
    // Période de stage
    doc.text('Période de stage :', 20, 190);
    doc.text(`Du ${format(new Date(data.startDate), 'dd MMMM yyyy', { locale: fr })}`, 20, 200);
    doc.text(`Au ${format(new Date(data.endDate), 'dd MMMM yyyy', { locale: fr })}`, 20, 210);
    
    if (data.project) {
      doc.text('Projet :', 20, 230);
      doc.text(data.project, 20, 240, { maxWidth: 170 });
    }
    
    // Signatures
    doc.text('Signature entreprise', 40, 270);
    doc.text('Signature stagiaire', 130, 270);
    
    return doc.output('blob');
  }

  static async generateAttestation(data: {
    internName: string;
    startDate: string;
    endDate: string;
    department: string;
    evaluation?: number;
  }): Promise<Blob> {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('ATTESTATION DE STAGE', 105, 30, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text('Je soussigné(e), certifie que :', 20, 80);
    doc.text(`M./Mme ${data.internName}`, 20, 100);
    doc.text(`A effectué un stage dans notre entreprise`, 20, 120);
    doc.text(`Département : ${data.department}`, 20, 140);
    doc.text(`Du ${format(new Date(data.startDate), 'dd MMMM yyyy', { locale: fr })}`, 20, 160);
    doc.text(`Au ${format(new Date(data.endDate), 'dd MMMM yyyy', { locale: fr })}`, 20, 170);
    
    if (data.evaluation) {
      doc.text(`Évaluation finale : ${data.evaluation}/20`, 20, 190);
    }
    
    doc.text(`Fait le ${format(new Date(), 'dd MMMM yyyy', { locale: fr })}`, 20, 220);
    doc.text('Signature et cachet de l\'entreprise', 20, 250);
    
    return doc.output('blob');
  }

  static async generateEvaluationReport(data: {
    internName: string;
    period: string;
    technicalSkills: number;
    softSkills: number;
    communication: number;
    autonomy: number;
    overallScore: number;
    comments?: string;
    recommendations?: string;
  }): Promise<Blob> {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('RAPPORT D\'ÉVALUATION', 105, 30, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Stagiaire : ${data.internName}`, 20, 60);
    doc.text(`Période : ${data.period}`, 20, 75);
    
    // Grille d'évaluation
    doc.text('ÉVALUATION :', 20, 100);
    doc.text(`Compétences techniques : ${data.technicalSkills}/20`, 20, 120);
    doc.text(`Compétences relationnelles : ${data.softSkills}/20`, 20, 135);
    doc.text(`Communication : ${data.communication}/20`, 20, 150);
    doc.text(`Autonomie : ${data.autonomy}/20`, 20, 165);
    doc.text(`Note globale : ${data.overallScore}/20`, 20, 185);
    
    if (data.comments) {
      doc.text('COMMENTAIRES :', 20, 210);
      doc.text(data.comments, 20, 225, { maxWidth: 170 });
    }
    
    if (data.recommendations) {
      doc.text('RECOMMANDATIONS :', 20, 250);
      doc.text(data.recommendations, 20, 265, { maxWidth: 170 });
    }
    
    return doc.output('blob');
  }

  static async downloadPDF(blob: Blob, filename: string): Promise<void> {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
