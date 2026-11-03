const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.join(__dirname,'..'),html=fs.readFileSync(path.join(root,'support.html'),'utf8');
test('Support retains every commerce hook and fails closed without JavaScript',()=>{
 for(const category of ['original-art','goods']){
  assert.equal((html.match(new RegExp('data-shop-section="'+category+'"','g'))||[]).length,1);
  assert.match(html,new RegExp('<a[^>]*data-shop-category="'+category+'"[^>]* hidden>'));
 }
 assert.equal((html.match(/data-shop-category-copy/g)||[]).length,2);
 assert.match(html,/data-shop-notice>[^<]*現在、購入・決済はできません/);
 for(const tag of html.match(/<a\b[^>]*data-shop-category[^>]*>/g))assert(!/\bhref=/.test(tag));
});
test('Support in-page links have one target and approved related pages exist',()=>{
 for(const id of ['digital','original-art','goods','commission']){
  assert.equal((html.match(new RegExp('id="'+id+'"','g'))||[]).length,1);assert(html.includes('href="#'+id+'"'));
 }
 for(const [,target] of html.matchAll(/href="\.\/([^"?#]+\.html)(?:#[^"]*)?"/g))assert(fs.existsSync(path.join(root,target)),target);
 assert.match(html,/index, follow, noimageindex/);assert.match(html,/https:\/\/mizukioyama.github.io\/yurayura\/support.html/);
});
test('image-free catalog introduces no placeholders, prices or independent sales data',()=>{
 assert(!/<img\b/.test(html));assert(!/square\.site|squareup\.com|¥|円（税込）|data-shop-artwork/.test(html));
 const css=fs.readFileSync(path.join(root,'assets/css/support.css'),'utf8');assert(!/font-size\s*:|!important/.test(css));
 const hash=crypto.createHash('sha256').update(css).digest('hex').slice(0,12);assert(html.includes('assets/css/support.css?v='+hash));
});
