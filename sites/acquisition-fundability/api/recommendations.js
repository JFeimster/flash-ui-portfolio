"use strict";

const { getEmpireFlippersRecommendations } = require("../lib/providers/empire-flippers-recommendations");
const { importEmpireFlippersListing } = require("../lib/providers/empire-flippers");

function send(res, status, payload, cacheable = false) {
  res.setHeader(
    "Cache-Control",
    cacheable
      ? "public, s-maxage=300, stale-while-revalidate=3600"
      : "no-store, max-age=0"
  );
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  return res.status(status).json(payload);
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return send(res, 405, {
      ok: false,
      error: "Method not allowed. Request similar listings with GET."
    });
  }

  let internalId = String((req.query && req.query.id) || "").trim();
  const listingNumber = String((req.query && req.query.listingNumber) || "").trim();

  if (!internalId && !listingNumber) {
    return send(res, 400, {
      ok: false,
      error: "Provide an Empire Flippers internal listing ID or listing number."
    });
  }

  try {
    let resolvedFromListingNumber = false;

    if (!internalId) {
      const importedDeal = await importEmpireFlippersListing(listingNumber);
      internalId = String(importedDeal && importedDeal.context && importedDeal.context.internalId || "").trim();
      resolvedFromListingNumber = true;

      if (!internalId) {
        return send(res, 422, {
          ok: false,
          error: `Empire Flippers listing #${listingNumber} did not expose the internal ID required for recommendations.`
        });
      }

      // Resolving the UUID uses the public Listings API. Wait before calling the
      // Recommendations API so the fallback path also respects EF's 1 req/sec limit.
      await wait(1100);
    }

    const recommendations = await getEmpireFlippersRecommendations(internalId, {
      limit: 3,
      excludeListingNumber: listingNumber || null
    });

    return send(res, 200, {
      ok: true,
      provider: "empire_flippers",
      resolvedFromListingNumber,
      listingNumber: listingNumber || null,
      recommendations,
      disclaimer: "Similar marketplace listings are discovery suggestions from Empire Flippers, not underwriting endorsements or lender approvals."
    }, true);
  } catch (error) {
    const message = error && error.message
      ? error.message
      : "Similar Empire Flippers listings are temporarily unavailable.";
    const notFound = /was not found/i.test(message);
    const invalid = /valid Empire Flippers|listing number|internal listing ID/i.test(message);

    return send(res, notFound ? 404 : invalid ? 400 : 502, {
      ok: false,
      error: message
    });
  }
};