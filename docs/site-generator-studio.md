# Site Generator Studio

The portfolio's static `/generator/` page creates an editable implementation prompt and a structured project configuration. It does not run Codex, PowerShell, GitHub publication, deployments, or integration setup from the browser.

## Prompt-library data

`data/site-generator-prompts.json` is a reproducible browser-facing projection of the prompt and project-factory registries. It joins records by stable ID, takes original prompt text and base fields from `flash-ui-prompts.registry.json`, and attaches factory brief, planning, starter, architecture, and workflow metadata when available. It includes only the 88 `site-idea` and 17 `design-template` factory entries; prompt-command and component-template records are excluded from the site-project picker. Design templates are hidden until the “Include design templates” filter is selected.

The generator script does not modify either source registry. From this repository root, rebuild the derived data with:

```powershell
node .\scripts\build-site-generator-data.mjs --registry-dir "C:\path\to\Registries"
```

The registry directory must contain `flash-ui-prompts.registry.json` and `flash-ui-project-factory.registry.json`. When omitted, the script expects the sibling `JSON\Private & Shared\Registries` folder relative to this repository's parent directory. Do not add that local source path to the browser data or interface.

## Catalogs and safe integration planning

`data/site-generator-catalogs.json` owns the site type, design, framework, motion, domain, layout, and quick-preset catalogs. `data/site-generator-integrations.json` separately describes providers, category filters, and integration presets. The providers adapt the inspected v2 integration data to demo-safe instructions; there is no cloud-storage category because the reference catalog and factory templates do not support a storage provider. The local-demo item is the default. Other integrations are marked as planned and require setup. The catalog contains environment-variable names only; it has no key values or credential samples. Choosing a provider adds planning instructions to the prompt; it does not connect the service.

The experience follows the v2 generator's searchable source, adaptive selectors, multi-control presets, surprise-me action, advanced options, and integration categories. The Notion prompt library's examples inform the prompt structure (use case, type, hook, hero, CTA, sections, and target files). Its records are not copied into the registry projection.

## Runner handoff

The factory runner's documented interface accepts `-EntryId` and `-ProjectBriefFile`. Its brief-file reader consumes `title`, `brand`, `audience`, `primary_action`, `project_slug`, `starter`, `delivery.create_repository`, `delivery.push_code`, `delivery.repository_visibility`, and optionally `output.project_slug`. The Studio maps Static HTML to `static-site` and Next.js to `nextjs-app`; other framework targets remain available in the prompt/config exports and disable the runner brief because the runner rejects unsupported starters. The runner brief is enabled when its required project fields are present; audience and CTA values sourced from a registry entry are editable suggestions. The Studio exports the supported project fields and a safe `delivery` object with repository creation and pushing disabled. It exports the richer Studio config separately, because the runner does not consume selected design, layout, motion, integration plan, routes, or feature fields.

For a selected factory-backed idea with the required brief fields, the page displays a command based on the README contract:

```powershell
pwsh -NoProfile -File .\Invoke-FlashUiProjectFactory.ps1 -EntryId <registry-id> -ProjectBriefFile ".\<slug>-runner-brief.json"
```

Run it from the local runner folder after downloading and reviewing the brief. The browser cannot start that process. A custom project without a factory registry ID has no runner command.

## Useful local review

- Check the generated prompt in the editable preview before copying or downloading it.
- Copy or download the full Studio config to retain the selected registry ID, original prompt, factory enrichment, chosen and resolved options, integration mode, and final prompt.
- Download the runner brief only for a factory-backed record and provide explicit audience and CTA values when the selected template requires them.
- Saved setups are stored only in this browser's local storage.
