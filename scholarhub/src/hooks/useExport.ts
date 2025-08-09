import { useCallback } from 'react';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import { Article } from '../store/slices/articlesSlice';
import { useAppDispatch } from './';
import { incrementDownloads } from '../store/slices/articlesSlice';
import { addNotification } from '../store/slices/uiSlice';

export const useExport = () => {
  const dispatch = useAppDispatch();

  const exportToPDF = useCallback(async (article: Article) => {
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - 2 * margin;
      let currentY = margin;

      // Helper function to add text with wrapping
      const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
        pdf.setFontSize(fontSize);
        if (isBold) {
          pdf.setFont('helvetica', 'bold');
        } else {
          pdf.setFont('helvetica', 'normal');
        }

        const lines = pdf.splitTextToSize(text, contentWidth);
        const lineHeight = fontSize * 0.35;

        lines.forEach((line: string) => {
          if (currentY + lineHeight > pdf.internal.pageSize.getHeight() - margin) {
            pdf.addPage();
            currentY = margin;
          }
          pdf.text(line, margin, currentY);
          currentY += lineHeight;
        });

        currentY += 5; // Add some space after text
      };

      // Title
      addText(article.title, 18, true);
      currentY += 10;

      // Author info
      addText(`Autor: ${article.author.fullName}`, 12, true);
      if (article.author.institution) {
        addText(`Institución: ${article.author.institution}`, 10);
      }
      currentY += 10;

      // Publication info
      addText(`Fecha de publicación: ${new Date(article.publicationDate).toLocaleDateString('es-ES')}`, 10);
      if (article.journal) {
        addText(`Revista: ${article.journal}`, 10);
      }
      if (article.conference) {
        addText(`Conferencia: ${article.conference}`, 10);
      }
      if (article.doi) {
        addText(`DOI: ${article.doi}`, 10);
      }
      currentY += 15;

      // Abstract
      addText('Resumen', 14, true);
      addText(article.abstract, 10);
      currentY += 15;

      // Keywords
      if (article.keywords.length > 0) {
        addText('Palabras clave', 12, true);
        addText(article.keywords.join(', '), 10);
        currentY += 15;
      }

      // Content
      addText('Contenido', 14, true);
      // Remove HTML tags for PDF
      const cleanContent = article.content.replace(/<[^>]*>/g, '');
      addText(cleanContent, 10);

      // Footer
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.text(
          `Página ${i} de ${totalPages} - Generado por ScholarHub`,
          pageWidth / 2,
          pdf.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
      }

      pdf.save(`${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
      
      dispatch(incrementDownloads(article.id));
      dispatch(addNotification({
        type: 'success',
        title: 'Exportación exitosa',
        message: 'El artículo se ha exportado a PDF correctamente',
      }));
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        title: 'Error al exportar',
        message: 'No se pudo exportar el artículo a PDF',
      }));
    }
  }, [dispatch]);

  const exportToWord = useCallback(async (article: Article) => {
    try {
      // Remove HTML tags and convert to plain text
      const cleanContent = article.content.replace(/<[^>]*>/g, '').replace(/\n+/g, '\n');
      
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              // Title
              new Paragraph({
                children: [
                  new TextRun({
                    text: article.title,
                    bold: true,
                    size: 32,
                  }),
                ],
                heading: HeadingLevel.TITLE,
                spacing: {
                  after: 400,
                },
              }),

              // Author
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Autor: ${article.author.fullName}`,
                    bold: true,
                  }),
                ],
                spacing: {
                  after: 200,
                },
              }),

              // Institution
              ...(article.author.institution ? [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Institución: ${article.author.institution}`,
                    }),
                  ],
                  spacing: {
                    after: 200,
                  },
                }),
              ] : []),

              // Publication date
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Fecha de publicación: ${new Date(article.publicationDate).toLocaleDateString('es-ES')}`,
                  }),
                ],
                spacing: {
                  after: 200,
                },
              }),

              // Journal/Conference
              ...(article.journal ? [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Revista: ${article.journal}`,
                    }),
                  ],
                  spacing: {
                    after: 200,
                  },
                }),
              ] : []),

              ...(article.conference ? [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Conferencia: ${article.conference}`,
                    }),
                  ],
                  spacing: {
                    after: 200,
                  },
                }),
              ] : []),

              // DOI
              ...(article.doi ? [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `DOI: ${article.doi}`,
                    }),
                  ],
                  spacing: {
                    after: 400,
                  },
                }),
              ] : []),

              // Abstract
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Resumen',
                    bold: true,
                    size: 24,
                  }),
                ],
                heading: HeadingLevel.HEADING_1,
                spacing: {
                  before: 400,
                  after: 200,
                },
              }),

              new Paragraph({
                children: [
                  new TextRun({
                    text: article.abstract,
                  }),
                ],
                spacing: {
                  after: 400,
                },
              }),

              // Keywords
              ...(article.keywords.length > 0 ? [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'Palabras clave',
                      bold: true,
                      size: 20,
                    }),
                  ],
                  heading: HeadingLevel.HEADING_2,
                  spacing: {
                    before: 400,
                    after: 200,
                  },
                }),

                new Paragraph({
                  children: [
                    new TextRun({
                      text: article.keywords.join(', '),
                    }),
                  ],
                  spacing: {
                    after: 400,
                  },
                }),
              ] : []),

              // Content
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Contenido',
                    bold: true,
                    size: 24,
                  }),
                ],
                heading: HeadingLevel.HEADING_1,
                spacing: {
                  before: 400,
                  after: 200,
                },
              }),

              // Split content into paragraphs
              ...cleanContent.split('\n').filter(line => line.trim()).map(
                (line) =>
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: line.trim(),
                      }),
                    ],
                    spacing: {
                      after: 200,
                    },
                  })
              ),
            ],
          },
        ],
      });

      const buffer = await Packer.toBuffer(doc);
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });

      saveAs(blob, `${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.docx`);
      
      dispatch(incrementDownloads(article.id));
      dispatch(addNotification({
        type: 'success',
        title: 'Exportación exitosa',
        message: 'El artículo se ha exportado a Word correctamente',
      }));
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        title: 'Error al exportar',
        message: 'No se pudo exportar el artículo a Word',
      }));
    }
  }, [dispatch]);

  const exportCitation = useCallback((article: Article, format: 'apa' | 'bibtex' = 'apa') => {
    const year = new Date(article.publicationDate).getFullYear();
    const authorName = article.author.fullName;
    
    let citation = '';
    
    if (format === 'apa') {
      citation = `${authorName} (${year}). ${article.title}. `;
      if (article.journal) {
        citation += `${article.journal}.`;
      } else if (article.conference) {
        citation += `Presentado en ${article.conference}.`;
      }
      if (article.doi) {
        citation += ` https://doi.org/${article.doi}`;
      }
    } else if (format === 'bibtex') {
      const key = article.title.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().substring(0, 20);
      citation = `@article{${key}${year},
  title={${article.title}},
  author={${authorName}},
  year={${year}},`;
      
      if (article.journal) {
        citation += `\n  journal={${article.journal}},`;
      }
      if (article.doi) {
        citation += `\n  doi={${article.doi}},`;
      }
      citation += '\n}';
    }

    navigator.clipboard.writeText(citation).then(() => {
      dispatch(addNotification({
        type: 'success',
        title: 'Cita copiada',
        message: `La cita en formato ${format.toUpperCase()} se ha copiado al portapapeles`,
      }));
    }).catch(() => {
      dispatch(addNotification({
        type: 'error',
        title: 'Error',
        message: 'No se pudo copiar la cita al portapapeles',
      }));
    });
  }, [dispatch]);

  return {
    exportToPDF,
    exportToWord,
    exportCitation,
  };
};