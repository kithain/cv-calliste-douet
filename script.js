document.addEventListener('DOMContentLoaded', () => {
    const printButton = document.querySelector('.print-btn');
    if (printButton) {
        printButton.addEventListener('click', () => {
            window.print();
        });
    }
});