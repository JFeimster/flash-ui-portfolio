#!/usr/bin/env node
// Batch 28 local packager: node scripts/package-capability.mjs input.json output.zip
import {readFile,writeFile} from 'node:fs/promises';
import {buildPackage,zipBytes,validatePackage} from '../assets/js/capability-factory-core.mjs';
const [inputFile,outputFile]=process.argv.slice(2);
if(!inputFile||!outputFile||!outputFile.endsWith('.zip')){console.error('Usage: node scripts/package-capability.mjs <source-input.json> <output.zip>');process.exitCode=2}
else {
 try{
  const input=JSON.parse(await readFile(inputFile,'utf8'));
  const files=buildPackage(input),errors=validatePackage(files);
  if(errors.length)throw Error(errors.join('; '));
  await writeFile(outputFile,Buffer.from(await zipBytes(files).arrayBuffer()));
  console.log('Validated '+Object.keys(files).length+' files; wrote '+outputFile+'. Not installed or deployed.');
 }catch(error){console.error('Package rejected: '+error.message);process.exitCode=1}
}
