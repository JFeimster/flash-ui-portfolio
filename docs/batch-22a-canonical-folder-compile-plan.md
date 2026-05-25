# Batch 22A Canonical Folder Compile Plan

Generated: 2026-05-25 19:12:52 -04:00

## Scope
- Target: /sites canonical group compilation and legacy sibling cleanup
- Direct children inspected: 115
- Canonical slug folders detected: 16
- Legacy numbered sibling folders detected: 64

## Proposed Groups
### funding-calculators-tools-library
- canonicalHubPath: sites/funding-calculators-tools-library/index.html
- canonicalHubExists: True
- legacyVariantFolders: sites/Funding Calculators & Tools Library 1, sites/Funding Calculators & Tools Library 2, sites/Funding Calculators & Tools Library 3, sites/Funding Calculators & Tools Library 4, sites/Funding Calculators & Tools Library 5
- existingCanonicalVariantFolders: 
- duplicateStatus: target-missing
- riskLevel: low
- confidence: high
- safeToApply: True
- proposedMoveMap:
  - sites/Funding Calculators & Tools Library 1 -> sites/funding-calculators-tools-library/variant-1
  - sites/Funding Calculators & Tools Library 2 -> sites/funding-calculators-tools-library/variant-2
  - sites/Funding Calculators & Tools Library 3 -> sites/funding-calculators-tools-library/variant-3
  - sites/Funding Calculators & Tools Library 4 -> sites/funding-calculators-tools-library/variant-4
  - sites/Funding Calculators & Tools Library 5 -> sites/funding-calculators-tools-library/variant-5

### startup-credit-stacker-console
- canonicalHubPath: sites/startup-credit-stacker-console/index.html
- canonicalHubExists: True
- legacyVariantFolders: sites/Startup Credit Stacker Console 1, sites/Startup Credit Stacker Console 2, sites/Startup Credit Stacker Console 3, sites/Startup Credit Stacker Console 4
- existingCanonicalVariantFolders: sites/startup-credit-stacker-console/variant-1, sites/startup-credit-stacker-console/variant-2, sites/startup-credit-stacker-console/variant-3, sites/startup-credit-stacker-console/variant-4
- duplicateStatus: manual-review
- riskLevel: medium
- confidence: medium
- safeToApply: False
- notes:
  - Legacy folder sites/Startup Credit Stacker Console 1 is empty while target exists; treat as remnant and review before deletion.
  - Legacy folder sites/Startup Credit Stacker Console 2 is empty while target exists; treat as remnant and review before deletion.
  - Legacy folder sites/Startup Credit Stacker Console 3 is empty while target exists; treat as remnant and review before deletion.
  - Legacy folder sites/Startup Credit Stacker Console 4 is empty while target exists; treat as remnant and review before deletion.
  - Legacy sibling folders were also flagged by git clean with permission denied on this workstation (OneDrive reparsepoint).

### the-radical-libertarian
- canonicalHubPath: sites/the-radical-libertarian/index.html
- canonicalHubExists: True
- legacyVariantFolders: sites/The Radical Libertarian 1, sites/The Radical Libertarian 2, sites/The Radical Libertarian 3
- existingCanonicalVariantFolders: 
- duplicateStatus: target-missing
- riskLevel: low
- confidence: high
- safeToApply: True
- proposedMoveMap:
  - sites/The Radical Libertarian 1 -> sites/the-radical-libertarian/variant-1
  - sites/The Radical Libertarian 2 -> sites/the-radical-libertarian/variant-2
  - sites/The Radical Libertarian 3 -> sites/the-radical-libertarian/variant-3

## Skipped Primary Target Groups
- the-cac-payback-analyzer: canonical hub missing; safeToApply=false
- the-saas-ltv-cac-diagnostic: canonical hub missing; safeToApply=false
- quote-grenade-studio: canonical hub missing; safeToApply=false
- veteran-jester-dispatch: canonical hub missing; safeToApply=false
- meme-propaganda-department: canonical hub missing; safeToApply=false
- affiliate-agency-launch-funnel: canonical hub missing; safeToApply=false

## Apply-Now Groups
- funding-calculators-tools-library
- the-radical-libertarian
