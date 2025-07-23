import{f as v,c as I,g as _,b as M,r as d,d as O,_ as z,e as g,j as u,s as U,h as A,i as W,k as y,l as R,B as C}from"./index-BSiOH9rq.js";function L(t,n=0,a=1){return I(t,n,a)}function B(t){t=t.slice(1);const n=new RegExp(`.{1,${t.length>=6?2:1}}`,"g");let a=t.match(n);return a&&a[0].length===1&&(a=a.map(e=>e+e)),a?`rgb${a.length===4?"a":""}(${a.map((e,i)=>i<3?parseInt(e,16):Math.round(parseInt(e,16)/255*1e3)/1e3).join(", ")})`:""}function S(t){if(t.type)return t;if(t.charAt(0)==="#")return S(B(t));const n=t.indexOf("("),a=t.substring(0,n);if(["rgb","rgba","hsl","hsla","color"].indexOf(a)===-1)throw new Error(v(9,t));let e=t.substring(n+1,t.length-1),i;if(a==="color"){if(e=e.split(" "),i=e.shift(),e.length===4&&e[3].charAt(0)==="/"&&(e[3]=e[3].slice(1)),["srgb","display-p3","a98-rgb","prophoto-rgb","rec-2020"].indexOf(i)===-1)throw new Error(v(10,i))}else e=e.split(",");return e=e.map(s=>parseFloat(s)),{type:a,values:e,colorSpace:i}}function X(t){const{type:n,colorSpace:a}=t;let{values:e}=t;return n.indexOf("rgb")!==-1?e=e.map((i,s)=>s<3?parseInt(i,10):i):n.indexOf("hsl")!==-1&&(e[1]=`${e[1]}%`,e[2]=`${e[2]}%`),n.indexOf("color")!==-1?e=`${a} ${e.join(" ")}`:e=`${e.join(", ")}`,`${n}(${e})`}function F(t,n){return t=S(t),n=L(n),(t.type==="rgb"||t.type==="hsl")&&(t.type+="a"),t.type==="color"?t.values[3]=`/${n}`:t.values[3]=n,X(t)}function H(t){return String(t).match(/[\d.\-+]*\s*(.*)/)[1]||""}function N(t){return parseFloat(t)}function P(t){return _("MuiSkeleton",t)}M("MuiSkeleton",["root","text","rectangular","rounded","circular","pulse","wave","withChildren","fitContent","heightAuto"]);const K=["animation","className","component","height","style","variant","width"];let m=t=>t,w,k,$,j;const T=t=>{const{classes:n,variant:a,animation:e,hasChildren:i,width:s,height:o}=t;return W({root:["root",a,e,i&&"withChildren",i&&!s&&"fitContent",i&&!o&&"heightAuto"]},P,n)},D=R(w||(w=m`
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  100% {
    opacity: 1;
  }
`)),V=R(k||(k=m`
  0% {
    transform: translateX(-100%);
  }

  50% {
    /* +0.5s of delay between each loop */
    transform: translateX(100%);
  }

  100% {
    transform: translateX(100%);
  }
`)),q=U("span",{name:"MuiSkeleton",slot:"Root",overridesResolver:(t,n)=>{const{ownerState:a}=t;return[n.root,n[a.variant],a.animation!==!1&&n[a.animation],a.hasChildren&&n.withChildren,a.hasChildren&&!a.width&&n.fitContent,a.hasChildren&&!a.height&&n.heightAuto]}})(({theme:t,ownerState:n})=>{const a=H(t.shape.borderRadius)||"px",e=N(t.shape.borderRadius);return g({display:"block",backgroundColor:t.vars?t.vars.palette.Skeleton.bg:F(t.palette.text.primary,t.palette.mode==="light"?.11:.13),height:"1.2em"},n.variant==="text"&&{marginTop:0,marginBottom:0,height:"auto",transformOrigin:"0 55%",transform:"scale(1, 0.60)",borderRadius:`${e}${a}/${Math.round(e/.6*10)/10}${a}`,"&:empty:before":{content:'"\\00a0"'}},n.variant==="circular"&&{borderRadius:"50%"},n.variant==="rounded"&&{borderRadius:(t.vars||t).shape.borderRadius},n.hasChildren&&{"& > *":{visibility:"hidden"}},n.hasChildren&&!n.width&&{maxWidth:"fit-content"},n.hasChildren&&!n.height&&{height:"auto"})},({ownerState:t})=>t.animation==="pulse"&&y($||($=m`
      animation: ${0} 2s ease-in-out 0.5s infinite;
    `),D),({ownerState:t,theme:n})=>t.animation==="wave"&&y(j||(j=m`
      position: relative;
      overflow: hidden;

      /* Fix bug in Safari https://bugs.webkit.org/show_bug.cgi?id=68196 */
      -webkit-mask-image: -webkit-radial-gradient(white, black);

      &::after {
        animation: ${0} 2s linear 0.5s infinite;
        background: linear-gradient(
          90deg,
          transparent,
          ${0},
          transparent
        );
        content: '';
        position: absolute;
        transform: translateX(-100%); /* Avoid flash during server-side hydration */
        bottom: 0;
        left: 0;
        right: 0;
        top: 0;
      }
    `),V,(n.vars||n).palette.action.hover)),G=d.forwardRef(function(n,a){const e=O({props:n,name:"MuiSkeleton"}),{animation:i="pulse",className:s,component:o="span",height:r,style:c,variant:f="text",width:l}=e,h=z(e,K),p=g({},e,{animation:i,component:o,variant:f,hasChildren:!!h.children}),x=T(p);return u.jsx(q,g({as:o,ref:a,className:A(x.root,s),ownerState:p},h,{style:g({width:l,height:r},c)}))}),Q=({src:t,alt:n,height:a=200,width:e,objectFit:i="cover",borderRadius:s=0,className:o,priority:r=!1})=>{const[c,f]=d.useState(!1),[l,h]=d.useState(!1),p=d.useRef(null);d.useEffect(()=>{if(r&&t){const b=new Image;b.onload=()=>f(!0),b.onerror=()=>h(!0),b.src=t}},[r,t]);const x=()=>{f(!0)},E=()=>{h(!0)};return u.jsxs(C,{sx:{position:"relative",width:e||"100%",height:a,borderRadius:s,overflow:"hidden",backgroundColor:"#f5f5f5",minHeight:a,maxHeight:a,minWidth:e||"100%",maxWidth:e||"100%",boxSizing:"border-box"},className:o,children:[!c&&!l&&u.jsx(G,{variant:"rectangular",width:"100%",height:"100%",animation:"wave",sx:{position:"absolute",top:0,left:0,zIndex:1,borderRadius:s}}),!l&&u.jsx("img",{ref:p,src:t,alt:n,onLoad:x,onError:E,style:{width:"100%",height:"100%",objectFit:i,display:c?"block":"none",borderRadius:s,position:"absolute",top:0,left:0,zIndex:2,maxWidth:"100%",maxHeight:"100%"},loading:r?"eager":"lazy",decoding:"async",...r&&{fetchPriority:"high"}}),l&&u.jsx(C,{sx:{display:"flex",alignItems:"center",justifyContent:"center",width:"100%",height:"100%",backgroundColor:"#f5f5f5",color:"#999",fontSize:"12px",position:"absolute",top:0,left:0,zIndex:3,borderRadius:s},children:"🖼️"})]})};export{Q as default};
