// Private event management input must stay outside this public repository.
const fs=require('node:fs'),path=require('node:path');
const {instant,eventState}=require('../assets/js/exhibition-state.js');
function publicEvents(rows) {
 if(!Array.isArray(rows))throw new Error('Array required');const ids=new Set();
 return rows.filter(e=>e.published===true).map(e=>{
  if(!/^[a-z0-9-]+$/.test(e.id)||ids.has(e.id)||!Number.isInteger(e.edition)||e.edition<1||eventState(e)==='unknown')throw new Error('Invalid event');
  ids.add(e.id);for(const k of ['city','venue'])if(typeof e[k]!=='string'||!e[k].trim())throw new Error('Missing public copy');
  const row={id:e.id,edition:e.edition,published:true,city:e.city,venue:e.venue,startsAt:e.startsAt,endsAt:e.endsAt};
  if(e.galleryUrl!==undefined){if(!/^\.\/[a-z0-9-]+\.html$/.test(e.galleryUrl)||!fs.existsSync(path.resolve(__dirname,'..',e.galleryUrl)))throw new Error('Invalid gallery URL');row.galleryUrl=e.galleryUrl;}
  if(Array.isArray(e.artists)&&e.artists.every(a=>typeof a==='string'))row.artists=e.artists;
  if(Number.isInteger(e.artworkCount)&&e.artworkCount>=0)row.artworkCount=e.artworkCount;
  const rec=e.recruitment;
  if(rec?.published===true){if(!Number.isFinite(instant(rec.startsAt))||!Number.isFinite(instant(rec.endsAt))||instant(rec.endsAt)<=instant(rec.startsAt))throw new Error('Invalid recruitment');row.recruitment={published:true,startsAt:rec.startsAt,endsAt:rec.endsAt,receiverVerified:false};}
  return row;
 });
}
module.exports={publicEvents};
if(require.main===module){
 const input=process.argv[2];if(!input)throw new Error('Usage: node scripts/export-public-events.cjs /private/event-source.json');
 const root=fs.realpathSync(path.resolve(__dirname,'..')),source=fs.realpathSync(input);
 if(source===root||source.startsWith(root+path.sep))throw new Error('Private source must stay outside public repository');
 const output=publicEvents(JSON.parse(fs.readFileSync(source,'utf8')));
 fs.writeFileSync(path.join(root,'assets/data/exhibitions.json'),JSON.stringify(output,null,2)+'\n');console.log(`Exported ${output.length} public events`);
}
