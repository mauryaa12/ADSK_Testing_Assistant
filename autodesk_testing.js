let productsData = [];
const productSelect = document.getElementById('productSelect');
const yearSelect = document.getElementById('yearSelect');
const yearContainer = document.getElementById('yearContainer');
const manualContainer = document.getElementById('manualContainer');
const manualInput = document.getElementById('manualInput');
const guidInput = document.getElementById('guidInput');
const langsInput = document.getElementById('langsInput');
const buildBtn = document.getElementById('buildBtn');
const openAllBtn = document.getElementById('openAllBtn');
const linksList = document.getElementById('linksList');
const status = document.getElementById('status');

fetch(PRODUCT_MASTER_URL)
  .then(r => r.json())
  .then(data => {
      productsData = data;
      populateProducts();
      populateYears();
  });

function populateProducts() {
    productsData.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.code;
        opt.textContent = `${p.code} — ${p.name}`;
        opt.dataset.usesYearBranch = p.usesYearBranch;
        productSelect.appendChild(opt);
    });

    const other = document.createElement('option');
    other.value = "OTHER";
    other.textContent = "Other Product";
    productSelect.appendChild(other);
}

function populateYears() {
    for (let y = 2050; y >= 1990; y--) {
        const opt = document.createElement('option');
        opt.value = y;
        opt.textContent = y;
        yearSelect.appendChild(opt);
    }
}

productSelect.addEventListener("change", () => {
    const selected = productSelect.selectedOptions[0];
    if (!selected) return;

    const usesYear = selected.dataset.usesYearBranch === "true";
    const isOther = selected.value === "OTHER";

    yearContainer.style.display = usesYear ? "block" : "none";
    manualContainer.style.display = isOther ? "block" : "none";
});

buildBtn.addEventListener("click", () => {
    let guid = guidInput.value.trim();
    let langs = langsInput.value.trim().split(",").map(l => l.trim().toUpperCase());

    linksList.innerHTML = "";
    status.textContent = "";

    const product = productSelect.value;

    let base = "";

    if (product && product !== "OTHER") {
        base = `https://help-staging.autodesk.com/view/${product}`;
        if (productSelect.selectedOptions[0].dataset.usesYearBranch === "true") {
            base += `/${yearSelect.value}`;
        }
    } else {
        base = manualInput.value.trim();
    }

    langs.forEach(lang => {
        const url = `${base}/${lang}/?guid=${guid}`;
        const li = document.createElement("li");
        li.innerHTML = `<a target="_blank" href="${url}">${url}</a>`;
        linksList.appendChild(li);
    });

    status.textContent = `Generated ${langs.length} links.`;
});

openAllBtn.addEventListener("click", () => {
    document.querySelectorAll("#linksList a").forEach(a => a.click());
});
