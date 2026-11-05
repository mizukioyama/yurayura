// Optional authoring helper: no build service or browser dependency.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'), state=require('../assets/js/exhibition-state.js'), content=require('../assets/js/information-content.js');
const rawEvents=JSON.parse(fs.readFileSync(path.join(root,'assets/data/exhibitions.json'),'utf8'));
const publicEvents=require('./export-public-events.cjs').publicEvents(rawEvents);
if(!require('node:util').isDeepStrictEqual(rawEvents,publicEvents)) throw new Error('Keep unpublished or unsupported data outside the public JSON.');
const events=state.visibleEvents(rawEvents);
const groups=state.groupEvents(events), newsRows=JSON.parse(fs.readFileSync(path.join(root,'assets/data/news.json'),'utf8')), news=content.news(newsRows);
for (const row of newsRows) if (row.url && !fs.existsSync(path.resolve(root,row.url.split('#')[0]))) throw new Error('News target does not exist: '+row.url);
const file=path.join(root,'information.html'), original=fs.readFileSync(file,'utf8');
let html=original;
for(const [name,value] of Object.entries({UPCOMING:content.upcoming(groups),ARCHIVE:content.archive(groups.past),NEWS:news})) {
 const re=new RegExp(`(<!-- INFORMATION:${name}:START -->)[\\s\\S]*?(<!-- INFORMATION:${name}:END -->)`);
 if(!re.test(html))throw new Error('Missing static region '+name);
 html=html.replace(re,(_,start,end)=>start+'\n'+value+'\n'+end);
}
html=html.replace(/(<div data-event-groups data-information-events)(?: hidden)?(>)/,'$1'+(groups.current.length+groups.upcoming.length?'':' hidden')+'$2');
html=html.replace(/(<article class="information-planning" data-information-planning)(?: hidden)?(>)/,'$1'+(groups.current.length+groups.upcoming.length?' hidden':'')+'$2');
html=html.replace(/(<section class="section information-news" id="news" data-information-news)(?: hidden)?( aria-labelledby)/,'$1'+(news?'':' hidden')+'$2');
const recruitment=state.recruitmentView(events);
const staticStatus=recruitment.state==='open'?'最新の募集状況は参加ページをご確認ください。':recruitment.status;
html=html.replace(/(<p data-recruitment-status>)[\s\S]*?(<\/p>)/,(_,start,end)=>start+staticStatus+end);
html=html.replace(/(<a data-information-news-link)(?: hidden)?( href)/,'$1'+(news?'':' hidden')+'$2');
const crypto=require('node:crypto');
const dataVersion=file=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex').slice(0,12);
html=html.replace(/<body class="information-page"(?: data-information-events-version="[^"]*")?(?: data-information-news-version="[^"]*")?>/,`<body class="information-page" data-information-events-version="${dataVersion('assets/data/exhibitions.json')}" data-information-news-version="${dataVersion('assets/data/news.json')}">`);
const assets=['assets/css/information.css','assets/js/information-content.js','assets/js/exhibition-state.js'];
const versions=new Map(assets.map(asset=>[asset,crypto.createHash('sha256').update(fs.readFileSync(path.join(root,asset))).digest('hex').slice(0,12)]));
const check=process.argv.includes('--check');
if(process.argv[2] && !check)throw new Error('Usage: node scripts/sync-information.cjs [--check]');
for(const name of fs.readdirSync(root).filter(name=>name.endsWith('.html'))) {
 const target=path.join(root,name), before=fs.readFileSync(target,'utf8');
 let after=name==='information.html'?html:before;
 // Sync the same public notice into TOP, Information and application pages, including review.
 after=after.replace(/(<!-- INFORMATION:PLANNING:START -->)[\s\S]*?(<!-- INFORMATION:PLANNING:END -->)/g, (_,start,end)=>start+content.planningNotice()+end);
 for(const [asset,hash] of versions) {
   const escaped=asset.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
   after=after.replace(new RegExp('(\\./'+escaped+')(?:\\?v=[a-zA-Z0-9-]+)?(?=["\'])','g'),'$1?v='+hash);
 }
 if(after!==before) {
   if(check)throw new Error('Information snapshot or asset reference is stale: '+name);
   fs.writeFileSync(target,after);
 }
}
console.log(check?'Information snapshot and asset references match.':'Updated Information snapshot and affected asset references.');
