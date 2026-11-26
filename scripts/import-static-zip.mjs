#!/usr/bin/env node
// Legacy command delegates to the transactional importer.
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const args=process.argv.slice(2).map(x=>x.endsWith('.zip')&&!x.startsWith('--')?'--source='+x:x);
const result=spawnSync(process.execPath,[fileURLToPath(new URL('./import-asset.mjs',import.meta.url)),'--mode=static',...args],{stdio:'inherit'});
process.exitCode=result.status??1;
