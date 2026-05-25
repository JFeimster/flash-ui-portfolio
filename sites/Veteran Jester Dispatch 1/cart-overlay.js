/**
 * Veteran Jester Dispatch - Supply Drop (Marketplace)
 * cart-overlay.js - Handles the 'Supply Requisition' interface
 */

(function() {
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --cart-bg: #e4dec7;
            --cart-ink: #1a1a1b;
            --cart-olive: #4B5320;
            --cart-red: rgba(169, 29, 17, 0.85);
            --cart-tape: rgba(210, 195, 140, 0.6);
        }

        .requisition-overlay {
            position: fixed;
            top: 0;
            right: -100%;
            width: 100%;
            max-width: 450px;
            height: 100vh;
            background: var(--cart-bg);
            background-image: url('https://www.transparenttextures.com/patterns/paper-fibers.png');
            border-left: 8px solid var(--cart-ink);
            box-shadow: -10px 0 50px rgba(0,0,0,0.4);
            z-index: 9999;
            transition: right 0.4s cubic-bezier(0.19, 1, 0.22, 1);
            display: flex;
            flex-direction: column;
            padding: 0;
            font-family: 'Courier Prime', monospace;
            color: var(--cart-ink);
        }

        .requisition-overlay.active {
            right: 0;
        }

        .cart-header {
            padding: 40px 30px 20px;
            border-bottom: 2px solid var(--cart-ink);
            position: relative;
        }

        .cart-header h2 {
            font-family: 'Special Elite', cursive;
            font-size: 1.8rem;
            text-transform: uppercase;
        }

        .cart-header .form-id {
            font-size: 0.75rem;
            background: var(--cart-ink);
            color: var(--cart-bg);
            padding: 2px 8px;
            display: inline-block;
            margin-bottom: 10px;
        }

        .close-cart {
            position: absolute;
            top: 20px;
            right: 20px;
            background: none;
            border: 2px solid var(--cart-ink);
            font-family: 'Special Elite', cursive;
            cursor: pointer;
            padding: 5px 10px;
            font-size: 1.2rem;
        }

        .close-cart:hover {
            background: var(--cart-ink);
            color: var(--cart-bg);
        }

        .cart-items {
            flex: 1;
            overflow-y: auto;
            padding: 20px 30px;
        }

        .cart-item {
            display: flex;
            gap: 15px;
            padding: 20px 0;
            border-bottom: 1px dashed rgba(0,0,0,0.2);
            position: relative;
        }

        .item-thumb {
            width: 80px;
            height: 80px;
            background: #d2c5a7;
            border: 1px solid var(--cart-ink);
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Special Elite';
            font-size: 0.7rem;
            text-align: center;
            padding: 5px;
        }

        .item-details {
            flex: 1;
        }

        .item-name {
            font-family: 'Roboto Slab', serif;
            font-weight: 700;
            font-size: 1.1rem;
            margin-bottom: 5px;
            text-transform: uppercase;
        }

        .item-meta {
            font-size: 0.8rem;
            opacity: 0.8;
            margin-bottom: 10px;
        }

        .item-controls {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .qty-btn {
            background: none;
            border: 1px solid var(--cart-ink);
            cursor: pointer;
            width: 24px;
            height: 24px;
            line-height: 20px;
            font-weight: bold;
        }

        .remove-item {
            color: var(--cart-red);
            font-size: 0.75rem;
            text-decoration: underline;
            cursor: pointer;
            margin-left: auto;
            border: none;
            background: none;
            font-family: 'Courier Prime';
        }

        .cart-footer {
            padding: 30px;
            background: rgba(0,0,0,0.05);
            border-top: 2px solid var(--cart-ink);
        }

        .total-row {
            display: flex;
            justify-content: space-between;
            font-family: 'Special Elite', cursive;
            font-size: 1.5rem;
            margin-bottom: 20px;
        }

        .checkout-btn {
            width: 100%;
            background: var(--cart-olive);
            color: white;
            padding: 20px;
            border: none;
            font-family: 'Roboto Slab', serif;
            font-weight: 900;
            text-transform: uppercase;
            font-size: 1.2rem;
            cursor: pointer;
            box-shadow: 6px 6px 0 var(--cart-ink);
            transition: transform 0.1s;
        }

        .checkout-btn:active {
            transform: translate(3px, 3px);
            box-shadow: 3px 3px 0 var(--cart-ink);
        }

        .cart-empty-msg {
            text-align: center;
            margin-top: 50px;
            font-style: italic;
            opacity: 0.6;
        }

        .cart-trigger-btn {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: var(--cart-ink);
            color: var(--cart-bg);
            width: 65px;
            height: 65px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 999;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            border: 2px solid var(--cart-bg);
        }

        .cart-badge {
            position: absolute;
            top: 0;
            right: 0;
            background: var(--cart-red);
            color: white;
            font-size: 0.7rem;
            padding: 2px 6px;
            border-radius: 10px;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);

    // Initial State
    let cart = JSON.parse(localStorage.getItem('vj_dispatch_cart')) || [];

    // UI Components
    const overlay = document.createElement('div');
    overlay.className = 'requisition-overlay';
    overlay.id = 'requisitionOverlay';

    const trigger = document.createElement('div');
    trigger.className = 'cart-trigger-btn';
    trigger.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg><span class="cart-badge" id="cartBadge">0</span>`;

    document.body.appendChild(overlay);
    document.body.appendChild(trigger);

    function updateCartUI() {
        const badge = document.getElementById('cartBadge');
        badge.innerText = cart.reduce((acc, item) => acc + item.quantity, 0);
        
        let subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        overlay.innerHTML = `
            <div class="cart-header">
                <button class="close-cart" id="closeCart">X</button>
                <span class="form-id">FORM 10-24 // LOGISTICS</span>
                <h2>Supply Requisition</h2>
            </div>
            <div class="cart-items" id="cartItemsList">
                ${cart.length === 0 ? '<p class="cart-empty-msg">No hardware requested. The field is empty.</p>' : ''}
                ${cart.map((item, index) => `
                    <div class="cart-item">
                        <div class="item-thumb">VJ-SUPPLY<br>#${item.id}</div>
                        <div class="item-details">
                            <div class="item-name">${item.name}</div>
                            <div class="item-meta">UNIT COST: $${item.price.toFixed(2)}</div>
                            <div class="item-controls">
                                <button class="qty-btn" onclick="adjustQty(${index}, -1)">-</button>
                                <span>${item.quantity}</span>
                                <button class="qty-btn" onclick="adjustQty(${index}, 1)">+</button>
                                <button class="remove-item" onclick="removeItem(${index})">Scrap Item</button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="cart-footer">
                <div class="total-row">
                    <span>EST. TOTAL:</span>
                    <span>$${subtotal.toFixed(2)}</span>
                </div>
                <button class="checkout-btn" onclick="initiateDrop()">Authorize Supply Drop</button>
                <p style="font-size: 0.65rem; margin-top: 15px; text-align: center; opacity: 0.7;">
                    BY AUTHORIZING, YOU ACCEPT ALL OPERATIONAL RISKS.
                </p>
            </div>
        `;

        document.getElementById('closeCart').addEventListener('click', () => {
            overlay.classList.remove('active');
        });
    }

    // Global Functions for Cart Interaction
    window.addItemToRequisition = function(id, name, price) {
        const existing = cart.find(i => i.id === id);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }
        saveAndRefresh();
        overlay.classList.add('active');
    };

    window.adjustQty = function(index, change) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        saveAndRefresh();
    };

    window.removeItem = function(index) {
        cart.splice(index, 1);
        saveAndRefresh();
    };

    window.initiateDrop = function() {
        if(cart.length === 0) return alert("REQUISITION DENIED: No items selected.");
        alert("TRANSMISSION SENT: Processing logistics for deployment.");
        cart = [];
        saveAndRefresh();
        overlay.classList.remove('active');
    };

    function saveAndRefresh() {
        localStorage.setItem('vj_dispatch_cart', JSON.stringify(cart));
        updateCartUI();
    }

    trigger.addEventListener('click', () => {
        overlay.classList.toggle('active');
    });

    // Initialize
    updateCartUI();
})();