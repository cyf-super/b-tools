import{j as s}from"./index-a_A2CTlT.js";import{i as l}from"./index-GERrQxdy.js";function u({value:o,onSelect:c,OPTIONS:n,label:a}){return s.jsxs("div",{className:l.selectBox,children:[a&&s.jsxs(s.Fragment,{children:[s.jsx("span",{className:l.icon}),s.jsx("label",{htmlFor:a,children:a})]}),s.jsx("select",{id:a,onChange:e=>{const t=e.target.value;c(Number.isNaN(+t)?t:+t)},onClick:e=>{e.stopPropagation()},defaultValue:o,className:l.select,children:n.map(e=>s.jsx("option",{value:e.value,selected:e.value===o,className:l.selectOption,children:e.label},e.value))})]})}export{u as S};
