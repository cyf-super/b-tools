const r=["B","KB","MB","GB","TB"],n=(o,a=2)=>{if(o===0)return"0B";const t=Math.floor(Math.log(o)/Math.log(1024));return parseFloat((o/Math.pow(1024,t)).toFixed(a))+r[t]};export{n as f};
