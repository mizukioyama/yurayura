const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),content=require('../assets/js/information-content.js'),state=require('../assets/js/exhibition-state.js');
const published=JSON.parse(fs.readFileSync(path.join(root,'assets/data/exhibitions.json'),'utf8'));
test('Information snapshot matches its public data without a build service',()=>{
 const result=spawnSync(process.execPath,['scripts/sync-information.cjs','--check'],{cwd:root,encoding:'utf8'});assert.equal(result.status,0,result.stderr);
 const html=fs.readFileSync(path.join(root,'information.html'),'utf8');
 assert.match(html,/id="past-exhibitions"/);assert.match(html,/id="past-event-2026-year"/);assert.match(html,/id="faq"/);assert.match(html,/noimageindex/);
 const archive=html.split('<!-- INFORMATION:ARCHIVE:START -->')[1].split('<!-- INFORMATION:ARCHIVE:END -->')[0];
 assert(!/石川町駅|徒歩|バス|〒|maps|11:30|20:00|LightUp/.test(archive));
 assert.match(archive,/Gallery Charlotte.Usagi/);assert.match(archive,/KAoRU/);assert.match(archive,/18作品/);
 assert.equal((archive.match(/data-event-id="yurayura-01"/g)||[]).length,1);
});
test('Information archive groups years using Japan time, retaining a single record per edition',()=>{
 const later={...published[0],id:'fixture-02',edition:2,startsAt:'2026-12-31T15:00:00Z',endsAt:'2027-01-02T00:00:00Z'};
 const rows=state.groupEvents([...published,later],Date.parse('2027-02-01T00:00:00Z')).past;
 const html=content.archive(rows);assert(html.indexOf('2027年')<html.indexOf('2026年'));assert.match(html,/datetime="2027-01-01"/);
 assert.equal((html.match(/data-event-id=/g)||[]).length,2);
});
test('Information preserves undated versus dated and current statuses',()=>{
 const e={...published[0],id:'fixture-02',edition:2,startsAt:null,endsAt:null,city:null,venue:null};
 let html=content.upcoming(state.groupEvents([e],Date.now()));assert.match(html,/開催日未定/);assert.match(html,/開催時期未定/);assert(!html.includes('null'));
 html=content.upcoming(state.groupEvents(published,Date.parse(published[0].startsAt)));assert.match(html,/開催中/);
 html=content.upcoming(state.groupEvents(published,Date.parse('2026-01-01T00:00:00+09:00')));assert.match(html,/開催決定/);assert(!html.includes('開催調整中'));
});
test('Information text is escaped instead of becoming executable markup',()=>{
 const e={...published[0],copy:{...published[0].copy,yurayura:{...published[0].copy.yurayura,ja:'<img src=x onerror=alert(1)>'}},artists:['<script>fixture</script>']};
 const html=content.archive(state.groupEvents([e],Date.now()).past);assert(!html.includes('<img'));assert(!html.includes('<script>'));assert(html.includes('&lt;img'));
});
test('News accepts only approved public fields and safe local links',()=>{
 assert.equal(content.news([]),'');
 const notice={id:'fixture-notice',date:'2026-10-01',title:'<b>テスト専用</b>',url:'./information.html#past-exhibitions'};
 const html=content.news([notice]);assert(html.includes('&lt;b&gt;'));assert.throws(()=>content.news([{...notice,url:'javascript:alert(1)'}]));
 assert.throws(()=>content.news([{...notice,date:'2026-02-30'}]));assert.throws(()=>content.news([{...notice,privateNotes:'not public'}]));assert.throws(()=>content.news([{...notice,published:false}]));assert.throws(()=>content.news([notice,notice]));assert.throws(()=>content.news([{date:notice.date,title:notice.title}]));
});

test('Information data version markers match the exact public JSON bytes',()=>{
 const crypto=require('node:crypto'),html=fs.readFileSync(path.join(root,'information.html'),'utf8');
 for(const [name,marker] of [['exhibitions','events'],['news','news']]){
  const hash=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,`assets/data/${name}.json`))).digest('hex').slice(0,12);
  assert(html.includes(`data-information-${marker}-version="${hash}"`));
 }
});

test('same-year exhibitions in different places remain separate edition records',()=>{
 const second={...published[0],id:'fixture-other-city',edition:2,city:'検証専用地域',venue:'検証専用会場',startsAt:'2026-11-01T00:00:00+09:00',endsAt:'2026-11-02T00:00:00+09:00',galleryUrl:undefined,artworkCount:undefined};
 const html=content.archive(state.groupEvents([...published,second],Date.parse('2026-12-01T00:00:00+09:00')).past);
 assert.equal((html.match(/class="information-archive-year"/g)||[]).length,1);
 assert.equal((html.match(/data-event-id=/g)||[]).length,2);
 assert.match(html,/第1回/);assert.match(html,/第2回/);assert.match(html,/横浜/);assert.match(html,/検証専用地域/);
});


test('first Yokohama record never regenerates its removed report link',()=>{
 const first=content.archive(state.groupEvents(published,Date.parse('2026-12-01T00:00:00+09:00')).past);
 assert(published[0].portfolioDetailUrl);
 assert(!first.includes('展示の背景と記録'));assert(!first.includes(published[0].portfolioDetailUrl));assert(!first.includes('concept.html'));
 assert.match(first,/18作品とArtistを見る/);assert.match(first,/href="\.\/gallery\.html"/);assert.match(first,/開催終了/);
 const next={...published[0],id:'fixture-next-archive',edition:2};
 const future=content.archive([next]);assert.match(future,/第2回/);assert.match(future,/展示の背景と記録/);
 const result=spawnSync(process.execPath,['scripts/sync-information.cjs','--check'],{cwd:root,encoding:'utf8'});assert.equal(result.status,0,result.stderr);
 const html=fs.readFileSync(path.join(root,'information.html'),'utf8');
 const archive=html.split('<!-- INFORMATION:ARCHIVE:START -->')[1].split('<!-- INFORMATION:ARCHIVE:END -->')[0];assert(!archive.includes('展示の背景と記録'));assert(!archive.includes(published[0].portfolioDetailUrl));
});
