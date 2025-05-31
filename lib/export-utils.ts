import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

export const exportToPDF = (data: any[], title: string, columns: string[]) => {
  const doc = new jsPDF()

  // Ajouter le titre
  doc.setFontSize(20)
  doc.text(title, 20, 30)

  // Ajouter la date
  doc.setFontSize(12)
  doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 20, 45)

  // Créer le tableau
  const tableData = data.map(item => 
    columns.map(col => item[col] || '-')
  )

  ;(doc as any).autoTable({
    head: [columns],
    body: tableData,
    startY: 60,
    styles: {
      fontSize: 10,
      cellPadding: 5,
    },
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255,
    },
  })

  return doc
}

// Générer une convention de stage
export const generateConvention = (intern: any, company: any) => {
  const doc = new jsPDF()

  // En-tête
  doc.setFontSize(16)
  doc.text('CONVENTION DE STAGE', 105, 30, { align: 'center' })

  doc.setFontSize(12)
  doc.text(`Entre l'entreprise ${company.name}`, 20, 50)
  doc.text(`Et l'étudiant(e) ${intern.user.full_name}`, 20, 60)
  doc.text(`De l'université ${intern.university}`, 20, 70)

  // Détails du stage
  doc.text('DÉTAILS DU STAGE:', 20, 90)
  doc.text(`Département: ${intern.department}`, 30, 100)
  doc.text(`Début: ${new Date(intern.start_date).toLocaleDateString('fr-FR')}`, 30, 110)
  doc.text(`Fin: ${new Date(intern.end_date).toLocaleDateString('fr-FR')}`, 30, 120)
  doc.text(`Tuteur: ${intern.tutor.full_name}`, 30, 130)

  // Signatures
  doc.text('Signatures:', 20, 160)
  doc.text('L\'étudiant:', 20, 180)
  doc.text('Le tuteur:', 20, 200)
  doc.text('Le responsable RH:', 20, 220)

  return doc
}

// Générer une attestation de stage
export const generateAttestation = (intern: any, company: any) => {
  const doc = new jsPDF()

  // En-tête
  doc.setFontSize(18)
  doc.text('ATTESTATION DE STAGE', 105, 30, { align: 'center' })

  doc.setFontSize(12)
  doc.text(`Je soussigné(e), responsable RH de ${company.name},`, 20, 60)
  doc.text(`certifie que M./Mme ${intern.user.full_name}`, 20, 80)
  doc.text(`a effectué un stage dans notre entreprise`, 20, 100)
  doc.text(`du ${new Date(intern.start_date).toLocaleDateString('fr-FR')} au ${new Date(intern.end_date).toLocaleDateString('fr-FR')}`, 20, 120)
  doc.text(`au sein du département ${intern.department}.`, 20, 140)

  doc.text('Cette attestation est délivrée pour valoir ce que de droit.', 20, 180)

  doc.text(`Fait à ${company.city}, le ${new Date().toLocaleDateString('fr-FR')}`, 20, 220)
  doc.text('Signature et cachet de l\'entreprise', 20, 240)

  return doc
}

// Export CSV
export const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) return

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => 
      `"${String(row[header] || '').replace(/"/g, '""')}"`
    ).join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const exportInternsToCSV = (interns: any[]) => {
  const exportData = interns.map(intern => ({
    'Nom': intern.user?.full_name || '',
    'Email': intern.user?.email || '',
    'Département': intern.department?.name || '',
    'Tuteur': intern.tutor?.full_name || '',
    'Date début': intern.start_date,
    'Date fin': intern.end_date,
    'Statut': intern.status,
    'Progression': `${intern.progress || 0}%`,
    'Projet': intern.project || ''
  }))

  exportToCSV(exportData, 'stagiaires')
}

export const exportRequestsToCSV = (requests: any[]) => {
  const exportData = requests.map(request => ({
    'Type': request.type,
    'Titre': request.title,
    'Stagiaire': request.intern?.user?.full_name || '',
    'Statut': request.status,
    'Date soumission': new Date(request.submitted_at).toLocaleDateString(),
    'Priorité': request.priority
  }))

  exportToCSV(exportData, 'demandes')
}