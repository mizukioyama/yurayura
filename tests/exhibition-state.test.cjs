const test=require('node:test'),assert=require('node:assert/strict');
const {eventState,recruitmentState}=require('../assets/js/exhibition-state.js');
const {publicEvents}=require('../scripts/export-public-events.cjs');
const event={id:'example-01',edition:1,published:true,city:'横浜',venue:'確認済み会場',startsAt:'2026-10-06T13:00:00+09:00',endsAt:'2026-10-12T13:00:00+09:00'};
test('JST event boundaries, independent of host timezone',()=>{const start=Date.parse('2026-10-06T04:00:00Z'),end=Date.parse('2026-10-12T04:00:00Z');assert.equal(eventState(event,start-1),'upcoming');assert.equal(eventState(event,start),'current');assert.equal(eventState(event,end-1),'current');assert.equal(eventState(event,end),'past');});
test('unpublished and malformed events fail closed',()=>{assert.equal(eventState({...event,published:false}),'unpublished');assert.equal(eventState({...event,startsAt:'2026-10-06T13:00:00'}),'unknown');assert.equal(eventState({...event,endsAt:event.startsAt}),'unknown');assert.equal(eventState(event,NaN),'unknown');});
test('recruitment requires verified receiver and respects exact deadline',()=>{const e={...event,recruitment:{published:true,receiverVerified:true,startsAt:event.startsAt,endsAt:event.endsAt}};const start=Date.parse(event.startsAt),end=Date.parse(event.endsAt);assert.equal(recruitmentState(e,start-1),'planning');assert.equal(recruitmentState(e,start),'open');assert.equal(recruitmentState(e,end-1),'open');assert.equal(recruitmentState(e,end),'closed');assert.equal(recruitmentState({...e,recruitment:{...e.recruitment,receiverVerified:false}},start),'planning');assert.equal(recruitmentState({...e,published:false},start),'planning');});
test('public export strips unpublished events and confidential fields',()=>{const rows=publicEvents([{...event,privateNotes:'PRIVATE',recruitment:{published:false,secret:'PRIVATE'}},{...event,id:'secret',published:false,privateNotes:'PRIVATE'}]);assert.equal(rows.length,1);assert(!JSON.stringify(rows).includes('PRIVATE'));assert(!('recruitment' in rows[0]));assert.throws(()=>publicEvents([event,event]));assert.throws(()=>publicEvents([{...event,galleryUrl:'https://example.com'}]));});
test('export never enables a receiver or emits private recruitment fields',()=>{const [e]=publicEvents([{...event,recruitment:{published:true,receiverVerified:true,startsAt:event.startsAt,endsAt:event.endsAt,applicants:['PRIVATE']}}]);assert.equal(e.recruitment.receiverVerified,false);assert(!JSON.stringify(e).includes('PRIVATE'));});

test('published undated events stay upcoming; unpublished copy never enters display groups',()=>{
 const {groupEvents,visibleEvents}=require('../assets/js/exhibition-state.js');
 const undated={...event,id:'undated',startsAt:null,endsAt:null};
 assert.equal(eventState(undated),'undated');
 const groups=groupEvents([undated,{...event,id:'private',published:false,venue:'DO_NOT_DISPLAY'}]);
 assert.equal(groups.upcoming[0].id,'undated');assert(!JSON.stringify(groups).includes('DO_NOT_DISPLAY'));
 assert.throws(()=>visibleEvents({}));assert.throws(()=>visibleEvents([{...event,endsAt:null}]));
 assert.equal(publicEvents([undated])[0].startsAt,null);
});

