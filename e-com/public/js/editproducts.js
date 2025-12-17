
/* ============================
   Collapsible Sidebar
   ============================ */
document.querySelectorAll('.collapsible').forEach(button => {
    button.addEventListener('click', () => {
        button.classList.toggle('active');
        const content = button.nextElementSibling;
        content.style.maxHeight = content.style.maxHeight ? null : content.scrollHeight + "px";
    });
});

/* ============================
   Product & Variant Management
   ============================ */
const productSelect = document.getElementById('productSelect');
const variantSelect = document.getElementById('variantSelect');
const variantContainer = document.getElementById('variantContainer');
const productDetails = document.getElementById('productDetails');

let currentProduct = null;
let currentVariant = null;

/* Helper: Populate form with product & variant data */
function populateForm() {
    if (!currentProduct) return;

    // --- Product-level fields ---
    const productFields = ['productId', 'name', 'description', 'images', 'category', 'brand'];
    const productValues = [
        currentProduct._id || '',
        currentProduct.title || '',
        currentProduct.description || '',
        currentProduct.images?.join(',') || 'null',
        currentProduct.category || '',
        currentProduct.brand || ''
    ];

    productFields.forEach((id, idx) => {
        document.getElementById(id).value = productValues[idx];
    });

    // --- Variant-level fields ---
    if (currentVariant) {
        const variantFields = ['variantId', 'sku', 'price', 'discountPrice', 'stock', 'color', 'size', 'variantImage'];

        // Safely handle attributes (array or single object)
        let color = '';
        let size = '';
        if (currentVariant.attributes) {
            const attrsArray = Array.isArray(currentVariant.attributes)
                ? currentVariant.attributes
                : [currentVariant.attributes];

            attrsArray.forEach(attr => {
                if (attr.color) color = attr.color;
                if (attr.size) size = attr.size;
            });
        }

        const variantValues = [
            currentVariant._id || '',
            currentVariant.sku || '',
            currentVariant.price ?? 0,
            currentVariant.discountPrice ?? 0,
            currentVariant.stock ?? 0,
            color,
            size,
            currentVariant.image || 'null'
        ];

        variantFields.forEach((id, idx) => {
            document.getElementById(id).value = variantValues[idx];
        });
    }
}


/* Helper: Populate variant dropdown */
function populateVariantDropdown(variants) {
    variantSelect.innerHTML = '';
    variants.forEach((v, idx) => {
        const option = document.createElement('option');
        option.value = idx;
        option.textContent = v.sku || `Variant ${idx + 1}`;
        variantSelect.appendChild(option);
    });

    variantContainer.style.display = variants.length ? 'block' : 'none';
    currentVariant = variants[0] || null;
}

/* Event: Product selection changed */
productSelect.addEventListener('change', async () => {
    const productId = productSelect.value;
    if (!productId) {
        productDetails.style.display = 'none';
        variantContainer.style.display = 'none';
        return;
    }

    try {
        const res = await fetch(`/admin/products/manage/edit/${productId}`);
        if (!res.ok) throw new Error('Product not found');

        const data = await res.json();
        currentProduct = data;

        if (data.variants?.length) {
            populateVariantDropdown(data.variants);
        } else {
            variantContainer.style.display = 'none';
            currentVariant = null;
        }

        populateForm();
        productDetails.style.display = 'block';
    } catch (err) {
        console.error(err);
        productDetails.style.display = 'none';
        variantContainer.style.display = 'none';
    }
});

/* Event: Variant selection changed */
variantSelect.addEventListener('change', () => {
    const idx = parseInt(variantSelect.value);
    currentVariant = currentProduct?.variants?.[idx] || null;
    populateForm();
});

/* ============================
   Form Submission
   ============================ */
document.getElementById('editForm').addEventListener('submit', async e => {
    e.preventDefault();

    const body = {
        title: document.getElementById('name').value,
        description: document.getElementById('description').value,
        images: document.getElementById('images').value,
        category: document.getElementById('category').value,
        brand: document.getElementById('brand').value,
        variantId: document.getElementById('variantId').value,
        sku: document.getElementById('sku').value,
        price: document.getElementById('price').value,
        discountPrice: document.getElementById('discountPrice').value,
        stock: document.getElementById('stock').value,
        color: document.getElementById('color').value,
        size: document.getElementById('size').value,
        variantImage: document.getElementById('variantImage').value
    };

    try {
        const productId = document.getElementById('productId').value;
        const res = await fetch(`/admin/products/manage/edit/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Update failed');

        alert('Product updated successfully!');

        currentProduct = data.product;
        currentVariant = currentProduct.variants.find(v => v._id === body.variantId) || null;

        highlightChanges(body);
        populateForm();
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
});

/* Helper: Highlight changed fields */
function highlightChanges(newValues) {
    Object.entries(newValues).forEach(([key, newValue]) => {
        const el = document.getElementById(key);
        if (!el || el.value === newValue) return;

        el.style.backgroundColor = '#ffff99'; // light yellow
        setTimeout(() => {
            el.style.transition = 'background-color 2s';
            el.style.backgroundColor = '';
        }, 2000);
    });
}

