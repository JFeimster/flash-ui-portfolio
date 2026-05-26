/**
 * Moonshine Capital | UTM & Lead Tracking Lab
 * Advanced Tracking String & JSON Builder Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const utmInputs = [
        'utmSource', 'utmMedium', 'utmCampaign', 'utmContent', 'utmTerm',
        'subId1', 'subId2', 'extRef', 'callbackUrl', 'pixelId'
    ];

    const initUTMBuilder = () => {
        utmInputs.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', updateTrackingOutputs);
            }
        });

        const btnCopyJson = document.getElementById('btnCopyJson');
        const btnCopyQuery = document.getElementById('btnCopyQuery');

        if (btnCopyJson) {
            btnCopyJson.addEventListener('click', () => copyToClipboard('json-output-box', 'JSON Config Copied!'));
        }
        if (btnCopyQuery) {
            btnCopyQuery.addEventListener('click', () => copyToClipboard('query-output-box', 'Tracking String Copied!'));
        }

        updateTrackingOutputs();
    };

    function updateTrackingOutputs() {
        const data = {};
        utmInputs.forEach(id => {
            const el = document.getElementById(id);
            if (el) data[id] = el.value.trim();
        });

        // Generate JSON Configuration Object
        const configObject = {
            attribution: {
                utm: {
                    source: data.utmSource || null,
                    medium: data.utmMedium || null,
                    campaign: data.utmCampaign || null,
                    content: data.utmContent || null,
                    term: data.utmTerm || null
                },
                meta: {
                    sub_id_1: data.subId1 || null,
                    sub_id_2: data.subId2 || null,
                    external_ref: data.extRef || null
                }
            },
            integrations: {
                webhooks: data.callbackUrl ? [data.callbackUrl] : [],
                tracking_pixels: data.pixelId ? [{ provider: 'meta', id: data.pixelId }] : []
            },
            timestamp: new Date().toISOString(),
            version: "2.1.0-stable"
        };

        const jsonBox = document.getElementById('json-output-box');
        if (jsonBox) {
            jsonBox.textContent = JSON.stringify(configObject, null, 4);
        }

        // Generate Query String
        const params = new URLSearchParams();
        if (data.utmSource) params.append('utm_source', data.utmSource);
        if (data.utmMedium) params.append('utm_medium', data.utmMedium);
        if (data.utmCampaign) params.append('utm_campaign', data.utmCampaign);
        if (data.subId1) params.append('s1', data.subId1);
        if (data.subId2) params.append('s2', data.subId2);
        if (data.extRef) params.append('ref', data.extRef);

        const queryBox = document.getElementById('query-output-box');
        if (queryBox) {
            queryBox.textContent = params.toString() ? `?${params.toString()}` : 'No parameters defined';
        }

        // Dispatch custom event for visual updates in parent UI if necessary
        window.dispatchEvent(new CustomEvent('utmUpdate', { detail: { config: configObject, query: params.toString() } }));
    }

    function copyToClipboard(elementId, successMsg) {
        const text = document.getElementById(elementId).textContent;
        if (!text || text.includes('No parameters defined')) return;

        navigator.clipboard.writeText(text).then(() => {
            showGlobalToast(successMsg);
        });
    }

    function showGlobalToast(msg) {
        // Look for existing toast from base component
        const toast = document.getElementById('toast');
        if (toast) {
            toast.textContent = msg;
            toast.style.display = 'block';
            setTimeout(() => {
                toast.style.display = 'none';
            }, 2500);
        } else {
            console.log('Moonshine Alert:', msg);
        }
    }

    // Initialize the builder
    initUTMBuilder();
});

/**
 * Utility: Programmatically set UTM values
 * Can be called from browser console or external scripts
 */
window.setTrackingParam = (key, value) => {
    const el = document.getElementById(key);
    if (el) {
        el.value = value;
        el.dispatchEvent(new Event('input'));
    }
};