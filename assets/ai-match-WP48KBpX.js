import{a as u}from"./TakeoffApp-ntg_faQA.js";import"./index-Jn0Ei_wX.js";const p=`This image is a tile of a Swedish VVS drawing. The pipework has been
split into sections at its joining points: green circles mark the joining points, and EACH SECTION
is drawn in its own distinct colour with a number badge R1, R2 … in that same colour — the colour
changes exactly at every joining point, so where the overlay colour changes, a new section begins.
The designation labels are boxed in blue and numbered L1, L2 …, with their text listed below.
For each numbered section, decide which label's designation governs it — the way a kalkylator reads
the drawing: a label's leader (hänvisningslinje) normally lands AT a joining point, and its
designation governs the section that continues from that joining point (the run the label describes,
looking forward along the flow). Follow the leader where one is visible; otherwise follow the pipe
network from the label along the branch it belongs to. One label normally governs several
consecutive sections along the same branch, up to the next joining point that carries a different
label.
The line style of each section carries its elevation (Swedish drawing convention) and is preserved
in the overlay — a solid overlay is a solid pipe, a dashed overlay a dashed pipe:
- heldragen (solid) = below window level, in the room
- streckad (dashed) = below the floor surface
- streckprickad (dash-dot) = above window level, within the storey
- dubbelt streckprickad (dash-dot-dot) = above the slab, belongs to the STOREY ABOVE
Sections with different line styles are DIFFERENT runs at different heights even where they overlap
in plan — never let one label govern across a line-style change unless the label's leader clearly
says so. The section list below states each section's line style where known.
The pipework is split at EVERY joining point, so a label whose leader lands at a joining point governs
exactly ONE of the sections meeting there — the run BEFORE or the run AFTER that point. The joining-point
facts below (from the vector geometry) tell you which sections meet at each point, their headings, which
pair continues straight through (a trunk passing a tee) and which is a branch, and where each label's
leader lands. Decide before/after with: the side the leader arrives from, the run the label text is placed
along, and dimension logic (a branch off a tee is never larger than its trunk; a designation continues
along the straight-through run until a new label).
Association rules from Swedish drawing practice (apply in this order where the facts allow):
1. A label describes what comes AFTER it in the reading direction of the run — it looks forward, never back.
2. Gravity systems (S, D, SA, SP, SF): flow falls from higher to lower level. VG (invert) or CL along the run
   decreases downstream; the label belongs to the DOWNSTREAM section. On pressure systems (KV, VV, VVC, VS,
   VP …) a CL/ÖFG figure is mounting height only and says nothing about direction.
3. Between two candidates of the SAME material code, the smaller dimension is downstream and takes the
   label. Never compare dimensions across materials (PEX 16 beside steel 12): then the label belongs to the
   branch whose material it names.
4. Two-pipe systems (line_count 2: VS, VP, KB, KM, FV, FK, ÅV, FJV): the label covers the pair. The
   parallel unlabelled twin of the same line style a few mm away is the return — give it the same label.
   KV, VV, VVC, S, D are always labelled individually; never infer a twin for them.
5. Stacked labels on one leader: row k belongs to parallel line k, top-to-bottom — one row per pipe, never
   one row for the whole bundle.
6. A split-form label (system over a stroked dimension) points at a riser (stående ledning), not at plan
   length — do not attribute a long horizontal section to it.
7. The sheet's legend wins over any table; a label whose dimension is far outside its system's usual range
   is a misread, not a pipe — return null rather than forcing it.
Return JSON only: { "matches": [{ "run": <R number>, "label": <L number or null>, "confidence": 0-1 }] }
Rules: only use R and L numbers drawn in this tile. Return label null with low confidence when the
section belongs to a branch whose label is not visible here, or when two labels are equally
plausible. NEVER estimate lengths, counts, dimensions or scale — you are only attributing existing
sections.`;function b(e,n,t){const s=e?.matches;if(!Array.isArray(s))return[];const o=[],l=new Set;for(const r of s){if(typeof r!="object"||r===null)continue;const a=r,i=typeof a.run=="number"?Math.round(a.run):NaN;if(!Number.isInteger(i)||i<1||i>n||l.has(i))continue;l.add(i);let h=null;if(typeof a.label=="number"){const c=Math.round(a.label);c>=1&&c<=t&&(h=c)}const d=typeof a.confidence=="number"?Math.max(0,Math.min(1,a.confidence)):0;o.push({run:i,label:h,confidence:d})}return o}const m={type:"object",properties:{matches:{type:"array",items:{type:"object",properties:{run:{type:"integer"},label:{type:["integer","null"]},confidence:{type:"number"}},required:["run","label","confidence"],additionalProperties:!1}}},required:["matches"],additionalProperties:!1};function g(e,n){const t=[];return e.system&&t.push(`system ${e.system}`),e.material&&t.push(`material ${e.material}`),e.dn!=null&&t.push(`DN ${e.dn}`),e.height&&t.push(`level row "${e.height}"`),e.lineCount===2&&t.push("two-pipe system (label covers supply + return)"),e.stackSize&&e.stackSize>1&&t.push(`row ${(e.stackIndex??0)+1} of ${e.stackSize} in a stacked block`),e.splitForm&&t.push("split form → riser"),`L${n+1}: ${e.text||"(unread)"}${t.length?` [${t.join("; ")}]`:""}`}function w(e){const n=[];return e.lineType&&n.push(e.lineType),e.system&&n.push(`layer system ${e.system}`),e.anchoredBy&&e.anchoredBy.length>0&&n.push(`leader of ${e.anchoredBy.map(t=>`L${t}`).join(", ")} lands on it`),`R${e.local}${n.length?` — ${n.join(", ")}`:""}`}async function v(e,n,t,s,o=""){const l=s.map((i,h)=>g(typeof i=="string"?{text:i}:i,h)).join(`
`),r=t.map(w).join(`
`),a=await u({apiKey:e,images:[n],prompt:`${p}

Sections in this tile (line style, layer system, deterministic leader hits):
${r}
Labels in this tile (text as read, with parsed fields — never estimated):
${l}`+(o?`
Joining points in this tile (vector geometry):
${o}`:""),schema:m});return b(a,t.length,s.length)}export{p as MATCH_PROMPT,g as labelFactsLine,v as matchRunsInTile,w as runFactsLine,b as sanitizeRunMatches};
