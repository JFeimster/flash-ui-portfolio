export function examplesFor(themeId,rows) {
 return rows.filter(row=>(row.catalog?.designThemeIds||[]).includes(themeId))
  .map(row=>({id:row.id,title:row.title,path:row.path,image:row.variants?.find(variant=>variant.designThemeIds?.includes(themeId)&&variant.preview?.image)?.preview?.image||row.image||'',evidence:'Explicit Catalog v2 theme ID'}));
}
export function recommendThemes(query,themes,limit=5) {
 const words=new Set(String(query||'').toLowerCase().match(/[a-z0-9]{4,}/g)||[]);
 return themes.map(theme=>{
  const fields=[...theme.keywords||[],...theme.bestFor||[],theme.name,theme.concept];
  const matches=[...new Set(fields.flatMap(field=>String(field).toLowerCase().match(/[a-z0-9]{4,}/g)||[]))].filter(word=>words.has(word));
  return {theme,matches,score:matches.length};
 }).filter(item=>item.score).sort((a,b)=>b.score-a.score||a.theme.name.localeCompare(b.theme.name)).slice(0,limit);
}
