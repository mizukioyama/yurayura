const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const commerce = require('../assets/js/commerce.js');
const {assessShipping} = require('../scripts/check-commerce-readiness.cjs');
const base = JSON.parse(fs.readFileSync(require('node:path').join(__dirname,'../assets/data/shop-links.json')));
// Synthetic unit fixture only; never written to public config or used for network requests.
function enabled() { return {...structuredClone(base),enabled:true,publicationApproved:true,shopUrl:'https://fixture.square.site/',categories:{'original-art':'https://fixture.square.site/shop/art','goods':null},artists:[{artistId:'Mizuki',url:'https://fixture.square.site/shop/artist',approved:true}],products:[{artworkId:'gallery-work-title-1',artistId:'Mizuki',category:'original-art',squareItemId:'TEST_ONLY',squareChannel:base.siteId,url:'https://fixture.square.site/product/test',published:true,saleApproved:true,imageUseApproved:true}]}; }
test('unpublished default exposes no shop, category, artist or product URL',()=>{
 assert(commerce.validate(base));
 for(const kind of ['shop','category','artist','artwork']) assert.equal(commerce.resolve(base,kind,'anything'),null);
 assert.deepEqual(base.products,[]); assert.equal(base.shopUrl,null);
});
test('publication gate requires both booleans and a confirmed URL',()=>{
 for(const patch of [{enabled:true},{publicationApproved:true},{shopUrl:'https://fixture.square.site/',enabled:true}]) assert.equal(commerce.resolve({...base,...patch},'shop'),null);
 assert.equal(commerce.resolve(enabled(),'shop'),'https://fixture.square.site/');
});
test('URL validation rejects preview, account, foreign origin, credentials and executable URLs',()=>{
 for(const url of ['javascript:alert(1)','http://fixture.square.site/','https://drafts.editmysite.com/d/test/','https://app.squareup.com/dashboard','https://fixture.square.site.evil.example/','https://x:secret@fixture.square.site/','https://fixture.square.site/?preview=1','https://other.square.site/product/test','https://fixture.square.site:8443/','https://fixture.square.site/%2f%2fevil']) {
  const config=enabled(); config.products[0].url=url; assert.equal(commerce.resolve(config,'artwork','gallery-work-title-1'),null,url);
 }
});
test('per-product permission, publication and channel gates fail closed',()=>{
 for(const patch of [{published:false},{saleApproved:false},{imageUseApproved:false},{squareChannel:'OTHER_SITE'}]) {
  const c=enabled(); Object.assign(c.products[0],patch); assert.equal(commerce.resolve(c,'artwork','gallery-work-title-1'),null);
 }
 assert.equal(commerce.resolve(enabled(),'artwork','missing'),null);
 const c=enabled();c.artists[0].approved=false;assert.equal(commerce.resolve(c,'artist','Mizuki'),null);
});
test('public data rejects private pricing/stock/consignment fields and duplicate IDs',()=>{
 for(const patch of [{stock:1},{price:100},{commission:20},{originAddress:'private'}]) {const c=enabled();Object.assign(c.products[0],patch);assert(!commerce.validate(c));}
 const c=enabled();c.products.push({...c.products[0]});assert(!commerce.validate(c));
});
function anchor() { return {hidden:true,attrs:{},set href(v){this.attrs.href=v;},set target(v){this.attrs.target=v;},set rel(v){this.attrs.rel=v;},removeAttribute(k){delete this.attrs[k];}}; }
test('changing artworks removes stale purchase URLs and all external target state',()=>{
 const product=anchor(), artist=anchor(); const doc={getElementById:id=>id==='galleryModalShopLink'?product:artist};
 commerce.config=enabled(); commerce.updateArtwork('gallery-work-title-1','Mizuki',doc);assert(!product.hidden);assert.equal(product.attrs.rel,'noopener noreferrer');
 commerce.updateArtwork('unregistered','unregistered',doc);assert(product.hidden);assert.deepEqual(product.attrs,{});assert(artist.hidden);
 commerce.config=null;
});
test('disabled navigation creates no elements or links',()=>{
 commerce.config=base;commerce.hydrateNavigation({querySelector(){throw Error('should not mutate or query nav');}});
});
const ship=(id,origin='ORIGIN_TEST',profile='PROFILE_TEST')=>({id,quantity:1,method:'shipping',originId:origin,shippingProfileId:profile,shippingTermsConfirmed:true});
test('five purchase cases require actual Square evidence, not local arithmetic',()=>{
 const cases=[[ship('g1'),ship('g2')],[ship('a1'),ship('a2')],[ship('a1','ARTIST_A'),ship('a2','ARTIST_B')],[ship('g'),ship('a','ARTIST_A')],[ship('g'),{id:'a',quantity:1,method:'pickup',eventId:'EVENT_TEST',pickupTermsConfirmed:true}]];
 for(const items of cases){const result=assessShipping(items);assert.equal(result.status,'EXTERNAL_BLOCKED');assert(result.reasons.includes('SQUARE_VERIFICATION_REQUIRED'));assert.equal(assessShipping(items,{squareVerified:true,evidenceId:'test',combination:'wrong'}).status,'EXTERNAL_BLOCKED');assert.equal(assessShipping(items,{squareVerified:true,evidenceId:'TEST_ONLY',combination:result.combination}).status,'READY_FOR_REVIEW');}
});
test('unknown Goods origin and pickup conditions remain pending',()=>{
 assert.equal(assessShipping([{...ship('g'),originId:null}]).status,'USER_ACTION_PENDING');
 assert.equal(assessShipping([{id:'a',method:'pickup',eventId:null}]).status,'USER_ACTION_PENDING');
 assert.equal(assessShipping([]).status,'USER_ACTION_PENDING');
});
test('public mapping must match the existing artwork and Artist, not just two valid IDs',()=>{
 const {checkLinks}=require('../scripts/check-commerce-readiness.cjs');
 assert(checkLinks(enabled())); const c=enabled();c.products[0].artistId='KAoRU';assert(!checkLinks(c));c.products[0].artworkId='nonexistent';assert(!checkLinks(c));
});
test('invalid shipping quantities never become ready',()=>{
 for(const quantity of [0,-1,1.5,null,NaN]) assert.equal(assessShipping([{...ship('g'),quantity}]).status,'USER_ACTION_PENDING');
});
test('unknown category keys cannot resolve inherited object members',()=>{
 for(const id of ['toString','constructor','__proto__','unknown']) assert.equal(commerce.resolve(enabled(),'category',id),null);
});
test('displayed Artist must match the product mapping at runtime',()=>{
 const product=anchor(), artist=anchor(); const doc={getElementById:id=>id==='galleryModalShopLink'?product:artist};
 commerce.config=enabled();commerce.updateArtwork('gallery-work-title-1','KAoRU',doc);
 assert(product.hidden);assert.deepEqual(product.attrs,{});commerce.config=null;
});
test('brand navigation initializes before a stalled commerce import',async()=>{
 const vm=require('node:vm');const source=fs.readFileSync(require('node:path').join(__dirname,'../assets/js/allmenu.js'),'utf8');
 const callback=source.slice(source.indexOf('  const PARTS_PATH'),source.indexOf('\nfunction initializeHeaderMenu()')).replace(/\n\}\);\s*$/, '').replace(/await import\([^;]+\);/, 'await stalledImport;');
 const calls=[];const document={querySelector:()=>({innerHTML:''}),body:{classList:{add:x=>calls.push(x)}},dispatchEvent:e=>calls.push(e.type)};
 const scope={stalledImport:new Promise(()=>{}),document,window:{},Event:class{constructor(type){this.type=type}},fetch:async()=>({ok:true,text:async()=>''})};
 for(const name of ['initializeHeaderScroll','initializeHeaderMenu','initializeCurrentYear','initializeCurrentPage','initializeCustomCursor','initializeScrollGuidePosition'])scope[name]=()=>calls.push(name);
 const loading=vm.runInNewContext('(async()=>{'+callback+'})()',scope);
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(await Promise.race([loading.then(()=>true),Promise.resolve(false)]),false);
 assert(calls.includes('initializeHeaderMenu'));assert(calls.includes('yurayura:fragments-ready'));
});
test('late Shop links participate in the existing menu focus trap and click close',()=>{
 const vm=require('node:vm'); const source=fs.readFileSync(require('node:path').join(__dirname,'../assets/js/allmenu.js'),'utf8');
 const handlers={}; const classes=new Set(); let active;let links=[];
 const element=()=>({attrs:{},inert:false,disabled:false,getClientRects:()=>[{}],focus(){active=this},setAttribute(k,v){this.attrs[k]=v},removeAttribute(k){delete this.attrs[k]},addEventListener(k,f){this[k]=f}});
 const toggle=element(),menu=element(),first=element();links=[first];
 const header={classList:{contains:x=>classes.has(x),toggle(x,v){v?classes.add(x):classes.delete(x)}},querySelector:s=>s==='.menu-toggle'?toggle:s==='#header-menu'?menu:null,querySelectorAll:()=>links,addEventListener(k,f){handlers[k]=f}};
 const document={querySelector:()=>header,body:{children:[],classList:{add(){},remove(){}},style:{setProperty(){},removeProperty(){}}},documentElement:{style:{}},dispatchEvent(){},addEventListener(k,f){handlers['doc:'+k]=f},get activeElement(){return active}};
 const window={matchMedia:()=>({matches:true,addEventListener(){}}),scrollY:0,requestAnimationFrame:f=>f()};
 vm.runInNewContext(source.slice(source.indexOf('function initializeHeaderMenu()'),source.indexOf('function initializeCurrentYear()'))+'\ninitializeHeaderMenu();',{document,window,CustomEvent:class{}});
 const shop=element();links.push(shop);toggle.click();assert.equal(toggle.attrs['aria-expanded'],'true');shop.focus();let prevented=false;
 handlers['doc:keydown']({key:'Tab',shiftKey:false,preventDefault(){prevented=true}});assert(prevented);assert.equal(active,toggle);
 handlers.click({target:{closest:()=>shop}});assert.equal(toggle.attrs['aria-expanded'],'false');assert.equal(active,toggle);
});
