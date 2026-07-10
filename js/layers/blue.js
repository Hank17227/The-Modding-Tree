addLayer("b", {
    tabFormat: [
        ["display-text", function() {return "You have "+layerText("h2","b",formatWhole(player[this.layer].points)+"/"+formatWhole(player[this.layer].pointsCap))+" "+tmp[this.layer].resource+"."}],"blank",
        "prestige-button","blank","clickables",
        "upgrades","blank",
        "buyables"
    ],
    name: "Blue", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        pointsCap: new Decimal(5),
        hideUpgrades: false
    }},
    infoboxes: {
        
    },
    color: "#0000ff",
    requires() {
        let req = new Decimal(10)
        if(hasUpgrade("b",25)) req = req.mul(2)
        if(hasUpgrade("g",12)) req = req.mul(2)
        return req
    }, // Can be a function that takes requirement increases into account
    resource: "Blue Essence", // Name of prestige currency
    baseResource: "Points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: new Decimal(1/4.7), // Prestige currency exponent
    passiveGeneration() {
        let gain = new Decimal(0)
        return gain
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        if(hasUpgrade("b",15)) mult = mult.add(1)
        if(hasUpgrade("g",11)) mult = mult.add(1)
        if(hasUpgrade("g",21)) mult = mult.add(upgradeEffect("g",21))
        if(hasUpgrade("b",35)) mult = mult.add(upgradeEffect("b",35)[0])
        mult = mult.add(buyableEffect(this.layer,11))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    passiveGeneration() {
        let gain = new Decimal(0)
        if(hasUpgrade("b",41)) gain = gain.add(1)
        return gain
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    position: 2,
    hotkeys: [
        //{key: "w", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},

    doReset(resettingLayer) {
        
    },

    instantUnlockLayer() {
        if(player.points.gte(10)) player.b.unlocked = true
        return
    },

    bCapCalc() {
        cap = new Decimal(5)
        if(hasUpgrade("b",11)) cap = cap.add(5)
        if(hasUpgrade("b",12)) cap = cap.add(7)
        if(hasUpgrade("b",13)) cap = cap.add(9)
        if(hasUpgrade("b",14)) cap = cap.add(14)
        if(hasUpgrade("b",15)) cap = cap.mul(2)
        if(hasUpgrade("b",21)) cap = cap.add(20)
        if(hasUpgrade("b",22)) cap = cap.add(25)
        if(hasUpgrade("b",23)) cap = cap.add(25)
        if(hasUpgrade("b",24)) cap = cap.add(50)
        if(hasUpgrade("b",25)) cap = cap.add(100)
        if(hasUpgrade("g",11)) cap = cap.add(5)
        if(hasUpgrade("g",12)) cap = cap.add(5)
        if(hasUpgrade("g",13)) cap = cap.add(10)
        if(hasUpgrade("g",15)) cap = cap.add(30)
        if(hasUpgrade("g",23)) cap = cap.add(20)
        if(hasUpgrade("g",24)) cap = cap.add(25)
        if(hasUpgrade("g",24)) cap = cap.add(15)
        if(hasUpgrade("b",34)) cap = cap.add(20)
        if(hasUpgrade("b",35)) cap = cap.add(upgradeEffect("b",35)[1])
        if(hasUpgrade("g",33)) cap = cap.add(250)
        if(hasUpgrade("g",43)) cap = cap.add(350)
        if(hasUpgrade("b",42)) cap = cap.add(2000)
        if(hasUpgrade("b",44)) cap = cap.add(12000)
        if(hasUpgrade("b",55)) cap = cap.add(1e5)
        if(hasMilestone("r",0)) cap = cap.add(1000)
        if(hasMilestone("r",1)) cap = cap.add(tmp.r.redM2eff)
        if(hasMilestone("r",7)) cap = cap.add(tmp.r.redM8eff)
        cap = cap.add(buyableEffect(this.layer,12))
        if(hasUpgrade("g",75)) cap = cap.mul(upgradeEffect("g",75))
        cap = cap.mul(buyableEffect(this.layer,23))
        if(player.r.bEnergy.gte(501)) cap = cap.mul(tmp.r.bEnergyEff6)
        return cap
    },

    effect() {
        
    },
    effectDescription() {
        
    },

    automate() {
        layers[this.layer].buyables[11].buy()
        layers[this.layer].buyables[12].buy()
        layers[this.layer].buyables[13].buy()
        layers[this.layer].buyables[21].buy()
        layers[this.layer].buyables[22].buy()
        layers[this.layer].buyables[23].buy()
    },

    autoPrestige() {
        let condition = tmp.b.baseAmount.gte(tmp.b.requires)
        if(hasUpgrade("b",41)) condition = false
        return condition
    },

    autoUpgrade: true,

    resetsNothing() {return hasUpgrade("g",25)},

    canReset() {return !hasUpgrade("b",41)&&player.points.gte(tmp.b.requires)},

    update(diff) {
        player.b.points = player.b.points.min(player.b.pointsCap)
        player.b.pointsCap = tmp.b.bCapCalc
    },

    buyables: {
        11: {
            title: "Blue #B1",
            cost(x) {
                let base = new Decimal(300)
                let scale = [new Decimal(1.1)]
                let scaledCost = [
                    base.mul(scale[0].pow(x)),
                ]
                let consume = scaledCost[0]
                return consume
            },
            baseEffect() {
                let base = new Decimal(2)
                if(hasUpgrade("b",33)) base = base.add(0.1)
                return base
            },
            effect(x) {
                let eff = new Decimal(0)
                let base = this.baseEffect()
                if(x.gt(0)) eff = base.mul(x)
                return eff
            },
            canAfford() {return player[this.layer].points.gte(this.cost())},
            buy() {
                if(!this.canAfford()) return
                cost = tmp[this.layer].buyables[this.id].cost
                if(!hasUpgrade("b",43)) player[this.layer].points = player[this.layer].points.sub(cost)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            display() {
                let gainDesc = "+"+format(this.baseEffect())+" BE gain per level.<br>"
                let effText = "Currently: +"+formatWhole(this.effect())+"<br>"
                let boughtText = "("+formatWhole(getBuyableAmount("b",11))+" purchased)<br><br>"
                let costText = "Cost: "+formatWhole(this.cost())+" "+tmp[this.layer].resource
                return gainDesc+effText+boughtText+costText
            },
            style: {'height':'110px'},
            unlocked() {return hasUpgrade("g",15)},
        },
        12: {
            title: "Blue #B2",
            cost(x) {
                let base = new Decimal(50)
                let scale = [new Decimal(50),new Decimal(1000),new Decimal(1.05)]
                if(hasUpgrade("g",72)) scale[2] = new Decimal(1.01)
                let scaledCost = [
                    base.add(scale[0].mul(x)),
                    base.add(scale[0].mul(99)).add(scale[1].mul(x.sub(99))),
                    base.add(scale[0].mul(99)).add(scale[1].mul(100)).mul(scale[2].pow(x.sub(199))),
                ]
                let consume = scaledCost[0]
                if(x.gte(100)&&x.lt(200)) consume = scaledCost[1]
                if(x.gte(200)) consume = scaledCost[2]
                return consume
            },
            baseEffect() {
                let base = new Decimal(10)
                base = base.add(buyableEffect(this.layer,22))
                base = base.mul(tmp.r.bEnergyEff2)
                if(hasUpgrade("b",54)) base = base.add(850)
                return base
            },
            effect(x) {
                let eff = new Decimal(0)
                let base = this.baseEffect()
                if(x.gt(0)) eff = base.mul(x)
                return eff
            },
            canAfford() {return player[this.layer].points.gte(this.cost())},
            buy() {
                if(!this.canAfford()) return
                cost = tmp[this.layer].buyables[this.id].cost
                if(!hasUpgrade("b",43)) player[this.layer].points = player[this.layer].points.sub(cost)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            display() {
                let gainDesc = "+"+formatWhole(this.baseEffect())+" BE cap per level.<br>"
                let effText = "Currently: +"+formatWhole(this.effect())+"<br>"
                let boughtText = "("+formatWhole(getBuyableAmount("b",12))+" purchased)<br><br>"
                let costText = "Cost: "+formatWhole(this.cost())+" "+tmp[this.layer].resource
                return gainDesc+effText+boughtText+costText
            },
            style: {'height':'110px'},
            unlocked() {return getBuyableAmount(this.layer,11).gte(2)},
        },
        13: {
            title: "Blue #B3",
            cost(x) {
                let base = new Decimal(100)
                let scale = [new Decimal(1.5)]
                if(hasUpgrade("r",31)) scale[0] = new Decimal(1.2)
                let scaledCost = [
                    base.mul(scale[0].pow(x)),
                ]
                let consume = scaledCost[0]
                return consume
            },
            baseEffect() {
                let base = new Decimal(30)
                if(hasUpgrade("g",41)) base = base.add(30)
                if(hasUpgrade("r",12)) base = new Decimal(0.3)
                if(hasMilestone("r",17)) base = new Decimal(1.075)
                return base
            },
            effect(x) {
                let eff = new Decimal(hasUpgrade("r",12)?1:0)
                let base = this.baseEffect()
                if(x.gt(0)) eff = base.mul(x).add(eff)
                if(hasMilestone("r",17)) eff = base.pow(x)
                return eff
            },
            canAfford() {return player[this.layer].points.gte(this.cost())},
            buy() {
                if(!this.canAfford()) return
                cost = tmp[this.layer].buyables[this.id].cost
                if(!hasUpgrade("b",43)) player[this.layer].points = player[this.layer].points.sub(cost)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            display() {
                let gainDesc = "+"+format(this.baseEffect())+" points gain per level.<br>"
                if(hasUpgrade("r",12)) gainDesc = "BEG4 is +"+format(this.baseEffect().mul(100))+"% stronger per level.<br>"
                if(hasMilestone("r",17)) gainDesc = "Multiply BEG4 by "+format(this.baseEffect(),3)+" per level.<br>"
                let effText = "Currently: +"+formatWhole(this.effect())+"<br>"
                if(hasUpgrade("r",12)) effText = "Currently: x"+format(this.effect())+"<br>"
                let boughtText = "("+formatWhole(getBuyableAmount(this.layer,this.id))+" purchased)<br><br>"
                let costText = "Cost: "+formatWhole(this.cost())+" "+tmp[this.layer].resource
                return gainDesc+effText+boughtText+costText
            },
            style: {'height':'110px'},
            unlocked() {return hasUpgrade(this.layer,35)},
        },
        21: {
            title: "Blue #B4",
            cost(x) {
                let base = new Decimal(2e5)
                let scale = [new Decimal(1.5)]
                let scaledCost = [
                    base.mul(scale[0].pow(x)),
                ]
                let consume = scaledCost[0]
                return consume
            },
            baseEffect() {
                let base = new Decimal(0.2)
                if(hasUpgrade("g",53)) base = base.add(0.1)
                if(getBuyableAmount("r",11).gte(101)) base = base.add(tmp.r.bEnergyEff5)
                return base
            },
            effect(x) {
                let eff = new Decimal(1)
                let base = this.baseEffect()
                if(x.gt(0)) eff = eff.add(base.mul(x))
                return eff
            },
            canAfford() {return player.g.gl.gte(this.cost())},
            buy() {
                if(!this.canAfford()) return
                cost = tmp[this.layer].buyables[this.id].cost
                if(!hasUpgrade("g",55)) player.g.gl = player.g.gl.sub(cost)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            display() {
                let gainDesc = "+"+format(this.baseEffect())+" Green Light mult per level. This effect stacks additively.<br>"
                let effText = "Currently: x"+format(this.effect())+"<br>"
                let boughtText = "("+formatWhole(getBuyableAmount(this.layer,this.id))+" purchased)<br><br>"
                let costText = "Cost: "+formatWhole(this.cost())+" "+" Green Light"
                return gainDesc+effText+boughtText+costText
            },
            style: {'height':'110px'},
            unlocked() {return hasUpgrade("g",41)},
        },
        22: {
            title: "Blue #B5",
            cost(x) {
                let base = new Decimal(1e5)
                let scale = [new Decimal(1.75)]
                let scaledCost = [
                    base.mul(scale[0].pow(x)),
                ]
                let consume = scaledCost[0]
                return consume
            },
            baseEffect() {
                let base = new Decimal(10)
                return base
            },
            effect(x) {
                let eff = new Decimal(0)
                let base = this.baseEffect()
                if(x.gt(0)) eff = eff.add(base.mul(x))
                return eff
            },
            canAfford() {return player[this.layer].points.gte(this.cost())},
            buy() {
                if(!this.canAfford()) return
                cost = tmp[this.layer].buyables[this.id].cost
                if(!hasUpgrade("r",25)) player[this.layer].points = player[this.layer].points.sub(cost)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            display() {
                let gainDesc = "+"+formatWhole(this.baseEffect())+" Blue #B2 base per level.<br>"
                let effText = "Currently: +"+formatWhole(this.effect())+"<br>"
                let boughtText = "("+formatWhole(getBuyableAmount(this.layer,this.id))+" purchased)<br><br>"
                let costText = "Cost: "+formatWhole(this.cost())+" "+tmp[this.layer].resource
                return gainDesc+effText+boughtText+costText
            },
            style: {'height':'110px'},
            unlocked() {return hasUpgrade("g",54)},
        },
        23: {
            title: "Blue #B6",
            cost(x) {
                let base = new Decimal(1e8)
                let scale = [new Decimal(1.8)]
                let scaledCost = [
                    base.mul(scale[0].pow(x.pow(1.02))),
                ]
                let consume = scaledCost[0]
                return consume
            },
            baseEffect() {
                let base = new Decimal(1.1)
                return base
            },
            effect(x) {
                let eff = new Decimal(1)
                let base = this.baseEffect()
                if(x.gt(0)) eff = eff.mul(base.pow(x))
                return eff
            },
            canAfford() {return player[this.layer].points.gte(this.cost())},
            buy() {
                if(!this.canAfford()) return
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].points = player[this.layer].points.sub(cost)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            display() {
                let gainDesc = "x"+format(this.baseEffect())+" BE cap per level.<br>"
                let effText = "Currently: x"+format(this.effect())+"<br>"
                let boughtText = "("+formatWhole(getBuyableAmount(this.layer,this.id))+" purchased)<br><br>"
                let costText = "Cost: "+formatWhole(this.cost())+" "+tmp[this.layer].resource
                return gainDesc+effText+boughtText+costText
            },
            style: {'height':'110px'},
            unlocked() {return hasUpgrade("r",25)},
        },
    },

    upgrades: {
        11: {
            title: "Blue #1",
            description: "+1 points gain, Blue Essence (BE) cap +5.",
            cost: new Decimal(5),
            unlocked() {return !hideUpgs(this.layer,this.id)},
            style: {'touch-action':'manipulation'},
        },
        12: {
            title: "Blue #2",
            description: "+1 points gain, BE cap +7.",
            cost: new Decimal(10),
            unlocked() {return hasUpgrade("b",11)&&!hideUpgs(this.layer,this.id)},
            style: {'touch-action':'manipulation'},
        },
        13: {
            title: "Blue #3",
            description: "+1 points gain, BE cap +9.",
            cost: new Decimal(17),
            unlocked() {return hasUpgrade("b",12)&&!hideUpgs(this.layer,this.id)},
            style: {'touch-action':'manipulation'},
        },
        14: {
            title: "Blue #4",
            description: "+2 points gain, BE cap +14.",
            cost: new Decimal(26),
            unlocked() {return hasUpgrade("b",13)&&!hideUpgs(this.layer,this.id)},
            style: {'touch-action':'manipulation'},
        },
        15: {
            title: "Blue #5",
            description: "+1 BE gain, BE cap is doubled.",
            cost: new Decimal(40),
            unlocked() {return hasUpgrade("b",14)&&!hideUpgs(this.layer,this.id)},
            style: {'touch-action':'manipulation'},
        },
        21: {
            title: "Blue #6",
            description: "+2 points gain, BE cap +20.",
            cost: new Decimal(80),
            unlocked() {return hasUpgrade("b",15)&&!hideUpgs(this.layer,this.id)},
            style: {'touch-action':'manipulation'},
        },
        22: {
            title: "Blue #7",
            description: "+2 points gain, BE cap +25.",
            cost: new Decimal(100),
            unlocked() {return hasUpgrade("b",21)&&!hideUpgs(this.layer,this.id)},
            style: {'touch-action':'manipulation'},
        },
        23: {
            title: "Blue #8",
            description: "+1 points gain, BE cap +25.",
            cost: new Decimal(125),
            unlocked() {return hasUpgrade("b",22)&&!hideUpgs(this.layer,this.id)},
            style: {'touch-action':'manipulation'},
        },
        24: {
            title: "Blue #9",
            description: "+1 points gain, BE cap +50.",
            cost: new Decimal(150),
            unlocked() {return hasUpgrade("b",23)&&!hideUpgs(this.layer,this.id)},
            style: {'touch-action':'manipulation'},
        },
        25: {
            title: "Blue #10",
            description: "Double points gain and the points requirement for BE, BE cap +100.",
            cost: new Decimal(200),
            unlocked() {return hasUpgrade("b",24)&&!hideUpgs(this.layer,this.id)},
            style: {'touch-action':'manipulation'},
        },
        31: {
            title: "Blue #11",
            description: "Points affect Green Light gain at a reduced rate.",
            cost: new Decimal(600),
            effect() {
                let eff = player.points.pow(0.2)
                return eff
            },
            effectDisplay() {return "+"+format(this.effect())},
            unlocked() {return hasUpgrade("g",25)&&!hideUpgs(this.layer,this.id)},
            style: {'touch-action':'manipulation'},
        },
        32: {
            title: "Blue #12",
            description: "Green #4 effect is 3 times better.",
            currencyDisplayName: "Green Light",
            currencyInternalName: "gl",
            currencyLayer: "g",
            cost: new Decimal(5000),
            unlocked() {return hasUpgrade("b",31)&&!hideUpgs(this.layer,this.id)},
            style: {'touch-action':'manipulation'},
        },
        33: {
            title: "Blue #13",
            description: "+20 points gain. Blue #B1 base +0.1.",
            cost: new Decimal(625),
            unlocked() {return hasUpgrade("b",32)&&!hideUpgs(this.layer,this.id)},
            style: {'touch-action':'manipulation'},
        },
        34: {
            title: "Blue #14",
            description: "Gain 50% more Green Light, BE cap +20.",
            currencyDisplayName: "Green Light",
            currencyInternalName: "gl",
            currencyLayer: "g",
            cost: new Decimal(5000),
            unlocked() {return hasUpgrade("b",33)&&!hideUpgs(this.layer,this.id)},
            style: {'touch-action':'manipulation'},
        },
        35: {
            title: "Blue #15",
            description: "Green Light affect both BE and BE cap with reduced effect.",
            cost: new Decimal(680),
            effect() {
                let gl = hasMilestone("r",6)?player.g.bestgl:player.g.gl
                let eff = [gl.pow(0.25).mul(1.5),gl.pow(0.5)]
                if(hasUpgrade("g",52)) eff[1] = eff[1].mul(3)
                if(eff[1].gte(2e5)) eff[1] = eff[1].div(2e5).pow(1/3).mul(2e5)
                if(hasMilestone("r",17)) eff[0] = eff[0].mul(2)
                return eff
            },
            effectDisplay() {return "+"+formatWhole(this.effect()[0])+" BE gain, +"+formatWhole(this.effect()[1])+" BE cap."},
            unlocked() {return hasUpgrade("b",34)&&!hideUpgs(this.layer,this.id)},
            style: {'touch-action':'manipulation'},
        },
        41: {
            title: "Blue #16",
            description: "Disable the auto prestige but gain 100% of BE per second.",
            cost: new Decimal(11000),
            unlocked() {return hasMilestone("r",2)&&!hideUpgs(this.layer,this.id)},
            style: {'touch-action':'manipulation'},
        },
        42: {
            title: "Blue #17",
            description: "+2,000 BE cap.",
            cost: new Decimal(10000),
            unlocked() {return hasUpgrade("b",41)&&!hideUpgs(this.layer,this.id)},
            style: {'touch-action':'manipulation'},
        },
        43: {
            title: "Blue #18",
            description: "The first 3 buyables no longer costs anything.",
            cost: new Decimal(12500),
            unlocked() {return hasUpgrade("b",42)&&!hideUpgs(this.layer,this.id)},
            style: {'touch-action':'manipulation'},
        },
        44: {
            title: "Blue #19",
            description: "+12,000 BE cap.",
            cost: new Decimal(15000),
            unlocked() {return hasUpgrade("b",43)&&!hideUpgs(this.layer,this.id)},
            style: {'touch-action':'manipulation'},
        },
        45: {
            title: "Blue #20",
            description: "+100,000 points gain.",
            cost: new Decimal(30000),
            unlocked() {return hasUpgrade("b",44)&&!hideUpgs(this.layer,this.id)},
            style: {'touch-action':'manipulation'},
        },
        51: {
            title: "Blue #21",
            description: "+100,000,000 points gain. +0.25 effective GE to GL.",
            cost: new Decimal(7e5),
            unlocked() {return hasMilestone("r",9)&&!hideUpgs(this.layer,this.id)},
            style: {'touch-action':'manipulation'},
        },
        52: {
            title: "Blue #22",
            description: "+100,000,000 points gain. +1e10 GL gain.",
            cost: new Decimal(8e5),
            unlocked() {return hasMilestone("r",9)&&!hideUpgs(this.layer,this.id)},
            style: {'touch-action':'manipulation'},
        },
        53: {
            title: "Blue #23",
            description: "+100,000,000 points gain. +1 RE mult.",
            cost: new Decimal(9e5),
            unlocked() {return hasMilestone("r",9)&&!hideUpgs(this.layer,this.id)},
            style: {'touch-action':'manipulation'},
        },
        54: {
            title: "Blue #24",
            description: "+100,000,000 points gain. +850 Blue #B2 base.",
            cost: new Decimal(1e6),
            unlocked() {return hasMilestone("r",9)&&!hideUpgs(this.layer,this.id)},
            style: {'touch-action':'manipulation'},
        },
        55: {
            title: "Blue #25",
            description: "+1e9 points gain. +1e11 GL gain, +100,000 BE cap and RE generates twice as fast.",
            cost: new Decimal(1.3e6),
            unlocked() {return hasMilestone("r",9)&&!hideUpgs(this.layer,this.id)},
            style: {'touch-action':'manipulation'},
        },
    },
    clickables: {
        11: {
            title() {
                let hide = "Hide obtained upgrades", show = "Show obtained upgrades"
                let hideUpgrades = player[this.layer].hideUpgrades
                if(hideUpgrades) return show
                else return hide
            },
            onClick() {
                let hideUpgrades = player[this.layer].hideUpgrades
                if(hideUpgrades) hideUpgrades = false
                else hideUpgrades = true
                player[this.layer].hideUpgrades = hideUpgrades
            },
            canClick: true,
            unlocked() {return hasUpgrade(this.layer,45)},
            style: {'width':'300px','min-height':'60px', 'color':'white'}
        },
    }
}) // Blue