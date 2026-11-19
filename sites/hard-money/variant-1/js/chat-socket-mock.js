class ChatSocketMock {
    constructor() {
        this.listeners = {};
        this.connected = false;
        this.activeChannel = null;
        this.typingTimeout = null;
        
        // Mock team members
        this.teamMembers = {
            soren_risk: {
                name: "Soren Vance",
                role: "Risk & Underwriting",
                avatarColor: "border-cyber-purple text-cyber-purple bg-cyber-purple/10",
                status: "ONLINE"
            },
            elena_ops: {
                name: "Elena Rostova",
                role: "Senior Capital Closer",
                avatarColor: "border-cyber-accent text-cyber-accent bg-cyber-accent/10",
                status: "ONLINE"
            },
            marcus_capital: {
                name: "Marcus Brody",
                role: "Managing Director",
                avatarColor: "border-cyber-emerald text-cyber-emerald bg-cyber-emerald/10",
                status: "AWAY"
            },
            ai_copilot: {
                name: "CORE MATCHMAKER V2",
                role: "AI Co-Underwriter",
                avatarColor: "border-pink-500 text-pink-500 bg-pink-500/10",
                status: "SYSTEM"
            }
        };

        // Seeded conversation database mapped by Deal / Lender ID
        this.messageHistory = {
            "apex-velocity": [
                {
                    id: "msg-1",
                    sender: "soren_risk",
                    timestamp: "10:14:22",
                    message: "Apex's 85% LTV limit looks solid for the Residential Rehab project on 4th Street, but we need to push the appraisal waiver. Settle for 1.25 points?",
                    attachment: { name: "4th_Street_Executive_Summary.pdf", type: "pdf", size: "2.4MB" }
                },
                {
                    id: "msg-2",
                    sender: "elena_ops",
                    timestamp: "10:16:05",
                    message: "I checked their track record. Apex can close this in 3 days flat if we use their internal desktop valuation model. Marcus, do we have the escrow funds queued?",
                    attachment: null
                },
                {
                    id: "msg-3",
                    sender: "marcus_capital",
                    timestamp: "10:19:11",
                    message: "Escrow is locked and loaded. Let's run the scenario comparison against Fortress before we pull the trigger.",
                    attachment: null
                }
            ],
            "fortress-commercial": [
                {
                    id: "msg-1",
                    sender: "marcus_capital",
                    timestamp: "09:05:12",
                    message: "Fortress has a higher min threshold ($1.0M) but their base rate is 9.25%. Soren, how does this score on our leverage matrix?",
                    attachment: null
                },
                {
                    id: "msg-2",
                    sender: "soren_risk",
                    timestamp: "09:12:44",
                    message: "For commercial mixed-use, their 75% LTV is standard. I've uploaded the debt yield spreadsheet to compare. The cash flow matches perfectly.",
                    attachment: { name: "Fortress_Debt_Yield_Matrix.xlsx", type: "excel", size: "1.8MB" }
                }
            ],
            "pacific-rim": [
                {
                    id: "msg-1",
                    sender: "ai_copilot",
                    timestamp: "11:45:00",
                    message: "PROACTIVE MATCH ALERT: Pacific Rim is offering 90% LTV specifically for California residential plays. Our current pipeline shows 2 active deals that match these exact coordinates.",
                    attachment: { name: "CA_Pipeline_Matches.json", type: "config", size: "12KB" }
                },
                {
                    id: "msg-2",
                    sender: "elena_ops",
                    timestamp: "11:47:33",
                    message: "90% leverage is huge right now. Soren, double-check if they require personal guarantees for repeat sponsors.",
                    attachment: null
                }
            ],
            "general": [
                {
                    id: "msg-1",
                    sender: "marcus_capital",
                    timestamp: "08:00:15",
                    message: "Morning team. Let's monitor the speed ratios on closing today. Average is hovering at 4.8 days across the active registry.",
                    attachment: null
                },
                {
                    id: "msg-2",
                    sender: "elena_ops",
                    timestamp: "08:05:42",
                    message: "Copy that. Pushing closing papers for Apex and Emberstone right now.",
                    attachment: null
                }
            ]
        };

        // Context-aware automatic simulated responses
        this.responseScripts = {
            "apex-velocity": [
                {
                    sender: "soren_risk",
                    message: "Just ran the LTV calculations via the telemetry panel. Apex's points are actually trending down to 1.1% for this cohort.",
                    delay: 4000
                },
                {
                    sender: "ai_copilot",
                    message: "CRITICAL NOTIFICATION: Apex Velocity closing time of 3 days verified against last 14 historical transactions on our network.",
                    delay: 8000
                }
            ],
            "fortress-commercial": [
                {
                    sender: "elena_ops",
                    message: "Note that Fortress requires an environmental Phase I audit before underwriting sign-off. Budget an extra 3-5 business days.",
                    delay: 5000
                }
            ],
            "pacific-rim": [
                {
                    sender: "soren_risk",
                    message: "They're fast, but we need to verify if the 90% LTV is based on LTC (Cost) or ARV (After Repair Value). Huge difference.",
                    delay: 4500
                }
            ],
            "general": [
                {
                    sender: "ai_copilot",
                    message: "SYSTEM MONITOR: Overall capital deployment velocity has accelerated by 12% over the last 24h cycle.",
                    delay: 6000
                }
            ]
        };
    }

    // Connect to a specific contextual deal/lender discussion channel
    connect(channelId) {
        this.activeChannel = channelId || "general";
        this.connected = true;
        
        this.trigger("status", {
            status: "CONNECTED",
            channel: this.activeChannel,
            message: `Telemetry secure socket linked to routing cluster: [${this.activeChannel.toUpperCase()}]`
        });

        // Send down history
        const history = this.messageHistory[this.activeChannel] || [];
        this.trigger("history", history);
    }

    // Send a message down the pipeline
    send(messageText, attachment = null) {
        if (!this.connected) {
            this.trigger("error", "Socket pipeline disconnected. Reconnection required.");
            return;
        }

        const time = new Date();
        const timestamp = time.toTimeString().split(' ')[0];
        
        const newMsg = {
            id: `user-${Date.now()}`,
            sender: "user", // The active operator
            timestamp: timestamp,
            message: messageText,
            attachment: attachment
        };

        // Save to active history
        if (!this.messageHistory[this.activeChannel]) {
            this.messageHistory[this.activeChannel] = [];
        }
        this.messageHistory[this.activeChannel].push(newMsg);

        // Echo back confirmation of send immediately
        this.trigger("message", newMsg);

        // Trigger simulated collaborative feedback
        this.scheduleSimulatedResponse();
    }

    // Schedule structured contextual feedback from the simulated team
    scheduleSimulatedResponse() {
        if (this.typingTimeout) clearTimeout(this.typingTimeout);

        const scripts = this.responseScripts[this.activeChannel] || this.responseScripts["general"];
        if (!scripts || scripts.length === 0) return;

        // Choose a script randomly or cycle through
        const script = scripts[Math.floor(Math.random() * scripts.length)];

        // Phase 1: Typing state indicator
        this.typingTimeout = setTimeout(() => {
            const senderDetails = this.teamMembers[script.sender];
            this.trigger("typing", {
                isTyping: true,
                sender: senderDetails
            });

            // Phase 2: Send actual message packet
            setTimeout(() => {
                this.trigger("typing", { isTyping: false });

                const time = new Date();
                const timestamp = time.toTimeString().split(' ')[0];
                const responseMsg = {
                    id: `sim-${Date.now()}`,
                    sender: script.sender,
                    timestamp: timestamp,
                    message: script.message,
                    attachment: script.attachment || null
                };

                this.messageHistory[this.activeChannel].push(responseMsg);
                this.trigger("message", responseMsg);

            }, 2500); // Realistic typing duration

        }, script.delay || 3000);
    }

    // Standard Pub/Sub handler hookup
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    trigger(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(cb => cb(data));
        }
    }

    // Clean up channel links
    disconnect() {
        this.connected = false;
        this.activeChannel = null;
        if (this.typingTimeout) clearTimeout(this.typingTimeout);
        this.trigger("status", {
            status: "DISCONNECTED",
            message: "Contextual telecommunications port closed."
        });
    }

    // Inject manual system notifications
    injectSystemNotice(text) {
        const time = new Date();
        const timestamp = time.toTimeString().split(' ')[0];
        const notice = {
            id: `system-${Date.now()}`,
            sender: "ai_copilot",
            timestamp: timestamp,
            message: `[TELEMETRY LOG]: ${text}`,
            attachment: null
        };
        if (this.messageHistory[this.activeChannel]) {
            this.messageHistory[this.activeChannel].push(notice);
        }
        this.trigger("message", notice);
    }
}

// Bind to window to allow global coordination across interface modules
window.ChatSocketMock = new ChatSocketMock();