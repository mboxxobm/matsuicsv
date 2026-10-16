'use strict';
// Display coordinates only. Trade timestamps, prices and quantities stay intact.
window.createDiaryTradingTime = function(series, stamp) {
  const stock=!!series.deltaEstimated;
  const dates=[...new Set(series.completed.map(r=>stamp(r.t).slice(0,10)))].sort();
  const size=19815; // 09:00–11:30 + 12:30–15:30, plus a slot for the closing auction.
  const sessions=dates.map((date,i)=>({date,base:i*size,open:Date.parse(date+'T09:00:00+09:00')/1000,
    amEnd:Date.parse(date+'T11:30:00+09:00')/1000,pm:Date.parse(date+'T12:30:00+09:00')/1000,
    close:Date.parse(date+'T15:30:00+09:00')/1000}));
  function project(t, end=false) {
    if(!stock)return t;
    let s=sessions[0];
    for(const candidate of sessions)if(t>=candidate.open)s=candidate;
    if(t<s.open)return s.base;
    if(t<=s.amEnd)return s.base+Math.max(0,t-s.open);
    if(t<s.pm)return s.base+9000;
    if(t<s.close)return s.base+9000+t-s.pm;
    return s.base+19800+(end||t>s.close?15:0);
  }
  function unproject(a) {
    if(!stock)return a;
    const index=Math.max(0,Math.min(sessions.length-1,Math.floor(Math.max(0,a)/size))),s=sessions[index];
    const offset=Math.max(0,Math.min(size,a-s.base));
    if(offset<9000)return s.open+offset;
    if(offset<19800)return s.pm+offset-9000;
    return s.close;
  }
  function ticks(bounds, step, cursor) {
    if(!stock){const result=[];for(let t=Math.ceil(bounds.start/step)*step;t<=bounds.end&&t<=cursor;t+=step)result.push({t,a:t,label:stamp(t).slice(11,16)});return result;}
    const candidates=[];
    for(const s of sessions){
      for(const [start,end] of [[s.open,s.amEnd],[s.pm,s.close]]){
        const times=new Set([start,end]);
        for(let t=Math.ceil(start/step)*step;t<end;t+=step)times.add(t);
        for(const t of times){const a=project(t);if(t<=cursor&&a>=bounds.start&&a<=bounds.end)candidates.push({t,a,priority:t===s.open?3:t===s.pm?2:1,label:t===s.open?s.date.slice(5)+' 09:00':stamp(t).slice(11,16)});}
      }
    }
    const sorted=candidates.sort((a,b)=>a.a-b.a||b.priority-a.priority),seen=new Set();for(const tick of sorted){const date=stamp(tick.t).slice(0,10);if(!seen.has(date)){tick.label=date.slice(5)+' '+stamp(tick.t).slice(11,16);tick.priority=3;seen.add(date);}}return sorted;
  }
  return {stock,dates,sessions,project,unproject,ticks,min:stock?0:series.completed[0].t,
    max:project(series.maxTime,true),dayStart:project(series.start)};
};
