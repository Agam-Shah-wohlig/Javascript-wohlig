// Collapsible sidebar
document.querySelectorAll('.collapsible').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        const content = btn.nextElementSibling;
        content.style.maxHeight = content.style.maxHeight ? null : content.scrollHeight + "px";
    });
});

// Add additional image fields
const addImageBtn = document.getElementById('addImageBtn');
const productImages = document.getElementById('productImages');

addImageBtn?.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'images[]';
    input.placeholder = 'Image URL';
    productImages.appendChild(input);
});

