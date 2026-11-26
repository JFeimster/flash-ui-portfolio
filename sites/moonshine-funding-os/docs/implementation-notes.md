# Implementation Notes

## Baseline decision

The static Flash-UI version is the best MVP baseline because the assignment is to ship one visible, testable tool. The Next.js export is useful later, but it adds framework surface area before the business logic has been proven.

## Data consumed

The MVP loads these data/rules files:

- `providers.json`
- `products.json`
- `routing_logic.json`
- `recommendation_weights.json`
- `borrower_archetypes.json`
- `readiness_dimensions.json`
- `risk_flags.json`
- `partner_fit_scoring.json`

## Public vs internal separation

Public borrower output is white-labeled and only shows funding paths. Internal analyst output shows provider/product matches, scores, manual review flags, and JSON payload.

## Known limitations

This MVP uses local JavaScript formulas. It consumes the JSON files, but it does not fully execute every rule object yet. That is acceptable for v0.1.0 because the goal is a deployed routing demonstration, not a production underwriting system.

## Production caution

Do not treat the generated score as an approval, offer, or final underwriting result. This is prequalification guidance and workflow routing only.
