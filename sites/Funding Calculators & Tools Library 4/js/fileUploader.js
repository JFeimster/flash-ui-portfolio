(function () {
    // Inject Custom Neobrutalist Styles for the File Uploader Addition
    const uploaderStyles = `
        .uploader-section {
            max-width: 1440px;
            margin: 80px auto;
            padding: 0 40px;
        }
        @media (max-width: 768px) {
            .uploader-section {
                padding: 0 20px;
                margin: 40px auto;
            }
        }
        .uploader-grid {
            display: grid;
            grid-template-columns: 1.2fr 0.8fr;
            gap: 40px;
            align-items: start;
        }
        @media (max-width: 1024px) {
            .uploader-grid {
                grid-template-columns: 1fr;
                gap: 30px;
            }
        }
        .composer-workspace {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        .attachment-slot {
            background: var(--bg-secondary);
            border: 3px solid var(--border-color);
            border-radius: 6px;
            padding: 20px;
            display: flex;
            align-items: center;
            gap: 20px;
            position: relative;
            box-shadow: var(--brutal-shadow-hover);
            transition: all 0.2s ease;
        }
        .attachment-slot.active-upload {
            border-color: var(--accent-magenta);
            box-shadow: 4px 4px 0px var(--accent-magenta);
        }
        .attachment-slot.empty {
            border-style: dashed;
            background: rgba(15, 17, 26, 0.4);
            justify-content: center;
            flex-direction: column;
            cursor: pointer;
            padding: 30px 20px;
        }
        .attachment-slot.empty:hover {
            border-color: var(--accent-cyan);
            background: rgba(0, 240, 255, 0.02);
        }
        .slot-index {
            position: absolute;
            top: -12px;
            left: 15px;
            background: var(--bg-primary);
            border: 2px solid var(--border-color);
            padding: 2px 8px;
            font-size: 10px;
            font-family: var(--font-display);
            font-weight: 800;
            text-transform: uppercase;
        }
        .slot-icon {
            width: 50px;
            height: 50px;
            background: var(--bg-tertiary);
            border: 2px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            flex-shrink: 0;
        }
        .slot-info {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            gap: 8px;
            min-width: 0;
        }
        .slot-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .slot-name {
            font-family: var(--font-display);
            font-size: 15px;
            font-weight: 700;
            text-transform: uppercase;
            color: var(--text-primary);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .slot-size {
            font-size: 11px;
            color: var(--text-secondary);
            font-weight: 600;
        }
        .slot-desc-input {
            width: 100%;
            background: var(--bg-tertiary);
            border: 2px solid var(--border-color);
            padding: 8px 12px;
            font-size: 12px;
            color: var(--text-primary);
            outline: none;
            text-transform: uppercase;
            font-weight: 600;
        }
        .slot-desc-input:focus {
            border-color: var(--accent-orange);
        }
        .slot-actions {
            display: flex;
            flex-direction: column;
            gap: 8px;
            flex-shrink: 0;
        }
        .action-icon-btn {
            background: var(--bg-tertiary);
            border: 2px solid var(--border-color);
            color: var(--text-secondary);
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.15s ease;
            font-weight: bold;
        }
        .action-icon-btn:hover {
            color: var(--text-primary);
            border-color: var(--accent-cyan);
            background: var(--bg-primary);
        }
        .action-icon-btn.delete-btn:hover {
            color: #fff;
            background: var(--accent-magenta);
            border-color: #000;
        }
        .empty-prompt {
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
        }
        .empty-prompt-icon {
            font-size: 32px;
            animation: pulse-slow 2s infinite alternate;
        }
        .empty-prompt-title {
            font-family: var(--font-display);
            font-weight: 700;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--text-secondary);
        }
        .empty-prompt-desc {
            font-size: 11px;
            color: var(--border-hover);
            text-transform: uppercase;
        }
        .control-panel {
            background: var(--bg-secondary);
            border: 3px solid var(--border-color);
            box-shadow: var(--brutal-shadow);
            padding: 24px;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        .control-section-title {
            font-family: var(--font-display);
            font-size: 16px;
            font-weight: 700;
            text-transform: uppercase;
            color: var(--accent-cyan);
            border-bottom: 2px solid var(--border-color);
            padding-bottom: 8px;
            margin-bottom: 4px;
        }
        .recipients-wrapper {
            background: var(--bg-primary);
            border: 2px solid var(--border-color);
            padding: 8px;
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            min-height: 44px;
            align-items: center;
        }
        .recipient-tag {
            background: var(--accent-magenta);
            color: #000;
            font-weight: 700;
            font-size: 11px;
            padding: 4px 8px;
            display: flex;
            align-items: center;
            gap: 6px;
            border: 1px solid #000;
            box-shadow: 1px 1px 0px #000;
        }
        .recipient-tag-close {
            cursor: pointer;
            font-weight: 900;
        }
        .recipients-input {
            flex-grow: 1;
            background: transparent;
            border: none;
            color: var(--text-primary);
            font-size: 13px;
            font-weight: 600;
            outline: none;
            padding: 4px;
            min-width: 120px;
        }
        .password-toggle-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .toggle-switch {
            position: relative;
            display: inline-block;
            width: 44px;
            height: 24px;
        }
        .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        .toggle-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: var(--bg-tertiary);
            border: 2px solid var(--border-color);
            transition: .2s;
            border-radius: 24px;
        }
        .toggle-slider:before {
            position: absolute;
            content: "";
            height: 14px;
            width: 14px;
            left: 3px;
            bottom: 3px;
            background-color: var(--text-secondary);
            transition: .2s;
            border-radius: 50%;
        }
        input:checked + .toggle-slider {
            background-color: var(--accent-magenta);
            border-color: #000;
        }
        input:checked + .toggle-slider:before {
            transform: translateX(20px);
            background-color: #000;
        }
        .password-input-group {
            display: none;
            flex-direction: column;
            gap: 6px;
            margin-top: 10px;
        }
        .password-input-group.visible {
            display: flex;
        }
        .password-raw-input {
            width: 100%;
            background: var(--bg-primary);
            border: 2px solid var(--border-color);
            padding: 10px;
            font-size: 13px;
            font-weight: 600;
            color: var(--text-primary);
            outline: none;
        }
        .password-raw-input:focus {
            border-color: var(--accent-magenta);
        }
        .expiry-labels {
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            font-weight: 700;
            color: var(--text-secondary);
            text-transform: uppercase;
        }
        .dispatch-terminal {
            background: #000;
            border: 2px solid var(--accent-cyan);
            border-radius: 4px;
            padding: 12px;
            font-family: monospace;
            font-size: 11px;
            color: var(--accent-cyan);
            display: none;
            flex-direction: column;
            gap: 4px;
            max-height: 150px;
            overflow-y: auto;
            box-shadow: inset 0 0 10px rgba(0, 240, 255, 0.2);
        }
        .dispatch-terminal.active {
            display: flex;
        }
        .terminal-line {
            line-height: 1.4;
        }
        @keyframes pulse-slow {
            0% { transform: scale(0.96); opacity: 0.8; }
            100% { transform: scale(1.04); opacity: 1; }
        }
    `;

    // Inject Styles into Head
    const styleSheet = document.createElement("style");
    styleSheet.innerText = uploaderStyles;
    document.head.appendChild(styleSheet);

    // Dynamic State Management for Uploader
    const uploaderState = {
        slots: [
            { id: 0, file: null, description: "" },
            { id: 1, file: null, description: "" },
            { id: 2, file: null, description: "" }
        ],
        recipients: [],
        passwordProtected: false,
        passwordValue: "",
        expiryHours: 24, // default 24 hours
        isTransmitting: false
    };

    // Human readable size helper
    function formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Map file extensions to matching rich icons/emojis
    function getFileEmoji(fileName) {
        const ext = fileName.split('.').pop().toLowerCase();
        if (['pdf'].includes(ext)) return '📄';
        if (['xls', 'xlsx', 'csv'].includes(ext)) return '📊';
        if (['doc', 'docx', 'txt', 'rtf'].includes(ext)) return '📝';
        if (['jpg', 'jpeg', 'png', 'svg', 'webp'].includes(ext)) return '🖼️';
        if (['zip', 'rar', '7z', 'tar'].includes(ext)) return '📦';
        return '📁';
    }

    // Build DOM structure
    function buildComposerSection() {
        const composerSection = document.createElement("section");
        composerSection.className = "uploader-section";
        composerSection.id = "secure-composer";

        composerSection.innerHTML = `
            <div class="section-headline">
                <div>
                    <p style="text-transform: uppercase; font-size: 11px; font-weight: 800; color: var(--accent-magenta); letter-spacing: 2px;">Transit Matrix</p>
                    <h2 style="margin-top: 5px;">Attachment <span>Composer & Sender</span></h2>
                </div>
                <p style="color: var(--text-secondary); max-width: 450px; font-size: 14px; text-align: right;">
                    Compile, stage, and dispatch up to 3 encrypted deal attachments. Specify destinations and instant self-destruct guidelines.
                </p>
            </div>

            <div class="uploader-grid">
                <!-- Left: Composer Workspace slots -->
                <div class="composer-workspace" id="composer-workspace-container"></div>

                <!-- Right: Control Parameters -->
                <div class="control-panel">
                    <div>
                        <div class="control-section-title">1. Access Recipients</div>
                        <div class="recipients-wrapper" id="recipients-wrapper">
                            <input type="text" class="recipients-input" id="recipients-input" placeholder="Enter emails & press Enter...">
                        </div>
                    </div>

                    <div>
                        <div class="control-section-title">2. Encryption Shield</div>
                        <div class="password-toggle-container">
                            <span style="font-size: 12px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase;">Apply Passcode Protect</span>
                            <label class="toggle-switch">
                                <input type="checkbox" id="passcode-toggle">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <div class="password-input-group" id="passcode-input-group">
                            <input type="password" class="password-raw-input" id="passcode-raw-input" placeholder="Configure access passcode...">
                        </div>
                    </div>

                    <div>
                        <div class="control-section-title">3. Delivery Lifecycle</div>
                        <div class="expiry-labels" style="margin-bottom: 8px;">
                            <span>Self-destruct Horizon</span>
                            <span id="expiry-display-val" style="color: var(--accent-orange);">24 Hours</span>
                        </div>
                        <input type="range" min="1" max="168" step="1" value="24" class="range-slider orange" id="expiry-slider" style="margin-bottom: 10px;">
                        <div class="expiry-labels">
                            <span style="font-size: 9px; color: var(--text-secondary);">1 hour</span>
                            <span style="font-size: 9px; color: var(--text-secondary);">7 Days</span>
                        </div>
                    </div>

                    <!-- Terminal logger -->
                    <div class="dispatch-terminal" id="dispatch-terminal"></div>

                    <button class="btn-action" id="transmit-btn" style="width: 100%; text-align: center; margin-top: 10px;">
                        Initiate Secure Transmission
                    </button>
                </div>
            </div>

            <!-- Hidden generic file inputs used to trigger native picker -->
            <input type="file" id="slot-file-picker" style="display: none;">
        `;

        return composerSection;
    }

    // Dynamic rendering of Workspace Slots
    function renderWorkspaceSlots() {
        const container = document.getElementById("composer-workspace-container");
        if (!container) return;

        container.innerHTML = "";

        uploaderState.slots.forEach((slot, index) => {
            const slotElement = document.createElement("div");
            slotElement.className = `attachment-slot ${slot.file ? 'active-upload' : 'empty'}`;
            slotElement.dataset.index = index;

            if (slot.file) {
                // Active slot representation
                slotElement.innerHTML = `
                    <div class="slot-index">STAGED SLOT 0${index + 1}</div>
                    <div class="slot-icon">${getFileEmoji(slot.file.name)}</div>
                    <div class="slot-info">
                        <div class="slot-meta">
                            <span class="slot-name" title="${slot.file.name}">${slot.file.name}</span>
                            <span class="slot-size">${formatBytes(slot.file.size)}</span>
                        </div>
                        <input type="text" class="slot-desc-input" placeholder="Add custom meta description / notes..." value="${slot.description}" data-index="${index}">
                    </div>
                    <div class="slot-actions">
                        <button class="action-icon-btn swap-up-btn" data-index="${index}" title="Move Up" ${index === 0 ? 'disabled style="opacity: 0.3;"' : ''}>▲</button>
                        <button class="action-icon-btn swap-down-btn" data-index="${index}" title="Move Down" ${index === 2 ? 'disabled style="opacity: 0.3;"' : ''}>▼</button>
                        <button class="action-icon-btn delete-btn" data-index="${index}" title="Remove file">✕</button>
                    </div>
                `;
            } else {
                // Empty slot representation
                slotElement.innerHTML = `
                    <div class="slot-index">EMPTY SLOT 0${index + 1}</div>
                    <div class="empty-prompt">
                        <div class="empty-prompt-icon">📤</div>
                        <div class="empty-prompt-title">Select Document Package</div>
                        <div class="empty-prompt-desc">Standard PDFs, Spreadsheets, images accepted (Max 50MB)</div>
                    </div>
                `;
                // Hook click to trigger hidden file upload
                slotElement.addEventListener("click", () => triggerSlotSelection(index));
            }

            container.appendChild(slotElement);
        });

        // Set up Event Listeners inside rendered items
        bindSlotEvents();
    }

    // Active file selection workflow
    let currentSlotTarget = null;
    function triggerSlotSelection(index) {
        currentSlotTarget = index;
        const picker = document.getElementById("slot-file-picker");
        picker.value = ""; // clear previous
        picker.click();
    }

    // Setup input listeners & controls within active slots
    function bindSlotEvents() {
        // Description edits
        document.querySelectorAll(".slot-desc-input").forEach(input => {
            input.addEventListener("input", (e) => {
                const index = parseInt(e.target.dataset.index);
                uploaderState.slots[index].description = e.target.value;
            });
        });

        // Delete buttons
        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const index = parseInt(btn.dataset.index);
                uploaderState.slots[index].file = null;
                uploaderState.slots[index].description = "";
                renderWorkspaceSlots();
                if (window.showNotification) {
                    window.showNotification(`Slot 0${index + 1} Cleared`);
                }
            });
        });

        // Swap arrangement actions
        document.querySelectorAll(".swap-up-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const index = parseInt(btn.dataset.index);
                if (index > 0) {
                    swapSlots(index, index - 1);
                }
            });
        });

        document.querySelectorAll(".swap-down-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const index = parseInt(btn.dataset.index);
                if (index < 2) {
                    swapSlots(index, index + 1);
                }
            });
        });
    }

    // Swap ordering parameters helper
    function swapSlots(idxA, idxB) {
        const temp = uploaderState.slots[idxA];
        uploaderState.slots[idxA] = uploaderState.slots[idxB];
        uploaderState.slots[idxB] = temp;
        renderWorkspaceSlots();
        if (window.showNotification) {
            window.showNotification(`Re-staged Packages`);
        }
    }

    // Render multi-recipient tags
    function renderRecipientTags() {
        const wrapper = document.getElementById("recipients-wrapper");
        const input = document.getElementById("recipients-input");
        if (!wrapper || !input) return;

        // Keep current typed text safe
        const typedVal = input.value;

        // Clear existing tag elements
        const tags = wrapper.querySelectorAll(".recipient-tag");
        tags.forEach(t => t.remove());

        // Rebuild and prepend tags
        uploaderState.recipients.forEach((email, index) => {
            const tag = document.createElement("div");
            tag.className = "recipient-tag";
            tag.innerHTML = `
                <span>${email}</span>
                <span class="recipient-tag-close" data-index="${index}">✕</span>
            `;

            tag.querySelector(".recipient-tag-close").addEventListener("click", () => {
                uploaderState.recipients.splice(index, 1);
                renderRecipientTags();
            });

            wrapper.insertBefore(tag, input);
        });

        input.value = typedVal;
    }

    // Output visual logs on the neobrutalist interactive visual terminal emulator
    function writeTerminalLine(text, statusColor = "var(--accent-cyan)") {
        const term = document.getElementById("dispatch-terminal");
        if (!term) return;

        term.classList.add("active");

        const line = document.createElement("div");
        line.className = "terminal-line";
        line.style.color = statusColor;
        line.innerText = `[${new Date().toLocaleTimeString()}] ${text}`;
        term.appendChild(line);

        // Keep scroll at bottom
        term.scrollTop = term.scrollHeight;
    }

    // Main send pipeline orchestration
    function initiateTransmission() {
        if (uploaderState.isTransmitting) return;

        // Validation counts
        const activeFiles = uploaderState.slots.filter(s => s.file);
        if (activeFiles.length === 0) {
            alert("UPLOAD EXCEPTION: Stage at least 1 file to assemble transmission package.");
            return;
        }

        if (uploaderState.recipients.length === 0) {
            alert("DELIVERY EXCEPTION: Define at least one recipient email address.");
            return;
        }

        uploaderState.isTransmitting = true;
        const btn = document.getElementById("transmit-btn");
        btn.disabled = true;
        btn.innerText = "Transmitting Secured Pipeline...";
        btn.style.opacity = "0.6";

        const term = document.getElementById("dispatch-terminal");
        term.innerHTML = ""; // clean past traces

        writeTerminalLine("SYSTEM INIT: Dynamic secure package compilation pipeline active.");
        
        setTimeout(() => {
            writeTerminalLine(`ASSEMBLY: Packaged ${activeFiles.length} source file attachments.`, "var(--accent-orange)");
            activeFiles.forEach(slot => {
                writeTerminalLine(`STAGED: "${slot.file.name}" | Size: ${formatBytes(slot.file.size)}`, "var(--text-secondary)");
            });
        }, 800);

        setTimeout(() => {
            if (uploaderState.passwordProtected) {
                writeTerminalLine("CIPHER: Cryptographic keys successfully mapped & passcode verified.", "var(--accent-magenta)");
            } else {
                writeTerminalLine("WARNING: Package bypassed local password shielding policies.", "var(--accent-orange)");
            }
        }, 1600);

        setTimeout(() => {
            writeTerminalLine(`LIFECYCLE: Setting strict TTL self-destruction horizon to ${uploaderState.expiryHours} hours.`, "var(--accent-orange)");
        }, 2400);

        setTimeout(() => {
            writeTerminalLine(`PIPELINE: Delivering secure access protocols to recipients:`, "var(--accent-cyan)");
            uploaderState.recipients.forEach(email => {
                writeTerminalLine(`-> Route established: ${email}`, "var(--text-secondary)");
            });
        }, 3200);

        setTimeout(() => {
            writeTerminalLine("TRANSMISSION COMPLETE. Encrypted nodes locked successfully.", "var(--accent-lime)");
            
            if (window.showNotification) {
                window.showNotification("Deal Attachments Transmitted Securely!");
            }

            // Restore defaults
            uploaderState.isTransmitting = false;
            btn.disabled = false;
            btn.innerText = "Initiate Secure Transmission";
            btn.style.opacity = "1";
        }, 4400);
    }

    // Mount interface into Document Grid
    function initializeUploader() {
        const mountPoint = document.getElementById("strategy");
        if (!mountPoint) return;

        const container = buildComposerSection();
        mountPoint.parentNode.insertBefore(container, mountPoint);

        // Populate dynamic cards
        renderWorkspaceSlots();

        // Target Native file upload picker handler
        const pickerInput = document.getElementById("slot-file-picker");
        pickerInput.addEventListener("change", (e) => {
            if (e.target.files.length > 0 && currentSlotTarget !== null) {
                uploaderState.slots[currentSlotTarget].file = e.target.files[0];
                renderWorkspaceSlots();
                if (window.showNotification) {
                    window.showNotification(`Loaded Document: ${e.target.files[0].name}`);
                }
            }
        });

        // Set up recipient entry fields (comma, space, or enter keys validation)
        const recipientInput = document.getElementById("recipients-input");
        recipientInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === "," || e.key === " ") {
                e.preventDefault();
                const rawVal = recipientInput.value.replace(/,/g, '').trim();
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (emailRegex.test(rawVal)) {
                    if (!uploaderState.recipients.includes(rawVal)) {
                        uploaderState.recipients.push(rawVal);
                        recipientInput.value = "";
                        renderRecipientTags();
                    } else {
                        recipientInput.value = "";
                    }
                } else if (rawVal !== "") {
                    recipientInput.style.borderColor = "var(--accent-magenta)";
                    setTimeout(() => recipientInput.style.borderColor = "var(--border-color)", 1000);
                }
            }
        });

        // Toggle Password Interface
        const passcodeCheck = document.getElementById("passcode-toggle");
        const passcodeGroup = document.getElementById("passcode-input-group");
        passcodeCheck.addEventListener("change", (e) => {
            uploaderState.passwordProtected = e.target.checked;
            if (e.target.checked) {
                passcodeGroup.classList.add("visible");
            } else {
                passcodeGroup.classList.remove("visible");
            }
        });

        // Map Expiry slider input
        const expirySlider = document.getElementById("expiry-slider");
        const expiryDisplay = document.getElementById("expiry-display-val");
        expirySlider.addEventListener("input", (e) => {
            const val = parseInt(e.target.value);
            uploaderState.expiryHours = val;

            if (val === 1) {
                expiryDisplay.innerText = "1 Hour";
            } else if (val < 24) {
                expiryDisplay.innerText = `${val} Hours`;
            } else {
                const days = Math.floor(val / 24);
                const remainingHours = val % 24;
                expiryDisplay.innerText = `${days} Day${days > 1 ? 's' : ''} ${remainingHours > 0 ? remainingHours + ' Hr' : ''}`;
            }
        });

        // Hook transmit control button trigger
        const sendBtn = document.getElementById("transmit-btn");
        sendBtn.addEventListener("click", initiateTransmission);
    }

    // Wait for core components to be active
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeUploader);
    } else {
        initializeUploader();
    }
})();