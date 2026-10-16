'use strict';
((root)=>{
 function aliasMapFrom(dictionary,taxonomy){
  const map={};
  for(const row of dictionary?.tags||[]){
   const canonical=String(row.tag||'');
   if(!canonical)continue;
   map[canonical]=canonical;
   for(const alias of row.aliases||[])map[String(alias)]=canonical;
  }
  for(const group of taxonomy?.confirmed_alias_groups||[]){
   const canonical=String(group.canonical||'');
   if(!canonical)continue;
   map[canonical]=canonical;
   for(const alias of group.aliases||[])map[String(alias)]=canonical;
  }
  return map;
 }
 const canonicalTag=(value,aliases={})=>aliases[String(value)]||String(value);
 function matchTagSelection({selectedTags=[],directTags=[],rawTags=[],composites=[],taxonomy={},selectedRelated=[],includeComposite=false,mode='and',aliases={}}={}){
  const selected=[...new Set(selectedTags.map(x=>canonicalTag(x,aliases)))];
  const direct=new Set(directTags.map(x=>canonicalTag(x,aliases)));
  const raw=new Set(rawTags.map(String));
  const related=new Set(selectedRelated);
  const matchedTags=[];
  for(const tag of selected){
   const reasons=[];
   if(direct.has(tag)){
    const alias=[...raw].find(value=>canonicalTag(value,aliases)===tag&&value!==tag);
    reasons.push(alias?'別名 '+alias+' → '+tag:'元タグ '+tag);
   }
   if(includeComposite){
    for(const composite of composites){
     if((composite.base_tags||[]).map(x=>canonicalTag(x,aliases)).includes(tag)){
      reasons.push('複合表記「'+(composite.raw_terms||[]).join('／')+'」を展開');
     }
    }
   }
   for(const relation of taxonomy.related_relations||[]){
    if(relation.from_tag!==tag)continue;
    const key=relation.from_tag+'\u001f'+relation.to_tag;
    if(related.has(key)&&direct.has(canonicalTag(relation.to_tag,aliases)))reasons.push('関連候補 '+relation.to_tag+' を追加');
   }
   if(reasons.length)matchedTags.push({tag,reasons:[...new Set(reasons)]});
  }
  const matched=!selected.length||(mode==='or'?matchedTags.length>0:matchedTags.length===selected.length);
  return {matched,matchedTags,selectedTags:selected};
 }
 const api={aliasMapFrom,canonicalTag,matchTagSelection};
 root.DiaryTagMatching=api;
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
