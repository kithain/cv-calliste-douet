// Word and PDF read the current page through the same ordered content model.
function getCvExportData(source = document) {
    const text = (node) => node.textContent.replace(/\s+/g, ' ').trim();
    const name = text(source.querySelector('.header h1'));
    const blocks = [
        { type: 'title', text: name },
        { type: 'subtitle', text: text(source.querySelector('.header h2')) },
    ];
    const add = (type, value) => blocks.push({ type, text: value });

    source.querySelectorAll('.contact-list li').forEach((item) => {
        const link = item.querySelector('a');
        const value = link && /^https?:/.test(link.href)
            ? `${text(link)} : ${link.href}`
            : text(item).replace(/^[^\p{L}\p{N}]+/u, '');
        add('contact', value);
    });
    add('heading', 'Profil professionnel');
    add('paragraph', text(source.querySelector('.leading-text')));

    source.querySelectorAll('.main-content section').forEach((section) => {
        add('heading', text(section.querySelector('.section-title')));
        const jobs = section.querySelectorAll('.experience-item');
        if (jobs.length) {
            jobs.forEach((job) => {
                add('job', text(job.querySelector('.job-header > span')));
                add('jobMeta', `${text(job.querySelector('.company'))} | ${text(job.querySelector('.date'))}`);
                job.querySelectorAll('.job-desc li').forEach((item) => add('bullet', text(item)));
            });
        } else {
            section.querySelectorAll('li').forEach((item) => add('bullet', text(item)));
        }
    });

    let include = false;
    for (const node of source.querySelector('.sidebar').children) {
        if (node.tagName === 'H2') {
            include = !node.nextElementSibling?.classList.contains('contact-list');
            if (include) add('heading', text(node));
        } else if (include && node.classList.contains('skill-category')) {
            add('subheading', text(node));
        } else if (include && node.tagName === 'UL') {
            add('paragraph', [...node.querySelectorAll('li')].map(text).join(', '));
        }
    }
    return { name, blocks };
}

function downloadCvBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.append(link);
    try {
        link.click();
    } finally {
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 60000);
    }
}
