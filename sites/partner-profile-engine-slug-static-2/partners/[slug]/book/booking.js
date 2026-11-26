(function() {
    // Partner Metadata Fallbacks (Extracted from URL or global configuration)
    const urlParams = new URLSearchParams(window.location.search);
    const partnerName = "[PARTNER_NAME]" === `[PARTNER_NAME]` ? "Verified Partner" : "[PARTNER_NAME]";
    const partnerCompany = "[PARTNER_COMPANY]" === `[PARTNER_COMPANY]` ? "Moonshine Capital Affiliate" : "[PARTNER_COMPANY]";
    const partnerEmail = "[PARTNER_EMAIL]" === `[PARTNER_EMAIL]` ? "underwriting@moonshine.capital" : "[PARTNER_EMAIL]";
    
    // Inject custom styling variables and animations
    const styleTag = document.createElement('style');
    styleTag.textContent = `
        @keyframes slideIn {
            from { transform: translateY(15px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-in {
            animation: slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .neo-shadow-flat-green { box-shadow: 4px 4px 0px 0px #00E676; }
        .neo-shadow-flat-orange { box-shadow: 4px 4px 0px 0px #FF6D00; }
        .neo-shadow-flat-blue { box-shadow: 4px 4px 0px 0px #2979FF; }
        .neo-shadow-flat-black { box-shadow: 4px 4px 0px 0px #1E1E1E; }
        .neo-shadow-flat-white { box-shadow: 4px 4px 0px 0px #F4F3EF; }
    `;
    document.head.appendChild(styleTag);

    // Dynamic State Management
    const AppState = {
        step: 1, // 1: Agenda, 2: Date/Time, 3: Details Intake, 4: Confirmation / Prep
        agendas: [
            {
                id: 'alignment',
                title: '15-Min Quick Alignment',
                duration: 15,
                badge: 'HIGH EFFICIENCY',
                colorClass: 'electricgreen',
                desc: 'Quick parameters validation and eligibility pre-check. Ideal for fast-tracking direct routing.',
                deliverables: ['Underwriter routing pathway options', 'Instant verification checklist']
            },
            {
                id: 'audit',
                title: '30-Min Document Review',
                duration: 30,
                badge: 'RECOMMENDED',
                colorClass: 'cobaltblue',
                desc: 'Live screen-share document evaluation. Ideal for audit prep before submission to funding desks.',
                deliverables: ['Bank statements health audit', 'Corporate identity validation check']
            },
            {
                id: 'structuring',
                title: '45-Min Capital Structuring',
                duration: 45,
                badge: 'COMPLEX NEEDS',
                colorClass: 'signalorange',
                desc: 'Deep strategy build for multi-tier projects, equipment acquisition, or structured real estate financing.',
                deliverables: ['Custom multi-lane capital strategy blueprint', 'Custom parameter matching review']
            }
        ],
        selectedAgenda: null,
        selectedDate: null,
        selectedTime: null,
        formData: {
            fullName: '',
            businessName: '',
            email: '',
            phone: '',
            revenue: '10to50k',
            notes: ''
        },
        checklistState: {
            bankStatements: false,
            einCert: false,
            idDoc: false
        }
    };

    // Helper: Generate next 6 viable business days (excluding Sunday)
    function generateAvailableDays() {
        const days = [];
        const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        let current = new Date();
        
        while (days.length < 6) {
            current.setDate(current.getDate() + 1);
            if (current.getDay() !== 0) { // Exclude Sundays
                days.push({
                    raw: new Date(current),
                    dayLabel: daysOfWeek[current.getDay()],
                    monthLabel: months[current.getMonth()],
                    dateLabel: current.getDate(),
                    slotsAvailable: Math.floor(Math.random() * 4) + 2 // 2 to 5 random slots
                });
            }
        }
        return days;
    }

    // Generate dynamic timeslots based on agenda duration
    function generateTimeSlots(dateObj) {
        if (!dateObj) return [];
        const daySeed = dateObj.getDate();
        const templates = [
            { time: '09:30 AM', zone: 'EST', status: 'Available' },
            { time: '10:45 AM', zone: 'EST', status: 'Available' },
            { time: '11:15 AM', zone: 'EST', status: 'Last Slot' },
            { time: '01:30 PM', zone: 'EST', status: 'Available' },
            { time: '02:45 PM', zone: 'EST', status: 'Available' },
            { time: '04:15 PM', zone: 'EST', status: 'Last Slot' }
        ];
        
        // Filter elements deterministically to simulate varying daily schedules
        return templates.filter((_, idx) => (daySeed + idx) % 2 === 0 || (daySeed + idx) % 3 === 0);
    }

    const availableDays = generateAvailableDays();

    // DOM Mountpoint setup
    let rootContainer = document.getElementById('booking-container');
    if (!rootContainer) {
        rootContainer = document.createElement('div');
        rootContainer.id = 'booking-container';
        rootContainer.className = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12';
        document.body.appendChild(rootContainer);
    }

    // Main Renderer
    function renderScheduler() {
        rootContainer.innerHTML = '';
        
        // App Layout Frame
        const containerFrame = document.createElement('div');
        containerFrame.className = 'bg-matteblack border-4 border-graphitegray grid grid-cols-1 lg:grid-cols-12 min-h-[640px] neo-shadow-flat-black text-bonewhite animate-slide-in';
        
        // Left Column: Interactive Navigation & Booking Details Sidebar
        const sidebar = document.createElement('div');
        sidebar.className = 'lg:col-span-4 bg-graphitegray p-8 border-b-4 lg:border-b-0 lg:border-r-4 border-zinc-800 flex flex-col justify-between';
        sidebar.appendChild(renderSidebarContent());

        // Right Column: Interactive Step Area
        const stepArea = document.createElement('div');
        stepArea.className = 'lg:col-span-8 p-6 sm:p-10 flex flex-col justify-between bg-zinc-950';
        stepArea.appendChild(renderStepContent());

        containerFrame.appendChild(sidebar);
        containerFrame.appendChild(stepArea);
        rootContainer.appendChild(containerFrame);
    }

    // Sidebar View Generator
    function renderSidebarContent() {
        const frag = document.createDocumentFragment();

        // Header / Identity
        const topBlock = document.createElement('div');
        topBlock.className = 'space-y-6';
        
        const hostBadge = document.createElement('div');
        hostBadge.className = 'inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 font-mono text-[11px] text-zinc-400 uppercase tracking-widest';
        hostBadge.innerHTML = `
            <span class="inline-block w-2 h-2 bg-electricgreen rounded-full"></span>
            <span>SECURE SECURE CHANNELS</span>
        `;
        
        const mainTitle = document.createElement('h2');
        mainTitle.className = 'font-display font-extrabold text-2xl tracking-tight text-white uppercase leading-none';
        mainTitle.innerHTML = `TACTICAL CALL<br><span class="text-electricgreen">SCHEDULER</span>`;
        
        const hostMeta = document.createElement('div');
        hostMeta.className = 'border-t border-zinc-800 pt-4 mt-4 space-y-2';
        hostMeta.innerHTML = `
            <p class="font-mono text-[10px] text-zinc-500 uppercase leading-none">STRATEGIC CAPITAL DESK</p>
            <p class="font-sans font-bold text-white text-base leading-none">${partnerName}</p>
            <p class="font-mono text-xs text-zinc-400">${partnerCompany}</p>
        `;

        topBlock.appendChild(hostBadge);
        topBlock.appendChild(mainTitle);
        topBlock.appendChild(hostMeta);

        // Active State Summary Widget
        if (AppState.selectedAgenda || AppState.selectedDate) {
            const summaryWidget = document.createElement('div');
            summaryWidget.className = 'mt-8 border-2 border-dashed border-zinc-800 p-4 bg-zinc-900/40 space-y-3 font-mono text-xs';
            summaryWidget.innerHTML = `<p class="text-[10px] text-zinc-500 uppercase tracking-wider">LIVE BOOKING CONFIG</p>`;
            
            if (AppState.selectedAgenda) {
                summaryWidget.innerHTML += `
                    <div class="flex justify-between border-b border-zinc-800/60 pb-2">
                        <span class="text-zinc-400">AGEND_</span>
                        <span class="text-white font-bold text-right">${AppState.selectedAgenda.title}</span>
                    </div>
                `;
            }
            if (AppState.selectedDate) {
                const optDateStr = AppState.selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                summaryWidget.innerHTML += `
                    <div class="flex justify-between border-b border-zinc-800/60 pb-2">
                        <span class="text-zinc-400">DATE_</span>
                        <span class="text-white font-bold">${optDateStr}</span>
                    </div>
                `;
            }
            if (AppState.selectedTime) {
                summaryWidget.innerHTML += `
                    <div class="flex justify-between pb-1">
                        <span class="text-zinc-400">TIME_</span>
                        <span class="text-electricgreen font-bold">${AppState.selectedTime}</span>
                    </div>
                `;
            }
            topBlock.appendChild(summaryWidget);
        }

        // Bottom Footer Metadata inside Sidebar
        const botBlock = document.createElement('div');
        botBlock.className = 'pt-8 border-t border-zinc-800/60 mt-12';
        botBlock.innerHTML = `
            <p class="font-mono text-[9px] text-zinc-600 leading-normal uppercase">
                SYSTEM IDENTIFIER: MC-SCHED-V1.4 // SECURE ENCRYPTED PLACEMENT TO DESK: ${partnerEmail}
            </p>
        `;

        frag.appendChild(topBlock);
        frag.appendChild(botBlock);
        return frag;
    }

    // Step View Handler
    function renderStepContent() {
        const stepWrapper = document.createElement('div');
        stepWrapper.className = 'flex flex-col justify-between h-full space-y-8';

        // Steps indicator bar
        const stepHeader = document.createElement('div');
        stepHeader.className = 'flex justify-between items-center border-b border-zinc-800 pb-4';
        
        const stepsLeft = ['Agendas', 'Calendar', 'Intake Data', 'Pre-Call Prep'];
        let stepsHTML = '';
        stepsLeft.forEach((val, idx) => {
            const stepNum = idx + 1;
            const isCompleted = AppState.step > stepNum;
            const isActive = AppState.step === stepNum;
            
            let colorClass = 'text-zinc-600';
            if (isCompleted) colorClass = 'text-electricgreen font-bold';
            if (isActive) colorClass = 'text-white border-b-2 border-white pb-4 -mb-5 font-bold';

            stepsHTML += `
                <div class="font-mono text-[10px] uppercase tracking-wider ${colorClass}">
                    ${isCompleted ? '✓' : '0' + stepNum} ${val}
                </div>
            `;
        });
        stepHeader.innerHTML = stepsHTML;
        stepWrapper.appendChild(stepHeader);

        // Central workspace content
        const stepContentBody = document.createElement('div');
        stepContentBody.className = 'py-4 flex-grow';

        switch (AppState.step) {
            case 1:
                stepContentBody.appendChild(renderStep1Agendas());
                break;
            case 2:
                stepContentBody.appendChild(renderStep2DateTime());
                break;
            case 3:
                stepContentBody.appendChild(renderStep3Intake());
                break;
            case 4:
                stepContentBody.appendChild(renderStep4Confirmation());
                break;
        }
        stepWrapper.appendChild(stepContentBody);

        // Control Panel / Action Triggers at bottom
        if (AppState.step < 4) {
            const footerControls = document.createElement('div');
            footerControls.className = 'flex justify-between items-center pt-6 border-t border-zinc-800';
            
            // Back Action button
            const backBtn = document.createElement('button');
            backBtn.className = `font-mono text-xs text-zinc-400 hover:text-white transition-colors uppercase border border-zinc-800 px-4 py-2 ${AppState.step === 1 ? 'opacity-0 cursor-not-allowed' : ''}`;
            backBtn.textContent = '← PREV STEP';
            backBtn.disabled = AppState.step === 1;
            backBtn.onclick = () => {
                if (AppState.step > 1) {
                    AppState.step--;
                    renderScheduler();
                }
            };

            // Forward Action button state logic
            const fwdBtn = document.createElement('button');
            let isStepValid = false;
            if (AppState.step === 1 && AppState.selectedAgenda) isStepValid = true;
            if (AppState.step === 2 && AppState.selectedDate && AppState.selectedTime) isStepValid = true;
            if (AppState.step === 3 && AppState.formData.fullName && AppState.formData.email && AppState.formData.phone && AppState.formData.businessName) isStepValid = true;

            fwdBtn.className = `font-mono text-xs font-bold px-6 py-3 transition-all ${
                isStepValid 
                    ? 'bg-electricgreen text-matteblack hover:bg-white neo-shadow-flat-white' 
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`;
            fwdBtn.textContent = AppState.step === 3 ? 'FINALIZE CALIBRATION' : 'CONTINUE →';
            fwdBtn.disabled = !isStepValid;
            fwdBtn.onclick = () => {
                if (isStepValid) {
                    AppState.step++;
                    renderScheduler();
                }
            };

            footerControls.appendChild(backBtn);
            footerControls.appendChild(fwdBtn);
            stepWrapper.appendChild(footerControls);
        }

        return stepWrapper;
    }

    // Render Steps logic implementation
    function renderStep1Agendas() {
        const container = document.createElement('div');
        container.className = 'space-y-6 animate-slide-in';

        const titleText = document.createElement('h3');
        titleText.className = 'font-display font-bold text-lg text-white mb-2';
        titleText.textContent = 'Select Meeting Agenda Scope';
        container.appendChild(titleText);

        AppState.agendas.forEach(agenda => {
            const isSelected = AppState.selectedAgenda && AppState.selectedAgenda.id === agenda.id;
            const item = document.createElement('div');
            
            let colorBorderClass = isSelected ? 'border-electricgreen' : 'border-zinc-800 hover:border-zinc-500';
            let shadowClass = isSelected ? 'neo-shadow-flat-green' : '';
            
            item.className = `border-2 ${colorBorderClass} bg-zinc-900/60 p-5 cursor-pointer transition-all flex flex-col sm:flex-row justify-between items-start gap-4 ${shadowClass}`;
            
            // Inside Agenda Markup
            item.innerHTML = `
                <div class="space-y-2 flex-grow">
                    <div class="flex items-center gap-3">
                        <span class="font-mono text-[9px] font-bold uppercase tracking-wider text-matteblack bg-zinc-400 px-1.5 py-0.5">${agenda.badge}</span>
                        <span class="font-mono text-[10px] text-zinc-400">⏱ ${agenda.duration} MINUTES</span>
                    </div>
                    <h4 class="font-display font-bold text-base text-white">${agenda.title}</h4>
                    <p class="text-xs text-zinc-400 leading-relaxed">${agenda.desc}</p>
                    <div class="flex flex-wrap gap-2 pt-1">
                        ${agenda.deliverables.map(deliv => `<span class="font-mono text-[9px] text-zinc-500 bg-matteblack/40 border border-zinc-800/80 px-2 py-1 rounded">✔ ${deliv}</span>`).join('')}
                    </div>
                </div>
                <div class="flex-shrink-0 self-start sm:self-center">
                    <div class="w-6 h-6 rounded-full border border-zinc-700 flex items-center justify-center bg-matteblack">
                        ${isSelected ? '<div class="w-3.5 h-3.5 rounded-full bg-electricgreen"></div>' : ''}
                    </div>
                </div>
            `;

            item.onclick = () => {
                AppState.selectedAgenda = agenda;
                renderScheduler();
            };

            container.appendChild(item);
        });

        return container;
    }

    function renderStep2DateTime() {
        const container = document.createElement('div');
        container.className = 'space-y-6 animate-slide-in';

        const titleText = document.createElement('h3');
        titleText.className = 'font-display font-bold text-lg text-white mb-1';
        titleText.textContent = 'Select Live Availability Slot';
        container.appendChild(titleText);

        const subText = document.createElement('p');
        subText.className = 'text-xs text-zinc-400 font-mono mb-4';
        subText.textContent = 'Calculated active operating window slots. Tap a date to view available hours.';
        container.appendChild(subText);

        const gridContainer = document.createElement('div');
        gridContainer.className = 'grid grid-cols-1 md:grid-cols-12 gap-6 items-start';

        // Left Side: Available Days Grid
        const daysCol = document.createElement('div');
        daysCol.className = 'md:col-span-7 grid grid-cols-3 gap-3';
        
        availableDays.forEach(day => {
            const isSelected = AppState.selectedDate && AppState.selectedDate.toDateString() === day.raw.toDateString();
            const btn = document.createElement('button');
            const stateBorder = isSelected ? 'border-electricgreen bg-zinc-900' : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-600';
            const shadowClass = isSelected ? 'neo-shadow-flat-green' : '';

            btn.className = `border-2 ${stateBorder} p-3 text-center transition-all flex flex-col justify-between items-center ${shadowClass}`;
            btn.innerHTML = `
                <span class="font-mono text-[10px] text-zinc-500">${day.dayLabel}</span>
                <span class="font-display font-black text-xl text-white my-1">${day.dateLabel}</span>
                <span class="font-mono text-[9px] text-zinc-400">${day.monthLabel}</span>
                <span class="font-mono text-[8px] text-electricgreen mt-1.5 uppercase tracking-tighter">${day.slotsAvailable} Slots</span>
            `;

            btn.onclick = () => {
                AppState.selectedDate = day.raw;
                AppState.selectedTime = null; // Reset selection on day update
                renderScheduler();
            };
            daysCol.appendChild(btn);
        });
        gridContainer.appendChild(daysCol);

        // Right Side: Available Timeslots
        const slotsCol = document.createElement('div');
        slotsCol.className = 'md:col-span-5 bg-zinc-900/40 border-2 border-dashed border-zinc-800 p-4 space-y-3 min-h-[220px] flex flex-col justify-start';
        
        if (!AppState.selectedDate) {
            slotsCol.innerHTML = `
                <div class="my-auto text-center py-12">
                    <p class="font-mono text-xs text-zinc-500">◀ SELECT DATE TO COMPUTE AVAILABLE WINDOWS</p>
                </div>
            `;
        } else {
            const optDateText = AppState.selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            slotsCol.innerHTML = `
                <div class="border-b border-zinc-800 pb-2 mb-2 flex justify-between items-center">
                    <span class="font-mono text-[10px] text-zinc-400 uppercase">SLOTS: ${optDateText}</span>
                    <span class="inline-block w-1.5 h-1.5 bg-electricgreen rounded-full status-pulse"></span>
                </div>
            `;

            const computedSlots = generateTimeSlots(AppState.selectedDate);
            computedSlots.forEach(slot => {
                const isSelected = AppState.selectedTime === slot.time;
                const slotBtn = document.createElement('button');
                
                const selectedBorder = isSelected ? 'border-electricgreen text-electricgreen bg-zinc-900' : 'border-zinc-800 hover:border-zinc-600 text-zinc-300';
                const shadowClass = isSelected ? 'neo-shadow-flat-green' : '';

                slotBtn.className = `w-full border-2 ${selectedBorder} p-3 font-mono text-xs text-left transition-all flex justify-between items-center ${shadowClass}`;
                slotBtn.innerHTML = `
                    <span class="font-bold">${slot.time} <span class="text-[9px] font-normal text-zinc-500">${slot.zone}</span></span>
                    <span class="text-[9px] uppercase tracking-wider ${slot.status === 'Last Slot' ? 'text-signalorange' : 'text-zinc-500'}">${slot.status}</span>
                `;

                slotBtn.onclick = () => {
                    AppState.selectedTime = slot.time;
                    renderScheduler();
                };
                slotsCol.appendChild(slotBtn);
            });
        }
        gridContainer.appendChild(slotsCol);
        container.appendChild(gridContainer);

        return container;
    }

    function renderStep3Intake() {
        const container = document.createElement('div');
        container.className = 'space-y-6 animate-slide-in';

        const titleText = document.createElement('h3');
        titleText.className = 'font-display font-bold text-lg text-white mb-1';
        titleText.textContent = 'Submit Intake Credentials';
        container.appendChild(titleText);

        const subText = document.createElement('p');
        subText.className = 'text-xs text-zinc-400 font-mono mb-6';
        subText.textContent = 'Required baseline indicators to configure pre-underwriting structures.';
        container.appendChild(subText);

        const form = document.createElement('div');
        form.className = 'grid grid-cols-1 sm:grid-cols-2 gap-4';

        // Helper input generator
        const makeInput = (label, id, type, value, placeholder) => {
            const block = document.createElement('div');
            block.className = 'flex flex-col space-y-1';
            block.innerHTML = `
                <label class="font-mono text-[10px] text-zinc-400 uppercase tracking-wider" for="${id}">${label}</label>
                <input type="${type}" id="${id}" placeholder="${placeholder}" class="bg-zinc-900 border border-zinc-800 focus:border-electricgreen focus:outline-none p-3 text-sm font-mono text-white placeholder-zinc-600 rounded-none transition-colors" value="${value}">
            `;
            const inp = block.querySelector('input');
            inp.oninput = (e) => {
                AppState.formData[id] = e.target.value;
            };
            return block;
        };

        form.appendChild(makeInput('Authorized Contact Person', 'fullName', 'text', AppState.formData.fullName, 'John Doe'));
        form.appendChild(makeInput('Registered Corporate Name', 'businessName', 'text', AppState.formData.businessName, 'Acme Holdings LLC'));
        form.appendChild(makeInput('Secure Work Email', 'email', 'email', AppState.formData.email, 'john@acme.com'));
        form.appendChild(makeInput('Secure Contact Direct Line', 'phone', 'tel', AppState.formData.phone, '(555) 019-2831'));

        // Monthly Revenue Selector dropdown
        const revenueBlock = document.createElement('div');
        revenueBlock.className = 'sm:col-span-2 flex flex-col space-y-1';
        revenueBlock.innerHTML = `
            <label class="font-mono text-[10px] text-zinc-400 uppercase tracking-wider" for="revenue">AVERAGE MONTHLY REVENUE LEVEL</label>
            <select id="revenue" class="bg-zinc-900 border border-zinc-800 focus:border-electricgreen focus:outline-none p-3 text-sm font-mono text-white rounded-none transition-colors">
                <option value="under10k" ${AppState.formData.revenue === 'under10k' ? 'selected' : ''}>Under $10,000 / mo</option>
                <option value="10to50k" ${AppState.formData.revenue === '10to50k' ? 'selected' : ''}>$10,000 - $50,000 / mo</option>
                <option value="over50k" ${AppState.formData.revenue === 'over50k' ? 'selected' : ''}>Over $50,000 / mo</option>
            </select>
        `;
        revenueBlock.querySelector('select').onchange = (e) => {
            AppState.formData.revenue = e.target.value;
        };
        form.appendChild(revenueBlock);

        // Core obstacle notes text area
        const notesBlock = document.createElement('div');
        notesBlock.className = 'sm:col-span-2 flex flex-col space-y-1';
        notesBlock.innerHTML = `
            <label class="font-mono text-[10px] text-zinc-400 uppercase tracking-wider" for="notes">PRIMARY FUNDING OBJECTIVE / NOTES (OPTIONAL)</label>
            <textarea id="notes" rows="3" placeholder="Explain your core requirements, target terms, or immediate operational bottlenecks..." class="bg-zinc-900 border border-zinc-800 focus:border-electricgreen focus:outline-none p-3 text-sm font-mono text-white placeholder-zinc-600 rounded-none transition-colors resize-none">${AppState.formData.notes}</textarea>
        `;
        notesBlock.querySelector('textarea').oninput = (e) => {
            AppState.formData.notes = e.target.value;
        };
        form.appendChild(notesBlock);

        container.appendChild(form);
        return container;
    }

    function renderStep4Confirmation() {
        const container = document.createElement('div');
        container.className = 'space-y-6 animate-slide-in';

        // Success terminal log header
        const successHeader = document.createElement('div');
        successHeader.className = 'bg-emerald-950/20 border-2 border-electricgreen p-5 space-y-3 neo-shadow-flat-green';
        
        const referenceCode = 'MC-CAL-' + Math.floor(Math.random() * 900000 + 100000);
        
        successHeader.innerHTML = `
            <div class="flex items-center gap-3">
                <span class="inline-block w-2.5 h-2.5 bg-electricgreen rounded-full status-pulse"></span>
                <span class="font-mono text-xs text-electricgreen font-bold uppercase tracking-widest">TACTICAL PIPELINE CALIBRATED</span>
            </div>
            <h3 class="font-display font-black text-2xl text-white tracking-tight uppercase">Call Successfully Blocked</h3>
            <p class="text-xs text-zinc-300 font-mono leading-relaxed max-w-xl">
                Secure appointment reference index verified: <span class="text-white font-bold underline decoration-electricgreen">${referenceCode}</span>. Underwriting channels matching configuration metrics for fast-track review.
            </p>
        `;
        container.appendChild(successHeader);

        // Selected Specs Summary Grid
        const optDateText = AppState.selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
        const summaryGrid = document.createElement('div');
        summaryGrid.className = 'grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-900/50 border border-zinc-800 p-4 font-mono text-xs';
        summaryGrid.innerHTML = `
            <div class="space-y-1">
                <p class="text-[9px] text-zinc-500 uppercase">APPOINTMENT TARGET</p>
                <p class="text-white font-bold">${AppState.selectedAgenda.title}</p>
                <p class="text-[10px] text-zinc-400">Duration: ${AppState.selectedAgenda.duration} Mins (Secure Audio)</p>
            </div>
            <div class="space-y-1">
                <p class="text-[9px] text-zinc-500 uppercase">DATE & TIMESTAMP</p>
                <p class="text-electricgreen font-bold">${optDateText}</p>
                <p class="text-[10px] text-white">Selected Time: ${AppState.selectedTime} EST</p>
            </div>
            <div class="sm:col-span-2 pt-2 border-t border-zinc-800 space-y-1">
                <p class="text-[9px] text-zinc-500 uppercase">ASSIGNED REPRESENTATIVE</p>
                <p class="text-zinc-300">${partnerName}</p>
                <p class="text-[10px] text-zinc-400">${partnerCompany} Desk Partner</p>
            </div>
        `;
        container.appendChild(summaryGrid);

        // Pre-call interactive assignment checklist
        const assignmentContainer = document.createElement('div');
        assignmentContainer.className = 'border-2 border-dashed border-zinc-800 p-6 space-y-4';
        
        assignmentContainer.innerHTML = `
            <div class="space-y-1">
                <h4 class="font-display font-bold text-base text-white uppercase tracking-tight">Pre-Call Mandatory Homework</h4>
                <p class="text-xs text-zinc-400 font-mono">Maximize performance parameters. Track document prep readiness below before matching.</p>
            </div>
        `;

        const checkListWrapper = document.createElement('div');
        checkListWrapper.className = 'space-y-3 font-mono text-xs text-zinc-300 pt-2';

        const tasks = [
            { id: 'bankStatements', text: 'Locate 3 most recent business bank statements (PDFs)', hint: 'Required for revenue verification.' },
            { id: 'einCert', text: 'Acquire tax EIN confirmation document / Business License details', hint: 'Ensures business entity legitimacy validation.' },
            { id: 'idDoc', text: 'Prepare active Photo ID (Driver License / passport copy)', hint: 'Ensures immediate compliance setup clearance.' }
        ];

        tasks.forEach(task => {
            const label = document.createElement('label');
            const isChecked = AppState.checklistState[task.id];
            
            label.className = `flex items-start gap-3 p-3 border cursor-pointer select-none transition-all ${
                isChecked 
                    ? 'bg-zinc-900 border-electricgreen/40 text-white' 
                    : 'bg-zinc-950/40 border-zinc-800 hover:bg-zinc-900/60'
            }`;
            
            label.innerHTML = `
                <input type="checkbox" class="form-checkbox w-4 h-4 text-electricgreen bg-matteblack border-zinc-700 focus:ring-0 rounded mt-0.5" ${isChecked ? 'checked' : ''}>
                <div>
                    <span class="font-bold block">${task.text}</span>
                    <span class="text-[10px] text-zinc-500 block mt-0.5">${task.hint}</span>
                </div>
            `;

            label.querySelector('input').onchange = (e) => {
                AppState.checklistState[task.id] = e.target.checked;
                renderStep4Confirmation(); // re-render step dynamically to save checkstate colors
            };

            checkListWrapper.appendChild(label);
        });

        assignmentContainer.appendChild(checkListWrapper);
        container.appendChild(assignmentContainer);

        // Diagnostic dynamic score widget at the very bottom
        const checkValues = Object.values(AppState.checklistState);
        const checkedCount = checkValues.filter(v => v).length;
        
        const feedbackBlock = document.createElement('div');
        if (checkedCount === 3) {
            feedbackBlock.className = 'p-4 bg-emerald-950/30 border border-electricgreen/50 text-xs text-electricgreen font-mono leading-relaxed flex items-center gap-3';
            feedbackBlock.innerHTML = `
                <span class="text-lg">🎯</span>
                <div>
                    <strong>SECURED STATE READY:</strong> Maximum operational parameters matched. You have completed all assignments. Priority status active.
                </div>
            `;
        } else {
            feedbackBlock.className = 'p-4 bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 font-mono leading-relaxed flex items-center gap-3';
            feedbackBlock.innerHTML = `
                <span class="text-lg">⏳</span>
                <div>
                    <strong>REQUIRED STATUS:</strong> Completed ${checkedCount}/3 prep tasks. Complete outstanding preparation checklists before your scheduled slot.
                </div>
            `;
        }
        container.appendChild(feedbackBlock);

        return container;
    }

    // Run core engine execution
    renderScheduler();
})();