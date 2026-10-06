// A text PDF is generated locally; the page is never converted into an image.
async function createCvAtsPdf(source = document) {
    const { PDFDocument, StandardFonts, rgb } = globalThis.PDFLib;
    const { name, blocks } = getCvExportData(source);
    const pdf = await PDFDocument.create();
    pdf.setTitle(`CV ${name}`);
    pdf.setAuthor(name);
    pdf.setSubject('Curriculum vitae');
    pdf.setLanguage('fr-FR');
    const regular = await pdf.embedFont(StandardFonts.Helvetica);
    const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
    const pageWidth = 595.28;
    const pageHeight = 841.89;
    const margin = 44;
    const usableWidth = pageWidth - 2 * margin;

    // Split by measured font width, including a long URL or word without spaces.
    function wrap(value, font, size, width) {
        const lines = [];
        let line = '';
        // Standard PDF fonts draw individual glyph advances without kerning.
        // Measuring character by character matches the width of the saved PDF.
        const characterWidths = new Map();
        const measure = (value) => [...value].reduce((total, character) => {
            if (!characterWidths.has(character)) {
                characterWidths.set(character, font.widthOfTextAtSize(character, size));
            }
            return total + characterWidths.get(character);
        }, 0);
        for (const word of value.split(/\s+/)) {
            const candidate = line ? `${line} ${word}` : word;
            if (measure(candidate) <= width) {
                line = candidate;
                continue;
            }
            if (line) lines.push(line);
            line = '';
            for (const character of word) {
                if (line && measure(line + character) > width) {
                    lines.push(line);
                    line = '';
                }
                line += character;
            }
        }
        if (line) lines.push(line);
        return lines;
    }

    const styles = {
        title: { size: 22, font: bold, before: 0, after: 6, keepNext: true },
        subtitle: { size: 12, font: bold, before: 0, after: 8, keepNext: true },
        contact: { size: 10.5, font: regular, before: 0, after: 2 },
        heading: { size: 13, font: bold, before: 13, after: 5, keepNext: true },
        job: { size: 11, font: bold, before: 8, after: 2, keepNext: true },
        jobMeta: { size: 10.5, font: regular, before: 0, after: 4, keepNext: true },
        bullet: { size: 10.5, font: regular, before: 0, after: 3, indent: 10 },
        subheading: { size: 11, font: bold, before: 7, after: 3, keepNext: true },
        paragraph: { size: 10.5, font: regular, before: 0, after: 5 },
    };
    const layout = blocks.map((block) => {
        const style = styles[block.type];
        const lines = wrap(block.text, style.font, style.size, usableWidth - (style.indent || 0));
        const lineHeight = style.size * 1.3;
        return { ...block, ...style, lines, lineHeight,
            height: style.before + lines.length * lineHeight + style.after };
    });
    let page;
    let y;
    function addPage() {
        page = pdf.addPage([pageWidth, pageHeight]);
        y = pageHeight - margin;
    }
    addPage();

    layout.forEach((block, index) => {
        // Keep a heading, a job and its dates with at least the first content line.
        let requiredHeight = block.height;
        let current = block;
        let nextIndex = index + 1;
        while (current.keepNext && nextIndex < layout.length) {
            const next = layout[nextIndex++];
            requiredHeight += next.keepNext ? next.height : next.before + next.lineHeight;
            current = next;
        }
        if (y - requiredHeight < margin && y < pageHeight - margin) addPage();
        y -= block.before;
        block.lines.forEach((line, lineIndex) => {
            // Long paragraphs may continue on the next page without clipping.
            if (y - block.lineHeight < margin) addPage();
            const baseline = y - block.size;
            if (block.type === 'bullet' && lineIndex === 0) {
                page.drawText('•', { x: margin, y: baseline, font: regular, size: block.size, color: rgb(0, 0, 0) });
            }
            page.drawText(line, { x: margin + (block.indent || 0), y: baseline,
                font: block.font, size: block.size, color: rgb(0, 0, 0) });
            y -= block.lineHeight;
        });
        y -= block.after;
    });
    return new Blob([await pdf.save()], { type: 'application/pdf' });
}

document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('.ats-pdf-btn');
    const status = document.querySelector('.export-status');
    button.addEventListener('click', async () => {
        button.disabled = true;
        status.textContent = 'Préparation du PDF ATS…';
        try {
            const blob = await createCvAtsPdf();
            downloadCvBlob(blob, 'CV-Calliste-DOUET-ATS.pdf');
            status.textContent = 'PDF ATS prêt. Téléchargement lancé.';
        } catch (error) {
            console.error('Export PDF ATS impossible', error);
            status.textContent = 'L’export PDF ATS a échoué. Rechargez la page et réessayez.';
        } finally {
            button.disabled = false;
        }
    });
});
