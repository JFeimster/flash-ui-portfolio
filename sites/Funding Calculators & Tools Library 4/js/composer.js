document.addEventListener('DOMContentLoaded', () => {
    // Inject Scoped Styles for the Attachment Composer Component
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        /* Attachment Composer Styles */
        .composer-section {
            max-width: 1440px;
            margin: 80px auto;
            padding: 0 40px;
        }
        @media (max-width: 768px) {
            .composer-section {
                padding: 0 20px;
                margin: 40px auto;
            }
        }
        .composer-grid {
            display: grid;
            grid-template-columns: 1.1fr 0.9fr;
            gap: 40px;
            align-items: start;
        }
        @media (max-width: 1024px) {
            .composer-grid {
                grid-template-columns: 1fr;
                gap: 30px;
            }
        }
        .composer-panel {
            background: var(--bg-secondary);
            border: 3px solid var(--border-color);
            box-shadow: var(--brutal-shadow);
            border-radius: 8px;
            overflow: hidden;
        }
        .composer-header {
            background: var(--bg-tertiary);
            padding: 16px 24px;
            border-bottom: 2px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .composer-body {
            padding: 24px;
        }
        
        /* Drag & Drop Zone */
        .dropzone-area {
            border: 2px dashed var(--accent-cyan);
            background: rgba(0, 240, 255, 0.02);
            padding: 40px 20px;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s ease;
            position: relative;
        }
        .dropzone-area:hover, .dropzone-area.dragover {
            background: rgba(0, 240, 255, 0.08);
            border-color: var(--accent-orange);
            box-shadow: 0 0 15px rgba(0, 240, 255, 0.1);
        }
        .dropzone-icon {
            font-size: 40px;
            margin-bottom: 12px;
        }
        .dropzone-title {
            font-family: var(--font-display);
            font-size: 16px;
            font-weight: 700;
            text-transform: uppercase;
            color: var(--text-primary);
            margin-bottom: 4px;
        }
        .dropzone-sub {
            font-size: 12px;
            color: var(--text-secondary);
        }
        
        /* Attachment Slots */
        .attachment-list {
            margin-top: 24px;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        .attachment-item {
            background: var(--bg-tertiary);
            border: 2px solid var(--border-color);
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            position: relative;
            transition: border-color 0.2s ease;
        }
        .attachment-item:hover {
            border-color: var(--accent-cyan);
        }
        .attachment-meta-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .attachment-details {
            display: flex;
            align-items: center;
            gap: 12px;
            overflow: hidden;
        }
        .attachment-index {
            font-family: var(--font-display);
            font-size: 14px;
            font-weight: 800;
            background: var(--accent-magenta);
            color: #000;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1.5px solid #000;
            box-shadow: 1px 1px 0px #000;
        }
        .attachment-name {
            font-family: var(--font-sans);
            font-weight: 700;
            font-size: 14px;
            color: var(--text-primary);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .attachment-size {
            font-size: 11px;
            color: var(--accent-cyan);
            font-family: var(--font-display);
            font-weight: 600;
            background: rgba(0, 240, 255, 0.1);
            padding: 2px 6px;
            border: 1px solid var(--accent-cyan);
        }
        .attachment-actions {
            display: flex;
            gap: 6px;
        }
        .action-icon-btn {
            background: var(--bg-primary);
            border: 1.5px solid var(--border-color);
            color: var(--text-secondary);
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.1s ease;
        }
        .action-icon-btn:hover {
            color: #fff;
            border-color: var(--accent-magenta);
            background: var(--bg-secondary);
        }
        .action-icon-btn.delete-btn:hover {
            background: var(--accent-orange);
            color: #000;
            border-color: #000;
        }
        .attachment-desc-input {
            width: 100%;
            background: var(--bg-primary);
            border: 1.5px solid var(--border-color);
            padding: 8px 12px;
            font-size: 12px;
            color: var(--text-primary);
            outline: none;
            transition: all 0.2s ease;
        }
        .attachment-desc-input:focus {
            border-color: var(--accent-cyan);
        }
        
        /* Form controls */
        .config-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-bottom: 20px;
        }
        .config-label {
            font-family: var(--font-display);
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            color: var(--text-secondary);
            letter-spacing: 0.5px;
        }
        .composer-input {
            width: 100%;
            background: var(--bg-primary);
            border: 2px solid var(--border-color);
            padding: 12px;
            font-size: 14px;
            color: var(--text-primary);
            outline: none;
            transition: all 0.2s ease;
        }
        .composer-input:focus {
            border-color: var(--accent-magenta);
        }
        
        /* Toggle Switch */
        .toggle-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: var(--bg-primary);
            border: 2px solid var(--border-color);
            padding: 12px;
            margin-bottom: 20px;
            cursor: pointer;
            user-select: none;
        }
        .toggle-meta {
            display: flex;
            flex-direction: column;
        }
        .toggle-title {
            font-family: var(--font-display);
            font-size: 13px;
            font-weight: 700;
            text-transform: uppercase;
        }
        .toggle-desc {
            font-size: 11px;
            color: var(--text-secondary);
        }
        .toggle-switch {
            width: 44px;
            height: 24px;
            background: var(--bg-tertiary);
            border: 2px solid var(--border-color);
            position: relative;
            transition: all 0.2s ease;
        }
        .toggle-container.active .toggle-switch {
            background: var(--accent-cyan);
            border-color: #000;
        }
        .toggle-handle {
            width: 16px;
            height: 16px;
            background: var(--text-secondary);
            position: absolute;
            top: 2px;
            left: 2px;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .toggle-container.active .toggle-handle {
            left: 22px;
            background: #000;
        }
        
        /* Time Options Button Group */
        .time-options {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
        }
        .time-btn {
            background: var(--bg-primary);
            border: 2px solid var(--border-color);
            color: var(--text-secondary);
            padding: 10px;
            font-family: var(--font-display);
            font-weight: 700;
            font-size: 11px;
            text-transform: uppercase;
            cursor: pointer;
            text-align: center;
            transition: all 0.15s ease;
        }
        .time-btn:hover {
            border-color: var(--accent-orange);
            color: #fff;
        }
        .time-btn.active {
            background: var(--accent-orange);
            color: #000;
            border-color: #000;
            box-shadow: 2px 2px 0px #000;
        }
        
        /* Progress simulation screen overlay */
        .send-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(8, 9, 13, 0.95);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 40px;
            z-index: 10;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        }
        .send-overlay.visible {
            opacity: 1;
            pointer-events: auto;
        }
        .progress-box {
            width: 100%;
            max-width: 400px;
        }
        .progress-status-lbl {
            font-family: var(--font-display);
            text-transform: uppercase;
            font-size: 14px;
            font-weight: 700;
            color: var(--accent-cyan);
            margin-bottom: 12px;
            text-align: center;
            letter-spacing: 1px;
        }
        .progress-bar-container {
            width: 100%;
            height: 12px;
            background: var(--bg-secondary);
            border: 2px solid var(--border-color);
            position: relative;
            overflow: hidden;
            margin-bottom: 24px;
        }
        .progress-bar-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--accent-cyan), var(--accent-magenta));
            width: 0%;
            transition: width 0.1s linear;
        }
        .progress-step {
            font-size: 12px;
            color: var(--text-secondary);
            text-align: center;
            font-family: monospace;
        }
        
        /* Success Dispatch State */
        .success-box {
            display: none;
            text-align: center;
            animation: fadeIn 0.4s ease forwards;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .success-icon {
            font-size: 54px;
            margin-bottom: 16px;
            color: var(--accent-cyan);
            text-shadow: 0 0 15px rgba(0, 240, 255, 0.4);
        }
        .success-title {
            font-family: var(--font-display);
            font-size: 24px;
            font-weight: 800;
            text-transform: uppercase;
            color: #fff;
            margin-bottom: 8px;
        }
        .success-link-container {
            background: var(--bg-secondary);
            border: 2px dashed var(--accent-cyan);
            padding: 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 20px 0;
            gap: 12px;
        }
        .secure-link-text {
            color: var(--text-primary);
            font-family: monospace;
            font-size: 13px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .btn-copy {
            background: var(--accent-cyan);
            color: #000;
            border: 1.5px solid #000;
            padding: 6px 12px;
            font-family: var(--font-display);
            font-weight: 700;
            font-size: 11px;
            text-transform: uppercase;
            cursor: pointer;
            box-shadow: 2px 2px 0px #000;
        }
        .btn-copy:hover {
            background: #fff;
            box-shadow: 1px 1px 0px #000;
        }
    `;
    document.head.appendChild(styleElement);

    // Find insertion target: before the #strategy section
    const targetSection = document.getElementById('strategy');
    if (!targetSection) return;

    // Create Section Container
    const composerSection = document.createElement('section');
    composerSection.className = 'composer-section';
    composerSection.id = 'attachment-composer';

    // Inject HTML layout Structure
    composerSection.innerHTML = `
        <div class="section-headline">
            <div>
                <p style="text-transform: uppercase; font-size: 11px; font-weight: 800; color: var(--accent-cyan); letter-spacing: 2px;">Asset Delivery Framework</p>
                <h2 style="margin-top: 5px;">Secure <span>Attachment Composer</span></h2>
            </div>
            <p style="color: var(--text-secondary); max-width: 450px; font-size: 14px; text-align: right;">
                Upload, order, and describe up to 3 funding support packages. Set target dispatch credentials, dynamic access passwords, and strict TTL expiries.
            </p>
        </div>

        <div class="composer-grid">
            <!-- Left Side: Attachment Arranger & Description -->
            <div class="composer-panel" style="position: relative;">
                <!-- Sending Progress Overlay -->
                <div class="send-overlay" id="send-overlay">
                    <div class="progress-box" id="active-progress-box">
                        <div class="progress-status-lbl" id="progress-lbl">Compiling Dispatch</div>
                        <div class="progress-bar-container">
                            <div class="progress-bar-fill" id="progress-bar"></div>
                        </div>
                        <div class="progress-step" id="progress-step">Preparing local variables...</div>
                    </div>
                    
                    <div class="success-box" id="secure-success-box">
                        <div class="success-icon">🖲️</div>
                        <div class="success-title">Dispatch Structured</div>
                        <p style="font-size:13px; color:var(--text-secondary); max-width:320px; margin:0 auto;">Your compiled document payload has been secured with high-grade verification tokens.</p>
                        <div class="success-link-container">
                            <span class="secure-link-text" id="generated-secure-link">https://coreflow.io/vault/ax-94b2f8</span>
                            <button class="btn-copy" id="btn-copy-link">Copy Link</button>
                        </div>
                        <button class="btn-action" style="padding: 10px 20px; font-size: 12px; margin-top: 10px;" id="btn-reset-composer">Compose New Payload</button>
                    </div>
                </div>

                <div class="composer-header">
                    <div class="terminal-dots">
                        <div class="dot active-1"></div>
                        <div class="dot active-2"></div>
                        <div class="dot active-3"></div>
                    </div>
                    <div class="terminal-title">Attachment Queue [Max 3]</div>
                    <div class="calc-badge" id="queue-counter" style="color:var(--accent-cyan); border-color:var(--accent-cyan); background:rgba(0,240,255,0.1);">0 / 3 Items</div>
                </div>

                <div class="composer-body">
                    <!-- Dropzone -->
                    <div class="dropzone-area" id="dropzone">
                        <input type="file" id="file-input" multiple style="display: none;">
                        <div class="dropzone-icon">📥</div>
                        <div class="dropzone-title">Drag & drop files here</div>
                        <div class="dropzone-sub">or click to browse local files (PDF, JPEG, XLSX up to 10MB)</div>
                    </div>

                    <!-- Attachment List Container -->
                    <div class="attachment-list" id="attachment-list">
                        <!-- Dynamic file elements injected here -->
                    </div>
                </div>
            </div>

            <!-- Right Side: Configurer & Destination Parameters -->
            <div class="composer-panel">
                <div class="composer-header">
                    <div class="terminal-title">Secured Delivery controls</div>
                    <div class="calc-badge" style="color:var(--accent-magenta); border-color:var(--accent-magenta); background:rgba(255, 0, 122, 0.1);">Protocol V4</div>
                </div>
                
                <div class="composer-body">
                    <div class="config-group">
                        <label class="config-label">Target Recipient Address</label>
                        <input type="email" class="composer-input" id="recipient-email" placeholder="underwriting@funder-core.com" required>
                        <span style="font-size: 10px; color: var(--text-secondary); text-transform: uppercase;">Direct verification alert will be delivered instantly</span>
                    </div>

                    <!-- Password Toggle & Input -->
                    <div class="toggle-container" id="password-toggle">
                        <div class="toggle-meta">
                            <span class="toggle-title">Enforce Password Protection</span>
                            <span class="toggle-desc">Require verification password to download assets</span>
                        </div>
                        <div class="toggle-switch">
                            <div class="toggle-handle"></div>
                        </div>
                    </div>

                    <div class="config-group" id="password-input-group" style="display: none; transform: translateY(-5px); transition: all 0.2s ease;">
                        <label class="config-label">Set Access Keypass</label>
                        <input type="password" class="composer-input" id="vault-password" placeholder="••••••••" style="border-color: var(--accent-magenta);">
                    </div>

                    <!-- Expiry Select -->
                    <div class="config-group" style="margin-bottom: 30px;">
                        <label class="config-label">Strict Access Expiry TTL</label>
                        <div class="time-options" id="expiry-btn-group">
                            <button class="time-btn active" data-expiry="1h">1 Hour</button>
                            <button class="time-btn" data-expiry="24h">24 Hours</button>
                            <button class="time-btn" data-expiry="7d">7 Days</button>
                            <button class="time-btn" data-expiry="never">Never</button>
                        </div>
                    </div>

                    <!-- Send Action -->
                    <button class="btn-action" id="btn-dispatch-package" style="width: 100%; text-align: center; padding: 18px; font-size: 16px; background: var(--accent-magenta); box-shadow: 5px 5px 0px #000;">
                        Secure Package & Dispatch
                    </button>
                </div>
            </div>
        </div>
    `;

    // Mount Component dynamically
    targetSection.parentNode.insertBefore(composerSection, targetSection);

    // Interactive JavaScript Logic
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('file-input');
    const attachmentList = document.getElementById('attachment-list');
    const queueCounter = document.getElementById('queue-counter');
    const recipientEmail = document.getElementById('recipient-email');
    const passwordToggle = document.getElementById('password-toggle');
    const passwordInputGroup = document.getElementById('password-input-group');
    const vaultPassword = document.getElementById('vault-password');
    const expiryBtnGroup = document.getElementById('expiry-btn-group');
    const btnDispatch = document.getElementById('btn-dispatch-package');
    const sendOverlay = document.getElementById('send-overlay');
    const progressBar = document.getElementById('progress-bar');
    const progressLbl = document.getElementById('progress-lbl');
    const progressStep = document.getElementById('progress-step');
    const activeProgressBox = document.getElementById('active-progress-box');
    const secureSuccessBox = document.getElementById('secure-success-box');
    const generatedSecureLink = document.getElementById('generated-secure-link');
    const btnCopyLink = document.getElementById('btn-copy-link');
    const btnResetComposer = document.getElementById('btn-reset-composer');

    // State Variables
    let filesArr = [];
    let isPasswordEnabled = false;
    let selectedExpiry = '1h';

    // Helper: Toast Trigger Interface
    function triggerAppToast(text) {
        if (typeof showNotification === 'function') {
            showNotification(text);
        } else {
            // Fallback inside document context
            const toastElement = document.getElementById('toast');
            const toastTextElement = document.getElementById('toast-text');
            if (toastElement && toastTextElement) {
                toastTextElement.innerText = text;
                toastElement.classList.add('visible');
                setTimeout(() => {
                    toastElement.classList.remove('visible');
                }, 3000);
            }
        }
    }

    // Dropzone Event Listeners
    dropzone.addEventListener('click', () => fileInput.click());
    
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        handleSelectedFiles(e.dataTransfer.files);
    });

    fileInput.addEventListener('change', (e) => {
        handleSelectedFiles(e.target.files);
    });

    // File Management Processors
    function handleSelectedFiles(filesList) {
        if (filesArr.length >= 3) {
            triggerAppToast('Maximum of 3 attachment allocations achieved.');
            return;
        }

        const remainingSlots = 3 - filesArr.length;
        const filesToProcess = Array.from(filesList).slice(0, remainingSlots);

        filesToProcess.forEach(file => {
            const fileObj = {
                id: Date.now() + Math.random().toString(36).substring(2, 9),
                fileData: file,
                name: file.name,
                size: formatFileSize(file.size),
                description: ''
            };
            filesArr.push(fileObj);
        });

        renderFiles();
        triggerAppToast(`Added ${filesToProcess.length} attachment(s) to composer.`);
        
        // Reset file input element so same file can be loaded again if deleted
        fileInput.value = '';
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = 1;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    function renderFiles() {
        attachmentList.innerHTML = '';
        
        // Update Counter indicator
        queueCounter.innerText = `${filesArr.length} / 3 Items`;
        if (filesArr.length >= 3) {
            dropzone.style.opacity = '0.4';
            dropzone.style.pointerEvents = 'none';
        } else {
            dropzone.style.opacity = '1';
            dropzone.style.pointerEvents = 'auto';
        }

        filesArr.forEach((fileObj, index) => {
            const item = document.createElement('div');
            item.className = 'attachment-item';
            item.setAttribute('data-id', fileObj.id);

            item.innerHTML = `
                <div class="attachment-meta-row">
                    <div class="attachment-details">
                        <span class="attachment-index">${index + 1}</span>
                        <span class="attachment-name" title="${fileObj.name}">${fileObj.name}</span>
                        <span class="attachment-size">${fileObj.size}</span>
                    </div>
                    <div class="attachment-actions">
                        <button class="action-icon-btn move-up" title="Move Up" ${index === 0 ? 'disabled style="opacity: 0.3; pointer-events: none;"' : ''}>▲</button>
                        <button class="action-icon-btn move-down" title="Move Down" ${index === filesArr.length - 1 ? 'disabled style="opacity: 0.3; pointer-events: none;"' : ''}>▼</button>
                        <button class="action-icon-btn delete-btn" title="Remove attachment">✕</button>
                    </div>
                </div>
                <input type="text" class="attachment-desc-input" placeholder="Define clear scope of this attachment asset (e.g. 3 Months business bank statements)..." value="${fileObj.description}">
            `;

            // Setup internal elements listeners
            const moveUpBtn = item.querySelector('.move-up');
            const moveDownBtn = item.querySelector('.move-down');
            const deleteBtn = item.querySelector('.delete-btn');
            const descInput = item.querySelector('.attachment-desc-input');

            moveUpBtn.addEventListener('click', () => moveIndex(index, index - 1));
            moveDownBtn.addEventListener('click', () => moveIndex(index, index + 1));
            deleteBtn.addEventListener('click', () => removeAttachment(fileObj.id));
            
            descInput.addEventListener('input', (e) => {
                fileObj.description = e.target.value;
            });

            attachmentList.appendChild(item);
        });
    }

    function removeAttachment(id) {
        filesArr = filesArr.filter(file => file.id !== id);
        renderFiles();
        triggerAppToast('Attachment slice removed from active queue.');
    }

    function moveIndex(fromIndex, toIndex) {
        if (toIndex < 0 || toIndex >= filesArr.length) return;
        const temp = filesArr[fromIndex];
        filesArr[fromIndex] = filesArr[toIndex];
        filesArr[toIndex] = temp;
        renderFiles();
    }

    // Toggle Button Control
    passwordToggle.addEventListener('click', () => {
        isPasswordEnabled = !isPasswordEnabled;
        if (isPasswordEnabled) {
            passwordToggle.classList.add('active');
            passwordInputGroup.style.display = 'flex';
            vaultPassword.focus();
        } else {
            passwordToggle.classList.remove('active');
            passwordInputGroup.style.display = 'none';
            vaultPassword.value = '';
        }
    });

    // Expiry TTL Option click handler
    expiryBtnGroup.querySelectorAll('.time-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            expiryBtnGroup.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedExpiry = btn.getAttribute('data-expiry');
        });
    });

    // Dispatch Secure Process Mock Engine
    btnDispatch.addEventListener('click', () => {
        // Form Validations
        if (filesArr.length === 0) {
            triggerAppToast('Add at least 1 file attachment before secure package routing.');
            return;
        }

        const emailVal = recipientEmail.value.trim();
        if (!emailVal || !validateEmail(emailVal)) {
            triggerAppToast('Valid target recipient email structure is required.');
            recipientEmail.focus();
            return;
        }

        if (isPasswordEnabled && !vaultPassword.value.trim()) {
            triggerAppToast('Please enter an access keypass to secure your attachments.');
            vaultPassword.focus();
            return;
        }

        // Start dynamic visual simulation
        initiateDispatchSequence(emailVal);
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function initiateDispatchSequence(recipient) {
        sendOverlay.classList.add('visible');
        activeProgressBox.style.display = 'block';
        secureSuccessBox.style.display = 'none';

        const stages = [
            { pct: 15, lbl: 'Analyzing Parameters', step: 'Verifying files sizes and target descriptors...' },
            { pct: 35, lbl: 'Asset Compiler Phase', step: `Packing ${filesArr.length} asset allocation buffers...` },
            { pct: 60, lbl: 'Assembling Secure Envelope', step: 'Injecting access protocols and generating SHA tokens...' },
            { pct: 85, lbl: 'Distributing Dispatch Key', step: `Registering secure TLS pipelines for ${recipient}...` },
            { pct: 100, lbl: 'Transmission Standard Secured', step: 'Payload compiled successfully.' }
        ];

        let currentStageIdx = 0;
        let progress = 0;

        const interval = setInterval(() => {
            const currentStage = stages[currentStageIdx];
            if (!currentStage) {
                clearInterval(interval);
                renderSuccessState();
                return;
            }

            progress += Math.floor(Math.random() * 5) + 3;
            if (progress >= currentStage.pct) {
                progress = currentStage.pct;
                progressLbl.innerText = currentStage.lbl;
                progressStep.innerText = currentStage.step;
                currentStageIdx++;
            }

            progressBar.style.width = `${progress}%`;
        }, 80);
    }

    function renderSuccessState() {
        // Generate a cool unique cryptographic hex string for realism
        const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
        const accessCode = `cf-${randomHex}`;
        generatedSecureLink.innerText = `https://coreflow.io/vault/${accessCode}`;
        
        // Switch views in overlay
        activeProgressBox.style.display = 'none';
        secureSuccessBox.style.display = 'block';
        triggerAppToast('Encrypted dispatch package published safely.');
    }

    // Link Copy Action
    btnCopyLink.addEventListener('click', () => {
        const textToCopy = generatedSecureLink.innerText;
        navigator.clipboard.writeText(textToCopy).then(() => {
            const prevText = btnCopyLink.innerText;
            btnCopyLink.innerText = 'Copied!';
            btnCopyLink.style.background = 'var(--accent-lime)';
            btnCopyLink.style.color = '#000';
            setTimeout(() => {
                btnCopyLink.innerText = prevText;
                btnCopyLink.style.background = 'var(--accent-cyan)';
            }, 2000);
        }).catch(err => {
            triggerAppToast('Failed to write package link to clipboard.');
        });
    });

    // Reset Workspace Action
    btnResetComposer.addEventListener('click', () => {
        // Clean Workspace States
        filesArr = [];
        renderFiles();
        recipientEmail.value = '';
        vaultPassword.value = '';
        if (isPasswordEnabled) {
            passwordToggle.click(); // resets toggle switch state
        }
        
        // Hide Sending Overlay
        progressBar.style.width = '0%';
        sendOverlay.classList.remove('visible');
        triggerAppToast('Composer initialized. Create new secured document packages.');
    });
});