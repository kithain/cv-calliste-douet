/* docx is bundled locally so exports do not depend on an external service. */
function createCvWordDocument(source = document) {
    const { Document, Paragraph, TextRun, HeadingLevel } = globalThis.docx;
    const { name, blocks } = getCvExportData(source);
    const paragraph = (value, options = {}) => new Paragraph({
        children: [new TextRun(value)], ...options,
    });
    const formats = {
        title: { heading: HeadingLevel.TITLE },
        subtitle: { style: 'Subtitle' },
        heading: { heading: HeadingLevel.HEADING_1 },
        job: { heading: HeadingLevel.HEADING_2 },
        jobMeta: { keepNext: true },
        bullet: { bullet: { level: 0 } },
        subheading: { heading: HeadingLevel.HEADING_2 },
    };
    const children = blocks.map((block) => paragraph(block.text, formats[block.type]));

    return new Document({
        creator: name,
        title: `CV ${name}`,
        styles: {
            default: {
                document: {
                    run: { font: 'Arial', size: 21, color: '000000', language: { value: 'fr-FR' } },
                    paragraph: { spacing: { after: 80, line: 250 }, widowControl: true },
                },
                title: { run: { size: 36, bold: true, color: '000000' }, paragraph: { spacing: { after: 100 }, keepNext: true } },
                heading1: { run: { size: 26, bold: true, color: '000000' }, paragraph: { spacing: { before: 200, after: 100 }, keepNext: true } },
                heading2: { run: { size: 22, bold: true, color: '000000' }, paragraph: { spacing: { before: 100, after: 60 }, keepNext: true } },
            },
            paragraphStyles: [{ id: 'Subtitle', name: 'Subtitle', basedOn: 'Normal',
                run: { size: 24, color: '000000' }, paragraph: { keepNext: true, spacing: { after: 120 } } }],
        },
        sections: [{ properties: { page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 850, right: 1000, bottom: 850, left: 1000 },
        } }, children }],
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('.word-btn');
    const status = document.querySelector('.export-status');
    button.addEventListener('click', async () => {
        button.disabled = true;
        status.textContent = 'Préparation du document Word…';
        try {
            const blob = await globalThis.docx.Packer.toBlob(createCvWordDocument());
            downloadCvBlob(blob, 'CV-Calliste-DOUET.docx');
            status.textContent = 'Document Word prêt. Téléchargement lancé.';
        } catch (error) {
            console.error('Export Word impossible', error);
            status.textContent = 'L’export Word a échoué. Rechargez la page et réessayez.';
        } finally {
            button.disabled = false;
        }
    });
});
