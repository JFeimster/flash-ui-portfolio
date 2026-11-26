import {handleCopilotRequest} from '../assets/js/copilot-api-core.mjs';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd();
async function load(name){return JSON.parse(await readFile(path.join(root,'data',name+'.json'),'utf8'))}
export default async function handler(req,res){
 let data={};try{const [ideas,themes,catalog,integrations]=await Promise.all(['site-generator-public','transferable-design-themes','asset-showcase','site-generator-integrations'].map(load));data={ideas,themes,catalog,integrations}}catch{}
 const result=await handleCopilotRequest(req,{enabled:process.env.COPILOT_AI_ENABLED==='true',operatorToken:process.env.COPILOT_OPERATOR_TOKEN,providerKey:process.env.OPENAI_API_KEY,model:process.env.OPENAI_MODEL,redisUrl:process.env.UPSTASH_REDIS_REST_URL,redisToken:process.env.UPSTASH_REDIS_REST_TOKEN,data,fetchImpl:fetch});
 res.setHeader('Cache-Control','no-store');res.status(result.status).json(result.body);
}
