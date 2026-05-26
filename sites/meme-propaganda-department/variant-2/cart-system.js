const style = document.createElement('style');
style.textContent = `
    #armory-cart-toggle {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        background: var(--yellow);
        border: var(--border-width) solid var(--black);
        padding: 15px;
        font-family: 'Archivo Black', sans-serif;
        box-shadow: var(--shadow-small);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    #armory-cart-toggle:hover {
        transform: translate(-2px, -2px);
        box-shadow: 6px 6px 0px var(--black);
    }

    #cart-drawer {
        position: fixed;
        top: 0;
        right: -100%;
        width: 400px;
        height: 100vh;
        background: var(--white);
        border-left: var(--border-width) solid var(--black);
        z-index: 1001;
        transition: right 0.3s cubic-bezier(0.19, 1, 0.22, 1);
        display: flex;
        flex-direction: column;
        padding: 20px;
        box-shadow: -10px 0 0 rgba(0,0,0,0.1);
    }

    #cart-drawer.open {
        right: 0;
    }

    .cart-header {
        border-bottom: var(--border-width) solid var(--black);
        padding-bottom: 20px;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .cart-items {
        flex-grow: 1;
        overflow-y: auto;
    }

    .cart-item {
        border: 2px solid var(--black);
        padding: 10px;
        margin-bottom: 15px;
        background: #f9f9f9;
        display: grid;
        grid-template-columns: 80px 1fr auto;
        gap: 10px;
        position: relative;
    }

    .cart-item img {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border: 2px solid var(--black);
    }

    .cart-item-info h4 {
        font-family: 'Archivo Black', sans-serif;
        font-size: 0.9rem;
        text-transform: uppercase;
        margin-bottom: 5px;
    }

    .cart-item-controls {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 5px;
    }

    .qty-btn {
        background: var(--black);
        color: white;
        border: none;
        width: 25px;
        height: 25px;
        cursor: pointer;
        font-weight: bold;
    }

    .cart-footer {
        border-top: var(--border-width) solid var(--black);
        padding-top: 20px;
        background: var(--white);
    }

    .cart-total {
        font-family: 'Archivo Black', sans-serif;
        font-size: 1.5rem;
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
    }

    .checkout-btn {
        width: 100%;
        background: var(--red);
        color: var(--white);
        border: var(--border-width) solid var(--black);
        padding: 15px;
        font-family: 'Archivo Black', sans-serif;
        font-size: 1.2rem;
        cursor: pointer;
        box-shadow: var(--shadow-small);
    }

    .checkout-btn:hover {
        background: var(--black);
        transform: translate(-2px, -2px);
        box-shadow: 6px 6px 0px var(--black);
    }

    .close-cart {
        background: none;
        border: none;
        font-family: 'Archivo Black', sans-serif;
        cursor: pointer;
        text-decoration: underline;
    }

    @media (max-width: 450px) {
        #cart-drawer { width: 100%; }
    }
`;
document.head.appendChild(style);

class ArmoryCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('armory_cart')) || [];
        this.isOpen = false;
        this.init();
    }

    init() {
        this.createUI();
        this.render();
        this.attachListeners();
    }

    createUI() {
        const cartToggle = document.createElement('div');
        cartToggle.id = 'armory-cart-toggle';
        cartToggle.innerHTML = `<span>THE ARMORY</span> <span id="cart-count">[${this.items.length}]</span>`;
        document.body.appendChild(cartToggle);

        const drawer = document.createElement('div');
        drawer.id = 'cart-drawer';
        drawer.innerHTML = `
            <div class="cart-header">
                <h2 style="font-family: 'Archivo Black';">MUNITIONS DEPOT</h2>
                <button class="close-cart">CLOSE [X]</button>
            </div>
            <div class="cart-items" id="cart-items-container"></div>
            <div class="cart-footer">
                <div class="cart-total">
                    <span>TOTAL:</span>
                    <span id="cart-total-price">$0.00</span>
                </div>
                <button class="checkout-btn">INITIATE ACQUISITION</button>
            </div>
        `;
        document.body.appendChild(drawer);
    }

    attachListeners() {
        document.getElementById('armory-cart-toggle').addEventListener('click', () => this.toggle());
        document.querySelector('.close-cart').addEventListener('click', () => this.toggle());
        
        // Listen for "Buy" actions (customizing existing action buttons)
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('action-btn') && e.target.innerText === 'Download') {
                const card = e.target.closest('.meme-card');
                const product = {
                    id: card.querySelector('h3').innerText.replace(/\s+/g, '-').toLowerCase(),
                    name: card.querySelector('h3').innerText,
                    price: 24.99,
                    img: card.querySelector('img').src,
                    category: card.querySelector('.meme-tag').innerText
                };
                this.addItem(product);
                this.toggle(true);
            }
        });
    }

    toggle(forceState) {
        this.isOpen = forceState !== undefined ? forceState : !this.isOpen;
        document.getElementById('cart-drawer').classList.toggle('open', this.isOpen);
    }

    addItem(product) {
        const existing = this.items.find(item => item.id === product.id);
        if (existing) {
            existing.qty++;
        } else {
            this.items.push({ ...product, qty: 1 });
        }
        this.save();
        this.render();
    }

    removeItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.save();
        this.render();
    }

    updateQty(id, delta) {
        const item = this.items.find(i => i.id === id);
        if (item) {
            item.qty += delta;
            if (item.qty <= 0) return this.removeItem(id);
            this.save();
            this.render();
        }
    }

    save() {
        localStorage.setItem('armory_cart', JSON.stringify(this.items));
    }

    render() {
        const container = document.getElementById('cart-items-container');
        const countEl = document.getElementById('cart-count');
        const totalEl = document.getElementById('cart-total-price');

        countEl.innerText = `[${this.items.reduce((acc, i) => acc + i.qty, 0)}]`;
        
        if (this.items.length === 0) {
            container.innerHTML = `<div style="text-align:center; padding: 40px; font-weight:bold; opacity:0.5;">ARMORY EMPTY. NEED MORE PROPAGANDA.</div>`;
            totalEl.innerText = '$0.00';
            return;
        }

        let total = 0;
        container.innerHTML = this.items.map(item => {
            total += item.price * item.qty;
            return `
                <div class="cart-item">
                    <img src="${item.img}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <div style="font-size: 0.8rem;">UNIT: $${item.price}</div>
                        <div class="cart-item-controls">
                            <button class="qty-btn" onclick="Armory.updateQty('${item.id}', -1)">-</button>
                            <span style="font-family: 'Archivo Black';">${item.qty}</span>
                            <button class="qty-btn" onclick="Armory.updateQty('${item.id}', 1)">+</button>
                        </div>
                    </div>
                    <button class="action-btn" style="color: var(--red); font-size: 0.7rem;" onclick="Armory.removeItem('${item.id}')">REMOVE</button>
                </div>
            `;
        }).join('');

        totalEl.innerText = `$${total.toFixed(2)}`;
    }
}

// Global instance
window.Armory = new ArmoryCart();

// Update existing buttons to show commercial potential
document.querySelectorAll('.meme-card .action-btn').forEach(btn => {
    if(btn.innerText === 'Download') {
        btn.innerText = 'BUY PRINT';
        btn.style.color = 'var(--red)';
    }
});