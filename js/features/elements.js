const RESEARCH = {
    hydrogen: {
        unl: ()=>true,
        require: [
            ['fish',true,'eeee10'],
        ],
        effect(r) {
            return Decimal.div(sharkUpgEffect('m9',0),100)
        },
        effDesc: x => "+"+format(x),
    },
    helium: {
        unl: ()=>true,
        require: [
            ['fish',true,'eeee10'],
        ],
    },
},

const RESEARCH_KEYS = Object.keys(RESEARCH)
const MAX_RESEARCH = [null,15,20,25,30]

const PRE_BH_RESEARCH = RESEARCH_KEYS.filter(x => (RESEARCH[x].tier ?? 1) === 1)

var research_page = 1

function setupResearchHTML() {
    let text = lang_text('all-research')
    el('research-table').innerHTML = Object.entries(RESEARCH).map(
        ([i,x]) => {
            return `
            <div class="research-div" id="research-${i}-div">
                <div class="research-name">${text[i]?.[0] ?? lang_text('research-'+i+'-name')}</div>
                <div class="research-desc" id="research-${i}-desc">???</div>
                <div class="research-short-text" id="research-${i}-require"></div>
                <div class="research-status" id="research-${i}-status">
                    <div><b>Not Purchased</b></div>
                    <div><b>Effect:</b> +0.41</div>
                </div>
                <div class="research-buttons">
                    <button id="research-${i}-button" onclick="purchaseResearch('${i}')">Purchase</button>
                    ${(x.max??1)>1&&!x.noBuyMax?`<button id="research-${i}-max-button" onclick="purchaseResearch('${i}',true)">${lang_text("buyMax")}</button>`:""}
                </div>
            </div>
            `
        }
    ).join("")
}

function hasResearch(id,l=1) { return player.research[id].gte(l) }
function isResearchMaxed(id) { return player.research[id].gte(RESEARCH[id].max??1) }
function researchEffect(id,def=E(1)) { return tmp.research_eff[id]??def }
function simpleResearchEffect(id,def=E(1)) { return player.research[id].gte(1)?tmp.research_eff[id]??def:def }

function purchaseResearch(id,bulking=false) {
    const R = RESEARCH[id]
    let max = R.max??1
    if (player.research[id].gte(max) || bulking && max == 1) return
    let amt = player.research[id], afford = true, after = R.require.map(r => {
        if (afford) {
            let curr = CURRENCIES[r[0]], c = max>1?r[2](amt):r[2], s = (r[1]?curr.total:curr.amount)
            if (s.sub(c).lt(0)) {
                afford = false
                return
            }
            return bulking ? r[3](s).max(amt.add(1)).min(max) : [curr,r[1]?undefined:s.sub(c).max(0)]
        }
    })
    if (afford) {
        if (bulking) {
            let min_bulk = amt.add(1)
            after.forEach(x => {min_bulk = min_bulk.max(x)})
            player.research[id] = min_bulk
            R.require.forEach(r => {
                if (r[1]) return
                let curr = CURRENCIES[r[0]]
                curr.amount = curr.amount.sub(r[2](min_bulk.sub(1))).max(0)
            })
        } else {
            player.research[id] = player.research[id].add(1)
            after.forEach(x => {if (x[1]) x[0].amount = x[1]})
        }
        R.onBuy?.()
    }
}

function changeResearchPage(diff) {
    research_page = Math.max(1,research_page+diff)
    el("research-page").value = research_page
    updateResearchHTML()
}

function updateResearchHTML() {
    let text = [lang_text('effect'),lang_text('level'),lang_text('require'),lang_text('all-research')]

    var hidden = player.radios['visible-research']
    var visible_research = (hidden ? RESEARCH_KEYS.filter(x => !isResearchMaxed(x)) : RESEARCH_KEYS).filter(x => RESEARCH[x].unl())

    var m = MAX_RESEARCH[player.radios['max-research-amt']]
    var unl = player.radios['max-research-amt'] != 0 && visible_research.length > m
    el("research-page-div").style.display = el_display(unl)
    if (unl) {
        var c = Math.max(1,Math.ceil(visible_research.length/m))

        el("research-total-pages").innerHTML = lang_text('research-pages',c)

        if (research_page > c) {
            el("research-page").value = research_page = c
        }

        visible_research = [...visible_research].splice(m*(research_page-1),m)
    }

    for (let [i,x] of Object.entries(RESEARCH)) {
        let unl = visible_research.includes(i) && x.unl(), el_id = "research-"+i
        el(el_id+"-div").style.display = el_display(unl)
        if (unl) {
            let amt = player.research[i], max = x.max??1, bought = amt.gte(max), afford = true

            el(el_id+"-desc").innerHTML = `<b style="font-size:12px">[${i}]</b> ` + (text[3][i]?.[1] ?? lang_text(el_id+"-desc"))
            el(el_id+"-require").style.display = el_display(!bought)
            el(el_id+"-button").style.display = el_display(!bought)
            if ((x.max??1)>1&&!x.noBuyMax) el(el_id+"-max-button").style.display = el_display(!bought)
            if (!bought) {
                el(el_id+"-require").innerHTML = `<b>${text[2]}:</b> ` + x.require.map(r => {
                    let curr = CURRENCIES[r[0]], cost = max>1?r[2](amt):r[2], a = (r[1]?curr.total:curr.amount).gte(cost)
                    if (afford) afford &&= a
                    return `<span ${a ? "" : `style="color: #800"`}>${format(cost,0)}</span>`+" "+(r[1]?lang_text("total")+" ":"")+curr.costName
                }).join(", ")
                el(el_id+"-button").className = el_classes({locked: !afford})
                el(el_id+"-button").textContent = lang_text('research-afford',afford)
            }
            el(el_id+"-status").innerHTML = `<div>${x.max > 1 ? `<b>${text[1]}:</b> ${amt.format(0)} / ${format(max,0)}` : lang_text('research-bought',bought)}</div>`
            + (x.effDesc ? `<div><b>${text[0]}:</b> ${x.effDesc(tmp.research_eff[i])}</div>` : "")
        }
    }
}

function updateResearchTemp() {
    for (let [i,x] of Object.entries(RESEARCH)) if (x.effect) tmp.research_eff[i] = x.effect(player.research[i])
}

function resetResearch(...x) {
    for (let i of x) {
        player.research[i] = E(0)
    }
}
