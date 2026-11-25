// Flash UI Portfolio OS / Voltage Brutalism: canonical navigation contract.
export const groups = [
  {
    "label": "Explore",
    "links": [
      [
        "/sites/",
        "Sites & Variants"
      ],
      [
        "/ideas/",
        "Ideas & Prompts"
      ],
      [
        "/collections/",
        "Product Collections"
      ],
      [
        "/ecosystem/",
        "Connected Assets"
      ],
      [
        "/imports/",
        "Source Library"
      ],
      [
        "/data/",
        "Idea Discovery"
      ]
    ]
  },
  {
    "label": "Create",
    "links": [
      [
        "/generator/",
        "Site Generator"
      ],
      [
        "/workbench/",
        "Prompt Workbench"
      ],
      [
        "/factory/",
        "Tool Factory"
      ],
      [
        "/capabilities/",
        "Capability Factory"
      ]
    ]
  },
  {
    "label": "Tools",
    "links": [
      [
        "/collections/business-calculators/",
        "Financial Tools"
      ],
      [
        "/capabilities/ideas/",
        "MCP & Agent Ideas"
      ],
      [
        "/capabilities/funding-agency/",
        "Funding Agency Ideas"
      ],
      [
        "/build/",
        "Asset-to-Product"
      ]
    ]
  }
];
function escapeHtml(value){return String(value).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));}

export function normalizeRoute(value){const clean=String(value||"/").split(/[?#]/,1)[0].replace(/\/index\.html$/,"/");return clean.endsWith("/")||clean.endsWith(".html")?clean:clean+"/";}

export function isPortfolioPage(path){return /^(?:index\.html|404\.html|sites\/index\.html|data\/index\.html|(?:build|capabilities|collections|ecosystem|factory|generator|ideas|imports|tools|use-asset|workbench)(?:\/[^/]+)?\/index\.html)$/.test(path);}

export function pageRoute(path){return path==="index.html"?"/":"/"+path.replace(/index\.html$/,"");}

function contextLinks(html){const nav=html.match(/<nav\b[^>]*>[\s\S]*?<\/nav>/i)?.[0]||"";const known=new Set(["/",...groups.flatMap(g=>g.links.map(([href])=>href))]);const links=[];for(const m of nav.matchAll(/<a\b[^>]*\bhref="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)){const href=m[1];if(!href.startsWith("/")||href.startsWith("//")||known.has(href))continue;const label=m[2].replace(/<[^>]+>/g,"").replace(/&amp;/g,"&").trim();if(label){known.add(href);links.push([href,label]);}}return links;}

export function renderPortfolioNav(route,context=[]){const current=normalizeRoute(route);const anchor=([href,label])=>`<a href="${escapeHtml(href)}"${normalizeRoute(href)===current?' aria-current="page"':''}>${escapeHtml(label)}</a>`;const all=[...groups,...(context.length?[{label:"Related",links:context}]:[])];const activeCandidates=all.flatMap(g=>g.links.map(([href])=>({href,label:g.label}))).filter(x=>current===normalizeRoute(x.href)||current.startsWith(normalizeRoute(x.href))).sort((a,b)=>b.href.length-a.href.length);const active=activeCandidates[0]?.label;return `<nav class="portfolio-nav" data-portfolio-nav="v1" aria-label="Main navigation"><a class="portfolio-brand" href="/"${current==="/"?' aria-current="page"':''}>FLASH UI <span>/ PORTFOLIO</span></a><div class="portfolio-nav-actions">${all.map(g=>`<details class="portfolio-nav-group"${active===g.label?' data-active="true"':''}><summary>${escapeHtml(g.label)}</summary><div class="portfolio-nav-menu">${g.links.map(anchor).join("")}</div></details>`).join("")}</div></nav>`;}

export function applyPortfolioNav(html,route){const context=contextLinks(html);const nav=renderPortfolioNav(route,context);let result=html;const existing=result.match(/<nav\b[^>]*>[\s\S]*?<\/nav>/i)?.[0];const top=route==="/data/"?result.match(/<header class="topbar">[\s\S]*?<\/header>/i)?.[0]:null;if(top){result=result.replace(top,nav);}else if(existing){result=result.replace(existing,nav);}else{result=result.replace(/<body\b[^>]*>/i,m=>m+nav);}result=result.replace(/<link\b[^>]*href="\/assets\/css\/portfolio-nav\.css"[^>]*>\s*/gi,"").replace(/<script\b[^>]*src="\/assets\/js\/portfolio-nav\.mjs"[^>]*><\/script>\s*/gi,"");result=result.replace(/<\/head>/i,'<link rel="stylesheet" href="/assets/css/portfolio-nav.css"><script type="module" src="/assets/js/portfolio-nav.mjs"></script></head>');if(!/<a\b[^>]*class="[^"]*\b(?:skip|skip-link|portfolio-skip)\b[^"]*"[^>]*>/i.test(result)){let target="portfolio-main";const main=result.match(/<main\b[^>]*>/i)?.[0];if(main){const id=main.match(/\bid="([^"]+)"/i)?.[1];if(id)target=id;else result=result.replace(main,main.replace(/>$/,' id="portfolio-main">'));}else{const heading=result.match(/<h1\b[^>]*>/i)?.[0];if(heading){const id=heading.match(/\bid="([^"]+)"/i)?.[1];if(id)target=id;else result=result.replace(heading,heading.replace(/>$/,' id="portfolio-main" tabindex="-1">'));}else throw Error("No main target: "+route);}result=result.replace(/<body\b[^>]*>/i,m=>m+`<a class="portfolio-skip" href="#${escapeHtml(target)}">Skip to content</a>`);}return result;}

function enhanceNavigation(root){const all=[...root.querySelectorAll("details.portfolio-nav-group")];for(const item of all){item.addEventListener("toggle",()=>{if(item.open)for(const other of all)if(other!==item)other.open=false;});}root.addEventListener("keydown",event=>{if(event.key!=="Escape")return;const item=event.target.closest("details.portfolio-nav-group");if(item?.open){event.preventDefault();item.open=false;item.querySelector("summary").focus();}});document.addEventListener("click",event=>{if(!root.contains(event.target))for(const item of all)item.open=false;});}

if (typeof document !== 'undefined') { for (const nav of document.querySelectorAll('[data-portfolio-nav="v1"]')) enhanceNavigation(nav); }
