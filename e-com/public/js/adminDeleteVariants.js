
// Collapsible sidebar
document.querySelectorAll('.collapsible').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        const content = btn.nextElementSibling;
        content.style.maxHeight = content.style.maxHeight ? null : content.scrollHeight + "px";
    });
});


const productSelect = document.getElementById('productSelect');
const variantSelect = document.getElementById('variantSelect');
const variantContainer = document.getElementById('variantContainer');
const variantIdInput = document.getElementById('variantId');

let currentProduct = null;
let currentVariant = null;

/* Populate variant dropdown */
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
  variantIdInput.value = currentVariant?._id || '';
}

/* Product selected */
productSelect.addEventListener('change', async () => {
  const productId = productSelect.value;
  variantContainer.style.display = 'none';
  variantIdInput.value = '';

  if (!productId) return;

  try {
    const res = await fetch(`/admin/products/edit/${productId}`);
    if (!res.ok) throw new Error('Product not found');

    const data = await res.json();
    currentProduct = data;

    if (data.variants?.length) {
      populateVariantDropdown(data.variants);
    }
  } catch (err) {
    console.error(err);
  }
});

/* Variant changed */
variantSelect.addEventListener('change', () => {
  const idx = parseInt(variantSelect.value);
  currentVariant = currentProduct?.variants?.[idx] || null;
  variantIdInput.value = currentVariant?._id || '';
});

/* Submit delete */
document.getElementById('deleteVariantForm').addEventListener('submit', async e => {
  e.preventDefault();

  if (!variantIdInput.value) {
    return alert('Please select a variant');
  }

  if (!confirm('Are you sure you want to delete this variant?')) return;

  try {
    const res = await fetch(
      `/admin/products/deletevariant/${variantIdInput.value}`,
      { method: 'DELETE' }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    alert('Variant deleted successfully');
    location.reload();
  } catch (err) {
    console.error(err);
    alert(err.message || 'Delete failed');
  }
});
