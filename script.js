document.addEventListener('DOMContentLoaded', () => {
    const printButton = document.querySelector('.layout-pdf-btn');
    if (printButton) {
        printButton.addEventListener('click', () => {
            window.print();
        });
    }
});
