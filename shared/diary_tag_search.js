'use strict';
(()=>{
 const normalize=value=>String(value??'').normalize('NFKC').toLowerCase().replace(/[ァ-ヶ]/g,c=>String.fromCharCode(c.charCodeAt(0)-0x60)).replace(/[\s\-_.:/#｜・、。]/g,'');
 const parse=value=>{try{return JSON.parse(value||'[]')}catch(_e){return []}};
 const root=document.querySelector('[data-tag-index]');
 if(root){
  const query=root.querySelector('[data-index-query]');
  const symbolFilter=root.querySelector('[data-symbol-filter]');
  const execution=root.querySelector('[data-execution-filter]');
  const source=root.querySelector('[data-source-filter]');
  const timeframe=root.querySelector('[data-timeframe-filter]');
  const modeInputs=[...root.querySelectorAll('[data-tag-mode]')];
  const includeComposite=root.querySelector('[data-include-composite]');
  const sceneCards=[...root.querySelectorAll('[data-scene-card]')];
  const diaryCards=[...root.querySelectorAll('[data-diary-card]')];
  const chips=[...root.querySelectorAll('[data-filter-tag]')];
  const relatedButtons=[...root.querySelectorAll('[data-related-parent]')];
  const tagMatching=window.DiaryTagMatching;
  const count=root.querySelector('[data-index-count]');
  const sceneEmpty=root.querySelector('[data-scene-empty]');
  const diaryEmpty=root.querySelector('[data-diary-empty]');
  let aliases={};
  let taxonomy={};
  try{
   const embedded=JSON.parse(root.querySelector('#diary-tag-index-data')?.textContent||'{}');
   aliases=tagMatching.aliasMapFrom(embedded.tag_dictionary,embedded.tag_taxonomy);
   taxonomy=embedded.tag_taxonomy||{};
  }catch(_e){}
  const canonicalTag=value=>tagMatching.canonicalTag(value,aliases);
  const availableTags=new Set(chips.map(c=>c.dataset.filterTag));
  const selectedTags=[];
  const selectedRelated=new Set();
  let tagMode='and';
  let diaryId='';
  let caseId='';
  function restoreFromUrl(){
   const params=new URLSearchParams(location.search);
   selectedTags.splice(0,selectedTags.length);
   for(const raw of params.getAll('tag')){
    const canonical=canonicalTag(raw);
    if(availableTags.has(canonical)&&!selectedTags.includes(canonical))selectedTags.push(canonical);
   }
   selectedRelated.clear();
   for(const key of params.getAll('related'))selectedRelated.add(key);
   diaryId=params.get('diary_id')||'';
   caseId=params.get('case_id')||'';
   query.value=params.get('q')||'';
   const symbolParam=params.get('symbol')||'';
   symbolFilter.value=[...symbolFilter.options].some(o=>o.value===symbolParam)?symbolParam:'';
   const execParam=params.get('execution')||'';
   execution.value=[...execution.options].some(o=>o.value===execParam)?execParam:'';
   const sourceParam=params.get('source')||'';
   source.value=[...source.options].some(o=>o.value===sourceParam)?sourceParam:'';
   const timeframeParam=params.get('timeframe')||'';
   timeframe.value=[...timeframe.options].some(o=>o.value===timeframeParam)?timeframeParam:'';
   tagMode=params.get('mode')==='or'?'or':'and';
   includeComposite.checked=params.get('composite')==='1';
   for(const input of modeInputs)input.checked=input.value===tagMode;
   render();
  }
  function updateUrl({push=false}={}){
   const next=new URLSearchParams();
   if(query.value.trim())next.set('q',query.value.trim());
   for(const tag of selectedTags)next.append('tag',tag);
   if(symbolFilter.value)next.set('symbol',symbolFilter.value);
   if(diaryId)next.set('diary_id',diaryId);
   if(caseId)next.set('case_id',caseId);
   if(execution.value)next.set('execution',execution.value);
   if(source.value)next.set('source',source.value);
   if(timeframe.value)next.set('timeframe',timeframe.value);
   if(tagMode==='or')next.set('mode','or');
   if(includeComposite.checked)next.set('composite','1');
   for(const key of selectedRelated)next.append('related',key);
   const suffix=next.toString();
   const url=location.pathname+(suffix?'?'+suffix:'')+location.hash;
   try{if(push)history.pushState(null,'',url);else history.replaceState(null,'',url);}catch(_e){}
  }
  const directTags=card=>parse(card.dataset.tags);
  const rawTags=card=>parse(card.dataset.rawTags);
  const composites=card=>parse(card.dataset.composites);
  function hasText(text,words){return words.every(word=>text.includes(word));}
  function render(){
   const words=query.value.trim().split(/[\s　]+/).filter(Boolean).map(normalize);
   const visibleSceneIds=new Set();
   let sceneCount=0,diaryCount=0;
   const relatedParents=new Set(selectedTags);
   for(const button of relatedButtons){
    const show=relatedParents.has(button.dataset.relatedParent);
    button.hidden=!show;
    const key=button.dataset.relatedParent+'\u001f'+button.dataset.relatedTarget;
    button.setAttribute('aria-pressed',String(selectedRelated.has(key)));
   }
   for(const card of sceneCards){
    const text=normalize(card.dataset.searchText||'');
    const tagResult=tagMatching.matchTagSelection({selectedTags,directTags:directTags(card),rawTags:rawTags(card),composites:composites(card),taxonomy,selectedRelated,includeComposite:includeComposite.checked,mode:tagMode,aliases});
    const matchedTags=tagResult.matchedTags;
    const tagMatch=tagResult.matched;
    const wantedSymbol=symbolFilter.value;
    const timeframeMatch=!timeframe.value||card.dataset.timeframe===timeframe.value;
    const visible=(!diaryId||card.dataset.diaryId===diaryId)&&(!caseId||card.dataset.caseId===caseId)&&tagMatch&&(!wantedSymbol||card.dataset.symbol===wantedSymbol)&&(!execution.value||card.dataset.execution===execution.value)&&(!source.value||card.dataset.source===source.value)&&timeframeMatch&&hasText(text,words);
    card.hidden=!visible;
    card.classList.toggle('is-selected-case',Boolean(caseId&&card.dataset.caseId===caseId));
    const reasonNode=card.querySelector('[data-match-reason]');
    if(visible&&reasonNode){
     const parts=[];
     if(matchedTags.length)parts.push('タグ一致（'+(tagMode==='and'?'AND':'OR')+'）: '+matchedTags.map(x=>x.tag+' ← '+x.reasons.join('・')).join('；'));
     if(wantedSymbol)parts.push('同じ場面の銘柄: '+(wantedSymbol==='__unknown__'?'未確認':wantedSymbol==='__multiple__'?'複数銘柄／集約記録':wantedSymbol));
     if(execution.value)parts.push('実行区分: '+execution.value);
     if(timeframe.value)parts.push('時間足: '+(timeframe.value==='__unknown__'?'未確認／未記載':timeframe.value));
     if(words.length)parts.push('本文・ID一致');
     if(caseId)parts.push('scene/case ID指定');
     reasonNode.textContent=parts.join('｜');
     reasonNode.hidden=!parts.length;
    }
    if(visible){sceneCount++;visibleSceneIds.add(card.dataset.diaryId);}
   }
   const sceneFilterActive=Boolean(selectedTags.length||symbolFilter.value||caseId||execution.value||source.value||timeframe.value);
   for(const card of diaryCards){
    const text=normalize(card.dataset.searchText||'');
    const passesSceneFilter=!sceneFilterActive||visibleSceneIds.has(card.dataset.diaryId);
    const visible=(!diaryId||card.dataset.diaryId===diaryId)&&passesSceneFilter&&hasText(text,words);
    card.hidden=!visible;
    if(visible)diaryCount++;
   }
   for(const chip of chips)chip.setAttribute('aria-pressed',String(selectedTags.includes(chip.dataset.filterTag)));
   const active=selectedTags.length?' ｜ tags: '+selectedTags.join(tagMode==='and'?' ＋ ':' または '):'';
   count.textContent='場面 '+sceneCount+'件 / 日誌 '+diaryCount+'件'+active+(symbolFilter.value?' ｜ '+(symbolFilter.value==='__unknown__'?'銘柄未確認':symbolFilter.value==='__multiple__'?'複数銘柄／集約記録':symbolFilter.value):'')+(timeframe.value?' ｜ '+(timeframe.value==='__unknown__'?'時間足未確認':timeframe.value):'')+(diaryId?' ｜ '+diaryId:'')+(includeComposite.checked?' ｜ 複合表記を含む':'');
   sceneEmpty.hidden=sceneCount>0;
   diaryEmpty.hidden=diaryCount>0;
  }
  query.addEventListener('input',()=>{render();updateUrl();});
  symbolFilter.addEventListener('change',()=>{render();updateUrl({push:true});});
  execution.addEventListener('change',()=>{render();updateUrl({push:true});});
  source.addEventListener('change',()=>{render();updateUrl({push:true});});
  timeframe.addEventListener('change',()=>{render();updateUrl({push:true});});
  for(const input of modeInputs)input.addEventListener('change',()=>{tagMode=input.value;render();updateUrl({push:true});});
  includeComposite.addEventListener('change',()=>{render();updateUrl({push:true});});
  for(const chip of chips)chip.addEventListener('click',()=>{
   const tag=chip.dataset.filterTag;
   const index=selectedTags.indexOf(tag);
   if(index>=0){selectedTags.splice(index,1);for(const key of [...selectedRelated])if(key.startsWith(tag+'\u001f'))selectedRelated.delete(key);}
   else selectedTags.push(tag);
   render();updateUrl({push:true});
  });
  for(const button of relatedButtons)button.addEventListener('click',()=>{
   const key=button.dataset.relatedParent+'\u001f'+button.dataset.relatedTarget;
   if(selectedRelated.has(key))selectedRelated.delete(key);else selectedRelated.add(key);
   render();updateUrl({push:true});
  });
  root.querySelector('[data-index-clear]').addEventListener('click',()=>{
   query.value='';symbolFilter.value='';execution.value='';source.value='';timeframe.value='';selectedTags.splice(0);selectedRelated.clear();diaryId='';caseId='';tagMode='and';includeComposite.checked=false;
   for(const input of modeInputs)input.checked=input.value==='and';
   try{history.replaceState(null,'',location.pathname+location.hash);}catch(_e){}
   render();query.focus();
  });
  window.addEventListener('popstate',restoreFromUrl);
  restoreFromUrl();
  if(caseId){const card=sceneCards.find(c=>c.dataset.caseId===caseId);if(card)card.scrollIntoView({block:'center'});}
 }
 for(const section of document.querySelectorAll('[data-diary-tag-search]')){
  const query=section.querySelector('[data-tag-query]');
  const cards=[...section.querySelectorAll('.diary-tag-entry')];
  const chips=[...section.querySelectorAll('[data-filter-tag]')];
  const count=section.querySelector('[data-tag-count]');
  const empty=section.querySelector('[data-tag-empty]');
  let selected=chips.some(c=>c.dataset.filterTag===new URLSearchParams(location.search).get('tag'))?new URLSearchParams(location.search).get('tag'):'';
  query.value=new URLSearchParams(location.search).get('q')||'';
  const diaryId=new URLSearchParams(location.search).get('diary_id')||'';
  const searchData=cards.map(card=>({card,text:normalize(card.dataset.searchText||''),tags:parse(card.dataset.tags)}));
  function renderLegacy(){
   const words=query.value.trim().split(/[\s　]+/).filter(Boolean).map(normalize);let found=0;
   for(const r of searchData){const visible=(!selected||r.tags.includes(selected))&&(!diaryId||!r.card.dataset.diaryId||r.card.dataset.diaryId===diaryId)&&words.every(w=>r.text.includes(w));r.card.hidden=!visible;if(visible)found++;}
   for(const chip of chips)chip.setAttribute('aria-pressed',String(chip.dataset.filterTag===selected));
   count.textContent=found+'件 / 全'+cards.length+'件'+(selected?' · #'+selected:'');empty.hidden=found>0;
  }
  query.addEventListener('input',renderLegacy);
  for(const chip of chips)chip.addEventListener('click',()=>{selected=selected===chip.dataset.filterTag?'':chip.dataset.filterTag;renderLegacy();});
  section.querySelector('[data-tag-clear]').addEventListener('click',()=>{selected='';query.value='';renderLegacy();query.focus();});
  renderLegacy();
 }
})();
