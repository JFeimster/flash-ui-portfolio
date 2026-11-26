"use strict";

const { importEmpireFlippersListing } = require("../lib/providers/empire-flippers");
const { detectProvider, normalizeManualMarketplaceImport } = require("../lib/providers/manual-marketplaces");

function send(res, status, payload) {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  return res.status(status).json(payload);
}

function parseBody(body) {
  if (!body) return {};
  if (typeof body === "object") return body;
  try { return JSON.parse(body); } catch { return {}; }
}

function isEmpireFlippersInput(input) {
  if (/^#?\d{4,9}$/.test(input)) return true;
  try {
    const host = new URL(input).hostname.toLowerCase().replace(/^www\./, "");
    return host === "empireflippers.com" || host.endsWith(".empireflippers.com");
  } catch {
    return false;
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return send(res, 405, { ok: false, error: "Method not allowed. Submit a listing with POST." });
  }

  const body = parseBody(req.body);
  const input = String(body.url || body.listingNumber || body.listing_number || "").trim();
  const sourceText = String(body.sourceText || body.source_text || "").trim();

  if (!input) {
    return send(res, 400, { ok: false, error: "Enter a supported marketplace listing URL or Empire Flippers listing number." });
  }

  try {
    let deal;
    if (isEmpireFlippersInput(input)) {
      deal = await importEmpireFlippersListing(input);
    } else {
      const provider = detectProvider(input);
      if (!provider) {
        return send(res, 400, {
          ok: false,
          error: "Supported marketplaces: Empire Flippers, Acquire.com, BizBuySell, and Flippa."
        });
      }
      deal = normalizeManualMarketplaceImport(input, sourceText);
    }

    return send(res, 200, { ok: true, deal });
  } catch (error) {
    const message = error && error.message
      ? error.message
      : "The listing could not be imported. Enter the deal manually or try again shortly.";
    const notFound = /was not found/i.test(message);
    const inputError = /Supported marketplace|Paste the public listing details|valid Empire Flippers|Could not find a listing number|required/i.test(message);
    return send(res, notFound ? 404 : inputError ? 400 : 502, { ok: false, error: message });
  }
};
