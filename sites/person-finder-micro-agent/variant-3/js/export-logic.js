/**
 * Prism Scan | Data Export & Integration Center Logic
 * Handles formatting, CSV/JSON generation, and simulated CRM field mapping.
 */

const CRM_SCHEMAS = {
    salesforce: {
        firstName: 'FirstName',
        lastName: 'LastName',
        company: 'Company',
        title: 'Title',
        email: 'Email',
        source: 'LeadSource',
        status: 'Status'
    },
    hubspot: {
        firstName: 'firstname',
        lastName: 'lastname',
        company: 'company',
        title: 'jobtitle',
        email: 'email',
        source: 'hs_analytics_source',
        status: 'hs_lead_status'
    }
};

class PrismExportCenter {
    constructor(terminalElementId) {
        this.terminalId = terminalElementId;
        this.exportQueue = [];
    }

    get terminal() {
        return document.getElementById(this.terminalId);
    }

    log(msg, type = 'info') {
        if (!this.terminal) return;
        const time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        let color = 'var(--accent-cyan)';
        if (type === 'error') color = 'var(--accent-magenta)';
        if (type === 'success') color = 'var(--accent-lime)';
        
        const line = document.createElement('div');
        line.style.color = color;
        line.innerHTML = `[${time}] [EXPORT_SVC] ${msg}`;
        this.terminal.appendChild(line);
        this.terminal.scrollTop = this.terminal.scrollHeight;
    }

    /**
     * Prepares found data for export
     */
    prepareData(name, role, company) {
        const [firstName, ...lastNames] = name.split(' ');
        return {
            name: name,
            firstName: firstName,
            lastName: lastNames.join(' '),
            role: role.split(' • ')[0] || role,
            company: company || 'Unknown Entity',
            email: `${firstName.toLowerCase()}.${(lastNames[0] || 'user').toLowerCase()}@company-node.internal`,
            timestamp: new Date().toISOString(),
            source: 'PRISM_SCAN_MICRO_AGENT'
        };
    }

    async runExportSequence(format, targetData) {
        this.log(`Initiating ${format.toUpperCase()} sequence...`);
        await new Promise(r => setTimeout(r, 600));

        try {
            const data = this.prepareData(targetData.name, targetData.role, targetData.company);
            
            if (format === 'csv') {
                this.generateCSV([data]);
            } else if (format === 'json') {
                this.generateJSON([data]);
            }
            
            this.log(`Data packet encapsulated: prism_lead_${Date.now()}.${format}`, 'success');
        } catch (err) {
            this.log(`Buffer Error: ${err.message}`, 'error');
        }
    }

    generateCSV(dataArray) {
        const headers = Object.keys(dataArray[0]).join(',');
        const rows = dataArray.map(obj => 
            Object.values(obj).map(val => `"${val}"`).join(',')
        ).join('\n');
        
        this.downloadFile(`${headers}\n${rows}`, 'csv');
    }

    generateJSON(dataArray) {
        const json = JSON.stringify(dataArray, null, 4);
        this.downloadFile(json, 'json');
    }

    downloadFile(content, ext) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `prism_export_${Math.floor(Math.random() * 10000)}.${ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    async simulateCRMSync(crmType, targetData) {
        const schema = CRM_SCHEMAS[crmType];
        if (!schema) {
            this.log(`Critical: Unknown CRM Node '${crmType}'`, 'error');
            return;
        }

        this.log(`Mapping local attributes to ${crmType.toUpperCase()} schema...`);
        await new Promise(r => setTimeout(r, 800));

        const data = this.prepareData(targetData.name, targetData.role, targetData.company);
        const payload = {
            [schema.firstName]: data.firstName,
            [schema.lastName]: data.lastName,
            [schema.company]: data.company,
            [schema.title]: data.role,
            [schema.email]: data.email,
            [schema.source]: 'Prism Scan AI',
            [schema.status]: 'New'
        };

        this.log(`Payload verified. Establishing SSL handshake with ${crmType} API...`);
        await new Promise(r => setTimeout(r, 1200));
        
        this.log(`POST /v3/leads HTTP/1.1 -> ${JSON.stringify(payload).substring(0, 40)}...`);
        await new Promise(r => setTimeout(r, 1000));

        this.log(`Sync complete. Object ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}`, 'success');
    }
}

// Initialization for global access
window.PrismExport = new PrismExportCenter('terminal');