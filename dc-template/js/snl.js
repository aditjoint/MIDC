// =========================================================
// 1. PRICE SHEET LINK (Must be the CSV link from Step 1)
// =========================================================
const sheetURL = 'PASTE_YOUR_NEW_CSV_LINK_HERE'; 

// =========================================================
// 2. SUBMISSION SCRIPT URL (From your Deployment)
//    This sends the email. Keep your /exec link here.
// =========================================================
const scriptURL = 'https://script.google.com/macros/s/AKfycbzJQU77yhLjO4f1DVLYTIYHuXsyArdsj15envQlyBZtvEl58oUIFT_EekjqdN093EO5/exec'; 

// STATE MANAGEMENT
let db = [], cart = [], currentCategory = 'compute';
const categoryTitles = {
    'compute': 'Compute & Servers', 'storage': 'SAN / NAS Storage', 'network': 'Switches & Routers',
    'security': 'Firewalls & Security', 'software': 'Licenses & OS', 'racks': 'Racks & Power',
    'endpoints': 'Laptops & Desktops', 'cabling': 'Structured Cabling', 'physical_sec': 'CCTV & Biometrics', 'av_room': 'Meeting Room AV'
};

// INITIALIZATION
window.onload = function() {
    updateStatus('Connecting to Reference Prices...', '#f8f9fa');

    // Safety Check: Ensure the link is actually a CSV
    if (!sheetURL.includes("output=csv")) { 
        updateStatus('Error: Invalid CSV Link. Check snl.js', '#dc3545'); 
        return; 
    }

    Papa.parse(sheetURL, {
        download: true, header: true, skipEmptyLines: true,
        complete: function(results) {
            if(results.data && results.data.length > 0) {
                db = results.data;
                updateStatus('● Reference Pricing Active', '#28a745'); 
                renderForm('compute'); 
            } else { 
                updateStatus('Database Empty', '#ffc107'); 
            }
        },
        error: function(err) { 
            console.error(err);
            updateStatus('Connection Failed. Check Internet', '#dc3545'); 
        }
    });
};

// UI UPDATES
function updateStatus(msg, color) {
    const s = document.getElementById('conn-status');
    const b = document.getElementById('tool-status-bar');
    if(s) s.innerText = msg;
    if(b) { 
        b.style.background = color; 
        b.style.color = (color === '#f8f9fa') ? '#666' : 'white'; 
    }
}

function switchTab(cat) {
    currentCategory = cat;
    document.querySelectorAll('.snl-nav-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById('section-title').innerText = categoryTitles[cat];
    renderForm(cat);
}

function renderForm(cat) {
    const mSel = document.getElementById('sel-model');
    const aSel = document.getElementById('sel-addon');
    
    // Reset Dropdowns
    mSel.innerHTML = '<option value="0" data-price="0">-- Select Model --</option>';
    aSel.innerHTML = '<option value="0" data-price="0">-- None --</option>';
    document.getElementById('sel-qty').value = 1;

    // Filter DB
    const models = db.filter(i => i.Category && i.Category.trim().toLowerCase() === cat && i.Type.trim() === 'model');
    const addons = db.filter(i => i.Category && i.Category.trim().toLowerCase() === cat && i.Type.trim() === 'addon');

    // Populate
    models.forEach(m => { 
        if(m.Name) mSel.innerHTML += `<option value="${m.Name}" data-price="${m.Price}">${m.Name} - ₹${parseInt(m.Price).toLocaleString('en-IN')}</option>`; 
    });
    addons.forEach(a => { 
        if(a.Name) aSel.innerHTML += `<option value="${a.Name}" data-price="${a.Price}">${a.Name} (+₹${parseInt(a.Price).toLocaleString('en-IN')})</option>`; 
    });
}

// CART FUNCTIONS
function addToCart() {
    const mSel = document.getElementById('sel-model');
    const aSel = document.getElementById('sel-addon');
    const qty = parseInt(document.getElementById('sel-qty').value);
    
    if (mSel.value === '0') { alert("Please select a model."); return; }
    if (qty < 1) { alert("Qty must be 1+"); return; }
    
    const uPrice = (parseInt(mSel.options[mSel.selectedIndex].getAttribute('data-price'))||0) + (parseInt(aSel.options[aSel.selectedIndex].getAttribute('data-price'))||0);
    
    cart.push({ 
        category: categoryTitles[currentCategory], 
        name: mSel.value, 
        addon: aSel.value !== '0' ? aSel.value : '', 
        qty: qty, 
        unitPrice: uPrice, 
        totalPrice: uPrice * qty 
    });
    
    renderCart();
    // Reset Form
    mSel.value = '0'; aSel.value = '0';
}

function renderCart() {
    const list = document.getElementById('cart-list');
    list.innerHTML = ''; 
    let total = 0;
    
    if(cart.length === 0) { 
        list.innerHTML = '<div class="empty-cart-msg">No items added yet.</div>'; 
        updateTotals(0); 
        return; 
    }
    
    cart.forEach((i, x) => {
        total += i.totalPrice;
        list.innerHTML += `
            <div class="boq-item">
                <div style="font-weight:bold;color:#0056b3;">${i.name}</div>
                ${i.addon ? `<div style="font-size:0.8rem;color:#666;">+ ${i.addon}</div>` : ''}
                <div style="display:flex;justify-content:space-between;margin-top:5px;">
                    <span>Qty: ${i.qty}</span>
                    <span>₹${i.totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <i class="fas fa-times remove-icon" onclick="removeFromCart(${x})"></i>
            </div>`;
    });
    updateTotals(total);
}

function removeFromCart(x) { cart.splice(x, 1); renderCart(); }
function resetCart() { if(confirm('Clear BOM?')) { cart = []; renderCart(); } }

function updateTotals(t) {
    document.getElementById('subtotal-display').innerText = '₹' + t.toLocaleString('en-IN');
    document.getElementById('tax-display').innerText = '₹' + (t*0.18).toLocaleString('en-IN');
    document.getElementById('grand-total').innerText = '₹' + (t*1.18).toLocaleString('en-IN');
}

// SUBMISSION LOGIC
function openModal() { 
    if(cart.length === 0) return alert("Cart is empty"); 
    document.getElementById('quoteModal').style.display = 'flex'; 
}

function closeModal() { 
    document.getElementById('quoteModal').style.display = 'none'; 
}

function submitToSheet() {
    const n = document.getElementById('cust-name').value;
    const e = document.getElementById('cust-email').value;
    const p = document.getElementById('cust-phone').value;
    const btn = document.getElementById('btn-submit');

    if(!n || !e || !p) { alert("Please fill all fields."); return; }
    
    btn.innerText = "Sending..."; 
    btn.disabled = true;

    const fd = new FormData();
    fd.append('name', n); 
    fd.append('email', e); 
    fd.append('phone', p);
    fd.append('items', JSON.stringify(cart)); 
    fd.append('total', document.getElementById('grand-total').innerText);

    fetch(scriptURL, { method: 'POST', body: fd })
    .then(r => r.json())
    .then(d => {
        if(d.result === 'success') { 
            alert("Success! Quote Request Sent."); 
            closeModal(); 
            cart = []; 
            renderCart(); 
        } else { 
            throw new Error(d.error); 
        }
    })
    .catch(err => { 
        console.error(err); 
        alert("Error sending quote. Check permissions."); 
    })
    .finally(() => { 
        btn.innerText = "Submit Inquiry"; 
        btn.disabled = false; 
    });
}