const {recruitmentView,instant}=require('../assets/js/exhibition-state.js');
const recStart=Date.parse('2026-10-06T13:00:00+09:00'),recEnd=Date.parse('2026-10-12T13:00:00+09:00');
const confirmed={...event,recruitment:{published:true,receiverVerified:true,startsAt:event.startsAt,endsAt:event.endsAt}};
for(const [name,rows,now,failed,expected] of [
 ['no recruitment',[event],recStart,false,'none'],
 ['planning',[{...event,recruitment:{published:false}}],recStart,false,'planning'],
 ['before start',[confirmed],recStart-1,false,'upcoming'],
 ['verified open',[confirmed],recStart,false,'open'],
 ['closed',[confirmed],recEnd,false,'closed'],
 ['fetch failed',[],recStart,true,'error']
])test('recruitment view: '+name,()=>{
 const view=recruitmentView(rows,now,failed);assert.equal(view.state,expected);
 assert(view.copy.method&&view.copy.faq&&view.copy.conditions);
 if(expected==='open') {assert.match(view.status,/募集中/);assert(!/受け付けていません|未定です|募集準備中|受付停止/.test(Object.values(view.copy).join('')));}
 else assert(!view.status.includes('募集中'));
});
test('view fails closed for missing receiver, unpublished data, invalid calendar/event/recruitment, or clock',()=>{
 const variants=[{...confirmed,published:false},{...confirmed,startsAt:'bad'},{...confirmed,edition:0},{...confirmed,recruitment:{...confirmed.recruitment,receiverVerified:false}},{...confirmed,recruitment:{...confirmed.recruitment,receiverVerified:'true'}},{...confirmed,recruitment:{...confirmed.recruitment,startsAt:'2026-02-30T00:00:00+09:00'}}];
 for(const e of variants)assert.notEqual(recruitmentView([e],recStart).state,'open');
 assert.equal(recruitmentView({},recStart).state,'error');assert.equal(recruitmentView([confirmed],NaN).state,'error');
 assert(Number.isNaN(instant('2026-02-30T00:00:00+09:00')));assert(Number.isNaN(instant('2026-10-06T24:00:00+09:00')));
});
test('an approved open recruitment is not masked by a planning row; date boundaries update copy together',()=>{
 const planning={...event,id:'planning',recruitment:{published:true,receiverVerified:false,startsAt:event.startsAt,endsAt:event.endsAt}};
 assert.equal(recruitmentView([planning,confirmed],recStart).state,'open');
 assert.match(recruitmentView([confirmed],recStart-1).copy.faq,/受付開始前/);
 assert.match(recruitmentView([confirmed],recStart).copy.faq,/募集期間中/);
 assert.match(recruitmentView([confirmed],recEnd).copy.faq,/終了/);
});

test("sculpture weight remains a per-piece venue-dependent guideline",()=>{
 const none=recruitmentView([event],recStart);
 const planning=recruitmentView([{...event,recruitment:{published:false}}],recStart);
 const failed=recruitmentView([],recStart,true);
 const expected="絵画などの平面作品に加え、立体作品やデジタルサイネージも取り入れたいと考えています。立体作品は、1点あたり最大20kgを目安に考えています。ただし、会場の設備や展示方法によって対応できる重量が変わるため、20kg以下でも展示できない場合があります。正式な条件は会場が決まり次第ご案内します。会場の耐荷重・展示設備・安全基準を優先します。吊り展示については引き続き検討中です。";
 for(const view of [none,planning,failed]){
  assert.equal(view.copy.conditions,expected);
  assert.match(view.copy.conditions,/1点あたり最大20kgを目安/);
  assert.match(view.copy.conditions,/会場の設備や展示方法によって対応できる重量が変わる/);
  assert.match(view.copy.conditions,/20kg以下でも展示できない場合があります/);
  assert.match(view.copy.conditions,/会場の耐荷重・展示設備・安全基準を優先/);
  assert.match(view.copy.conditions,/吊り展示については引き続き検討中/);
  assert.doesNotMatch(view.copy.conditions,/20kgまで展示可能|重量20kgまで/);
 }
 const announced=[
  ["upcoming",recStart-1],
  ["open",recStart],
  ["closed",recEnd]
 ];
 for(const [state,now] of announced){
  const view=recruitmentView([confirmed],now);
  assert.equal(view.state,state);
  assert.match(view.copy.conditions,/正式な募集要項/);
  assert.doesNotMatch(view.copy.conditions,/20kg/);
 }
 const html=require("node:fs").readFileSync(require("node:path").join(__dirname,"..","participate.html"),"utf8");
 const staticCondition=html.match(/<p data-recruitment-copy="conditions">([^<]+)<\/p>/);
 assert.ok(staticCondition);
 assert.equal(staticCondition[1],expected);
 assert.doesNotMatch(html,/重量20kgまでを想定/);
});

test("participation page preserves the seven accordion sections and initial open state",()=>{
 const html=require("node:fs").readFileSync(require("node:path").join(__dirname,"..","participate.html"),"utf8");
 const items=[...html.matchAll(/<details class="path-details"( open)?><summary>([^<]+)<\/summary>/g)];
 assert.deepEqual(items.map(item=>item[2]),[
  "次回の展示について",
  "どんな人に参加してほしい？",
  "人数と作品数について",
  "作品の準備と発送について",
  "参加費と販売について",
  "お申し込みについて",
  "よくあるご質問"
 ]);
 assert.equal(items.filter(item=>Boolean(item[1])).length,1);
 assert.equal(items[0][1]," open");
});
