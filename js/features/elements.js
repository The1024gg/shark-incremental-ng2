const RESEARCH = {
    hydrogen: {
        unl: ()=>true,
        require: [
            ['quarks',true,1e9],
        ],
        effect(r) {
            return Decimal.div(sharkUpgEffect('m9',0),100)
        },
        effDesc: x => "+"+format(x),
    },
    helium: {
        unl: ()=>true,
        require: [
            ['quarks',true,1e11],
        ],
    },
