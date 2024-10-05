const U_MILESTONES = [
    {
        unl:()=>true,
        req:()=>player.universe.size.gte(1e-36),
    },{
        unl:()=>true,
        req:()=>player.universe.size.gte(1e-34),
    },{
        unl:()=>true,
        req:()=>player.universe.size.gte(1e-31),
    },{
        unl:()=>true,
        req:()=>player.universe.size.gte(1e-12),
    },{
        unl:()=>true,
        req:()=>player.universe.size.gte(1e8),
    },{
        unl:()=>true,
        req:()=>player.universe.size.gte(3.086e20),
    },{
        unl:()=>true,
        req:()=>player.universe.size.gte(1e79),
    },{
        unl:()=>true,
        req:()=>player.universe.size.gte(1e246),
    },{
        unl:()=>true,
        req:()=>player.universe.size.gte('e27489.39'),
    },{
        unl:()=>true,
        req:()=>player.universe.size.gte('e5,387,921'),
    },{
        unl:()=>true,
        req:()=>player.universe.size.gte('ee9'),
    },


 
]
const R_MILESTONES = [
    {
        unl:()=>true,
        req:()=>player.universe.rocket.explored.gte(2500),
    },{
        unl:()=>true,
        req:()=>player.universe.rocket.explored.gte(1e4),
    },{
        unl:()=>true,
        req:()=>player.universe.rocket.explored.gte(1e5),
    },{
        unl:()=>true,
        req:()=>player.universe.rocket.explored.gte(5e5),
    },{
        unl:()=>true,
        req:()=>player.universe.rocket.explored.gte(1e9),
    },{
        unl:()=>true,
        req:()=>player.universe.rocket.explored.gte(2.5e9),
    },{
        unl:()=>true,
        req:()=>player.universe.rocket.explored.gte(1.496e14),
    },{
        unl:()=>true,
        req:()=>player.universe.rocket.explored.gte(1.496e15),
    },

 
]

function hasUMilestone(i) { return U_MILESTONES[i].req() }
function hasRMilestone(i) { return R_MILESTONES[i].req() }
function updateUSHTML() {
el('universe-size').innerHTML = lang_text('universe-size-div', formatLength(player.universe.size), formatMult(E(1).add(player.universe.size.log10().add(40))))
el('antimatter-gain').innerHTML = lang_text('antimatter-div', format(player.universe.antimatter), formatMult(CURRENCIES.universe_size.mult))
}

function setupUniverseHTML() {
     let h = ''
    for (let i = 0; i < U_MILESTONES.length; i++) {

        h += `
        <div class="singularity-milestone" id="um-${i}"><h3>???</h3><br>???</div>
        `
    }

    el('universe-milestones').innerHTML = h

    let j = ''
    for (let i = 0; i < R_MILESTONES.length; i++) {

        j += `
        <div class="singularity-milestone" id="rm-${i}"><h3>???</h3><br>???</div>
        `
    }

    el('rocket-milestones').innerHTML = j

    
}

function updateUniverseMilestones() {
    let text = lang_text('universe-milestones')

    for (let i = 0; i < U_MILESTONES.length; i++) {
        let s = U_MILESTONES[i], e = el(`um-${i}`), unl = s.unl()

        e.style.display = el_display(unl)

        if (unl) {
            let t = text[i]

            e.innerHTML = `<h3>${t[0]}</h3><br>${t[1]}`
            e.style.borderColor = s.req() ? "lime" : "white"
        }
    }
    let p = lang_text('rocket-milestones')

    for (let i = 0; i < R_MILESTONES.length; i++) {
        let s = R_MILESTONES[i], e = el(`rm-${i}`), unl = s.unl()

        e.style.display = el_display(unl)

        if (unl) {
            let t = p[i]

            e.innerHTML = `<h3>${t[0]}</h3><br>${t[1]}`
            e.style.borderColor = s.req() ? "lime" : "white"
        }
    }
}

//rocket exploration

function updateREHTML() {
    el('rocket-tier').innerHTML = lang_text('rocket-tier-div', format(player.universe.rocket.tier, 0))
    el('rocket-tier-upgrade').innerHTML = lang_text('rocket-tier-upgrade', format(getRocketTierCost(player.universe.rocket.tier), 0))
    el('rocket-tier-upgrade').className = el_classes({'huge-btn':true,'locked':ROCKET_PARTS.total.lt(getRocketTierCost(player.universe.rocket.tier))})
    el('rocket-explored').innerHTML = lang_text('rocket-explored', formatLength(player.universe.rocket.explored), formatLength(CURRENCIES.explored.gain))
}

function getRocketTierCost(x) {
    return E(x).add(1).scale(5, 3, 'P').pow(3).mul(1000).floor()
}

function upgradeRocketTier() {
    if (ROCKET_PARTS.total.gte(getRocketTierCost(player.universe.rocket.tier))) {
        player.universe.rocket.tier = player.universe.rocket.tier.add(1)
    }
}
