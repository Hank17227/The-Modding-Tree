addLayer("g", {
    tabFormat: [
        ["display-text", function() {
            return "You have "+layerText("h2","g",formatWhole(player[this.layer].points))+" "+tmp[this.layer].resource+", "+
            "which generates "+layerText("h2",this.layer,formatWhole(player[this.layer].glGen))+" Green Light per second."
        }],
        ["display-text", function() {
            return "Green Light gain formula: base^GE*mult."
        }],"blank",
        "prestige-button","blank",
        ["display-text", function() {
            let glText = "You have "+layerText("h2",this.layer,formatWhole(player[this.layer].gl))+" Green Light."
            let bestglText = "<br>Your best Green Light is "+formatWhole(player[this.layer].bestgl)+"."
            return hasMilestone("r",6)?glText+bestglText:glText
        }],
        "blank","clickables",
        "upgrades"
    ],
    name: "Green", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "G", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        gl: new Decimal(0), // green light
        bestgl: new Decimal(0),
        glGen: new Decimal(0),
        hideUpgrades: false
    }},
    infoboxes: {
        
    },
    color: "#00ff00",
    requires() {
        let req = new Decimal(300)
        if(hasUpgrade("r",15)) req = req.div(2)
        return req
    }, // Can be a function that takes requirement increases into account
    resource: "Green Essence", // Name of prestige currency
    baseResource: "Blue Essence", // Name of resource prestige is based on
    baseAmount() {return player.b.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    base() {return new Decimal([1,4/3,5/3,2,10/3,5,8,12,20,30,40,50][player.g.points.min(11).toNumber()])},
    exponent() {
        let exp = new Decimal(0)
        if(player.g.points.gt(11)) exp = player.g.points.sub(11).mul(0.1).min(0.7)
        return exp
    }, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    position: 1,
    hotkeys: [
        //{key: "w", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasUpgrade("b",25)},

    doReset(resettingLayer) {
        
    },

    glGeneration() {
        let base = new Decimal(1), ge = player.g.points, mult = new Decimal(ge.gt(0)?1:0)
        if(hasUpgrade("g",22)) base = base.add(1)
        if(hasUpgrade("g",34)) base = base.add(0.5)
        if(hasUpgrade("g",61)) base = base.add(0.1)
        if(hasUpgrade("g",62)) base = base.add(0.1)
        if(hasUpgrade("g",63)) base = base.add(0.1)
        if(hasUpgrade("g",64)) base = base.add(0.1)
        if(hasUpgrade("g",65)) base = base.add(0.1)
        if(hasUpgrade("b",34)) mult = mult.mul(1.5)
        if(getBuyableAmount("b",21).gt(0)) mult = mult.add(buyableEffect("b",21))
        if(player.r.gEnergy.gte(2)) mult = mult.add(tmp.r.gEnergyEff2)
        if(hasUpgrade("g",54)) ge = ge.add(1)
        if(hasUpgrade("b",51)) ge = ge.add(0.5)
        let gain = base.pow(ge).mul(mult).max(ge)
        if(hasUpgrade("g",23)) gain = gain.add(upgradeEffect("g",23))
        if(hasUpgrade("b",31)) gain = gain.add(upgradeEffect("b",31))
        if(hasUpgrade("b",33)) gain = gain.add(20)
        if(hasUpgrade("g",31)) gain = gain.add(upgradeEffect("g",31))
        if(hasUpgrade("g",32)) gain = gain.add(upgradeEffect("g",32)[1])
        if(hasUpgrade("g",33)) gain = gain.add(200)
        if(hasUpgrade("g",42)&&!hasUpgrade("r",13)) gain = gain.mul(2)
        if(hasUpgrade("g",43)) gain = gain.add(10000)
        if(hasUpgrade("g",45)&&!hasUpgrade("r",14)) gain = gain.mul(2)
        if(hasMilestone("r",0)) gain = gain.add(50000)
        if(hasMilestone("r",6)) gain = gain.mul(2)
        if(player.r.bEnergy.gte(11)) gain = gain.mul(tmp.r.bEnergyEff3)
        if(hasMilestone("r",8)) gain = gain.mul(tmp.r.redM9eff)
        if(hasUpgrade("b",52)) gain = gain.add(1e12)
        if(hasUpgrade("b",55)) gain = gain.add(1e13)
        if(player.r.gEnergy.gte(23)) gain = gain.add(tmp.r.gEnergyEff4)
        return gain
    },

    effect() {
        
    },

    automate() {
    },

    autoPrestige() {return tmp[this.layer].baseAmount.gte(tmp[this.layer].requires.mul(tmp[this.layer].base))},

    autoUpgrade: true,

    update(diff) {
        player.g.gl = player.g.gl.add(player.g.glGen.mul(diff))
        player.g.glGen = tmp.g.glGeneration
        player.g.bestgl = player.g.bestgl.max(player.g.gl)
    },

    buyables: {
        11: {
            
        },
    },

    upgrades: {
        11: {
            title: "Green #1",
            description: "+1 BE gain, BE cap +5.",
            currencyDisplayName: "Green Light",
            currencyInternalName: "gl",
            currencyLayer: "g",
            cost: new Decimal(10),
            unlocked() {return !hideUpgs(this.layer,this.id)},
            style: {'touch-action':'manipulation'},
        },
        12: {
            title: "Green #2",
            description: "BE req is doubled, again. +3 points gain, BE cap +5.",
            currencyDisplayName: "Green Light",
            currencyInternalName: "gl",
            currencyLayer: "g",
            cost: new Decimal(20),
            unlocked() {return hasUpgrade(this.layer,11)&&!hideUpgs(this.layer,this.id)},
            style: {'touch-action':'manipulation'},
        },
        13: {
            title: "Green #3",
            description: "+3 points gain and BE mult, BE cap +10.",
            currencyDisplayName: "Blue Essence",
            currencyInternalName: "points",
            currencyLayer: "b",
            cost: new Decimal(310),
            unlocked() {return hasUpgrade(this.layer,12)&&!hideUpgs(this.layer,this.id)},
            style: {'touch-action':'manipulation'},
        },
        14: {
            title: "Green #4",
            description: "First dependent upgrade! Green Light (GL) adds to points gain.",
            currencyDisplayName: "Green Light",
            currencyInternalName: "gl",
            currencyLayer: "g",
            effect() {
                let eff = player.g.gl.pow(0.25)
                if(hasUpgrade("b",32)) eff = eff.mul(5)
                if(hasUpgrade("g",35)) eff = eff.pow(1.6)
                return eff
            },
            effectDisplay() {return "+"+format(this.effect())},
            unlocked() {return hasUpgrade(this.layer,13)&&!hideUpgs(this.layer,this.id)},
            cost: new Decimal(30),
            style: {'touch-action':'manipulation'},
        },
        15: {
            title: "Green #5",
            description: "Unlock a blue buyable, +4 BE mult, BE cap +30.",
            currencyDisplayName: "Blue Essence",
            currencyInternalName: "points",
            currencyLayer: "b",
            cost: new Decimal(320),
            unlocked() {return hasUpgrade(this.layer,14)&&!hideUpgs(this.layer,this.id)},
            style: {'touch-action':'manipulation'},
        },
        21: {
            title: "Green #6",
            description: "BE cap slightly boosts BE gain.",
            currencyDisplayName: "Blue Essence",
            currencyInternalName: "points",
            currencyLayer: "b",
            effect() {
                let eff = player.b.pointsCap.pow(0.3).mul(2)
                return eff
            },
            effectDisplay() {return "+"+format(this.effect())},
            unlocked() {return getBuyableAmount("b",12).gte(5)&&!hideUpgs(this.layer,this.id)},
            cost: new Decimal(430),
            style: {'touch-action':'manipulation'},
        },
        22: {
            title: "Green #7",
            description: "+1 Green Light base.",
            currencyDisplayName: "Green Light",
            currencyInternalName: "gl",
            currencyLayer: "g",
            unlocked() {return hasUpgrade(this.layer,21)&&!hideUpgs(this.layer,this.id)},
            cost: new Decimal(420),
            style: {'touch-action':'manipulation'},
        },
        23: {
            title: "Green #8",
            description: "+20 BE cap. Green #6 also applies to Green Light but with reduced effect.",
            currencyDisplayName: "Green Light",
            currencyInternalName: "gl",
            currencyLayer: "g",
            effect() {
                let eff = upgradeEffect(this.layer,21).div(3)
                if(hasUpgrade("g",35)) eff = player.b.pointsCap.div(2)
                return eff
            },
            effectDisplay() {return "+"+format(this.effect())},
            unlocked() {return hasUpgrade(this.layer,22)&&!hideUpgs(this.layer,this.id)},
            cost: new Decimal(400),
            style: {'touch-action':'manipulation'},
        },
        24: {
            title: "Green #9",
            description: "+10 points gain, +25 BE cap.",
            currencyDisplayName: "Green Light",
            currencyInternalName: "gl",
            currencyLayer: "g",
            unlocked() {return hasUpgrade(this.layer,23)&&!hideUpgs(this.layer,this.id)},
            cost: new Decimal(700),
            style: {'touch-action':'manipulation'},
        },
        25: {
            title: "Green #10",
            description: "+15 BE cap. Blue layer resets nothing.",
            currencyDisplayName: "Green Light",
            currencyInternalName: "gl",
            currencyLayer: "g",
            unlocked() {return hasUpgrade(this.layer,24)&&!hideUpgs(this.layer,this.id)},
            cost: new Decimal(1000),
            style: {'touch-action':'manipulation'},
        },
        31: {
            title: "Green #11",
            description: "Points affects GL gain at a reduced rate.",
            currencyDisplayName: "Green Light",
            currencyInternalName: "gl",
            currencyLayer: "g",
            effect() {
                let eff = player.points.pow(0.3).mul(3)
                return eff
            },
            effectDisplay() {return "+"+format(this.effect())},
            unlocked() {return hasUpgrade("b",35)&&!hideUpgs(this.layer,this.id)},
            cost: new Decimal(16000),
            style: {'touch-action':'manipulation'},
        },
        32: {
            title: "Green #12",
            description: "Total Blue buyables amount affect the gain of points and Green Light.",
            currencyDisplayName: "Green Light",
            currencyInternalName: "gl",
            currencyLayer: "g",
            effect() {
                let totalBuys = getBuyableAmount("b",11).add(getBuyableAmount("b",12)).add(getBuyableAmount("b",13))
                let eff = [totalBuys.mul(6),totalBuys.mul(2)]
                return eff
            },
            effectDisplay() {return "+"+formatWhole(this.effect()[0])+" points gain, +"+formatWhole(this.effect()[1])+" Green Light gain."},
            unlocked() {return hasUpgrade("g",31)&&!hideUpgs(this.layer,this.id)},
            cost: new Decimal(20000),
            style: {'touch-action':'manipulation'},
        },
        33: {
            title: "Green #13",
            description: "+200 points and Green Light gain. +250 BE cap.",
            currencyDisplayName: "Green Light",
            currencyInternalName: "gl",
            currencyLayer: "g",
            unlocked() {return hasUpgrade("g",32)&&!hideUpgs(this.layer,this.id)},
            cost: new Decimal(30000),
            style: {'touch-action':'manipulation'},
        },
        34: {
            title: "Green #14",
            description: "+0.5 Green Light base.",
            currencyDisplayName: "Green Light",
            currencyInternalName: "gl",
            currencyLayer: "g",
            unlocked() {return hasUpgrade("g",33)&&!hideUpgs(this.layer,this.id)},
            cost: new Decimal(50000),
            style: {'touch-action':'manipulation'},
        },
        35: {
            title: "Green #15",
            description: "Drastically improve the effect of Green #4 and Green #8.",
            currencyDisplayName: "Green Light",
            currencyInternalName: "gl",
            currencyLayer: "g",
            unlocked() {return hasUpgrade("g",34)&&!hideUpgs(this.layer,this.id)},
            cost: new Decimal(125000),
            style: {'touch-action':'manipulation'},
        },
        41: {
            title: "Green #16",
            description: "Unlock another blue buyable, Blue #B3 base +30.",
            currencyDisplayName: "Green Light",
            currencyInternalName: "gl",
            currencyLayer: "g",
            cost: new Decimal(2e5),
            unlocked() {return hasUpgrade(this.layer,35)&&!hideUpgs(this.layer,this.id)},
            style: {'touch-action':'manipulation'},
        },
        42: {
            title: "Green #17",
            description() {
                let desc = "Double points and GL gain.", effText = ""
                if(hasUpgrade("r",13)) {
                    desc = "GEG4 gain a multiplier based on points.<br>"
                    effText = "Currently: x"+format(this.effect())
                }
                return desc+effText
            },
            currencyDisplayName: "Green Light",
            currencyInternalName: "gl",
            currencyLayer: "g",
            effect() {
                let eff = player.points.max(1).log10().div(1.5)
                return eff
            },
            cost: new Decimal(7e5),
            unlocked() {return getBuyableAmount("b",21).gte(4)&&!hideUpgs(this.layer,this.id)},
            style: {'touch-action':'manipulation'},
        },
        43: {
            title: "Green #18",
            description: "+10,000 points and Green Light gain. +350 BE cap.",
            currencyDisplayName: "Green Light",
            currencyInternalName: "gl",
            currencyLayer: "g",
            cost: new Decimal(15e5),
            unlocked() {return hasUpgrade(this.layer,42)&&!hideUpgs(this.layer,this.id)},
            style: {'touch-action':'manipulation'},
        },
        44: {
            title: "Green #19",
            description() {
                let desc = "BE directly adds to points gain.", effText = ""
                if(player.r.gEnergy.gte(1)) effText = "<br>Currently: +"+formatWhole(player.b.points.mul(tmp.r.gEnergyEff1))
                return desc+effText
            },
            currencyDisplayName: "Green Light",
            currencyInternalName: "gl",
            currencyLayer: "g",
            cost: new Decimal(30e5),
            unlocked() {return hasUpgrade(this.layer,43)&&!hideUpgs(this.layer,this.id)},
            style: {'touch-action':'manipulation'},
        },
        45: {
            title: "Green #20",
            description() {
                let desc = "Double points and GL gain, again."
                if(hasUpgrade("r",14)) desc = "Green #35 is 10% stronger."
                return desc
            },
            currencyDisplayName: "Green Light",
            currencyInternalName: "gl",
            currencyLayer: "g",
            cost: new Decimal(6e6),
            unlocked() {return hasUpgrade(this.layer,44)&&!hideUpgs(this.layer,this.id)},
            style: {'touch-action':'manipulation'},
        },
        51: {
            title: "Green #21",
            description: "+1,000,000 points gain.",
            currencyDisplayName: "Green Light",
            currencyInternalName: "gl",
            currencyLayer: "g",
            cost: new Decimal(1e9),
            unlocked() {return hasMilestone("r",4)&&!hideUpgs(this.layer,this.id)},
            style: {'touch-action':'manipulation'},
        },
        52: {
            title: "Green #22",
            description: "Significantly increase the 2nd effect of Blue #15.",
            currencyDisplayName: "Green Light",
            currencyInternalName: "gl",
            currencyLayer: "g",
            cost: new Decimal(1e9),
            unlocked() {return hasMilestone("r",4)&&!hideUpgs(this.layer,this.id)},
            style: {'touch-action':'manipulation'},
        },
        53: {
            title: "Green #23",
            description: "+0.5 Blue #B4 base.",
            currencyDisplayName: "Green Light",
            currencyInternalName: "gl",
            currencyLayer: "g",
            cost: new Decimal(1.2e9),
            unlocked() {return hasMilestone("r",4)&&!hideUpgs(this.layer,this.id)},
            style: {'touch-action':'manipulation'},
        },
        54: {
            title: "Green #24",
            description: "+1 effective GE when calculating GL Gain. Unlock a new Blue buyable.",
            currencyDisplayName: "Green Light",
            currencyInternalName: "gl",
            currencyLayer: "g",
            cost: new Decimal(2e9),
            unlocked() {return hasMilestone("r",4)&&!hideUpgs(this.layer,this.id)},
            style: {'touch-action':'manipulation'},
        },
        55: {
            title: "Green #25",
            description() {return "+"+formatWhole(6.25e6)+" points gain. Blue #4 no longer costs anything."},
            currencyDisplayName: "Green Light",
            currencyInternalName: "gl",
            currencyLayer: "g",
            cost: new Decimal(1e10),
            unlocked() {return hasMilestone("r",4)&&!hideUpgs(this.layer,this.id)},
            style: {'touch-action':'manipulation'},
        },
        61: {
            title: "Green #26",
            description: "+0.1 Green Light base. GEG4 is 20% stronger.",
            currencyDisplayName: "Green Light",
            currencyInternalName: "gl",
            currencyLayer: "g",
            cost: new Decimal(2.5e16),
            unlocked() {return hasMilestone("r",11)&&!hideUpgs(this.layer,this.id)},
            style: {'touch-action':'manipulation'},
        },
        62: {
            title: "Green #27",
            description: "+0.1 Green Light base. BEG3 is 5 times as powerful.",
            currencyDisplayName: "Green Light",
            currencyInternalName: "gl",
            currencyLayer: "g",
            cost: new Decimal(3e16),
            unlocked() {return hasMilestone("r",11)&&!hideUpgs(this.layer,this.id)},
            style: {'touch-action':'manipulation'},
        },
        63: {
            title: "Green #28",
            description: "+0.1 Green Light base. Red #M8 is twice as powerful.",
            currencyDisplayName: "Green Light",
            currencyInternalName: "gl",
            currencyLayer: "g",
            cost: new Decimal(5e16),
            unlocked() {return hasMilestone("r",11)&&!hideUpgs(this.layer,this.id)},
            style: {'touch-action':'manipulation'},
        },
        64: {
            title: "Green #29",
            description: "+0.1 Green Light base. BEG1 is 100% stronger.",
            currencyDisplayName: "Green Light",
            currencyInternalName: "gl",
            currencyLayer: "g",
            cost: new Decimal(7.5e16),
            unlocked() {return hasMilestone("r",11)&&!hideUpgs(this.layer,this.id)},
            style: {'touch-action':'manipulation'},
        },
        65: {
            title: "Green #30",
            description: "+0.1 Green Light base. GEG4 is 200% stronger.",
            currencyDisplayName: "Green Light",
            currencyInternalName: "gl",
            currencyLayer: "g",
            cost: new Decimal(1.2e17),
            unlocked() {return hasMilestone("r",11)&&!hideUpgs(this.layer,this.id)},
            style: {'touch-action':'manipulation'},
        },
        71: {
            title: "Green #31",
            description: "x4 GEG4, x3 BEG4, BEG2 is 50% stronger.",
            currencyDisplayName: "Green Light",
            currencyInternalName: "gl",
            currencyLayer: "g",
            cost: new Decimal(3e17),
            unlocked() {return hasMilestone("r",11)&&!hideUpgs(this.layer,this.id)},
            style: {'touch-action':'manipulation'},
        },
        72: {
            title: "Green #32",
            description: "x4 GEG4, x2 BEG4, significantly soften Blue #B2 cost increase.",
            currencyDisplayName: "Green Light",
            currencyInternalName: "gl",
            currencyLayer: "g",
            cost: new Decimal(7e17),
            unlocked() {return hasMilestone("r",11)&&!hideUpgs(this.layer,this.id)},
            style: {'touch-action':'manipulation'},
        },
        73: {
            title: "Green #33",
            description: "x4 GEG4, x2 BEG4, Red #M9 exponent +0.1.",
            currencyDisplayName: "Green Light",
            currencyInternalName: "gl",
            currencyLayer: "g",
            cost: new Decimal(3.15e18),
            unlocked() {return hasMilestone("r",11)&&!hideUpgs(this.layer,this.id)},
            style: {'touch-action':'manipulation'},
        },
        74: {
            title: "Green #34",
            description: "x4 GEG4, x2 BEG4, x2 REG1.",
            currencyDisplayName: "Green Light",
            currencyInternalName: "gl",
            currencyLayer: "g",
            cost: new Decimal(1.26e19),
            unlocked() {return hasMilestone("r",11)&&!hideUpgs(this.layer,this.id)},
            style: {'touch-action':'manipulation'},
        },
        75: {
            title: "Green #35",
            description: "x4 GEG4, x2 BEG4, BE cap is multiplied by BE gain with greatly reduced effect.",
            currencyDisplayName: "Green Light",
            currencyInternalName: "gl",
            currencyLayer: "g",
            cost: new Decimal(1e20),
            effect() {
                let eff = tmp.b.gainMult.max(1).log(5).div(10)
                if(hasUpgrade("r",14)) eff = eff.mul(1.1)
                eff = eff.add(1)
                return eff
            },
            effectDisplay() {return "+"+format(this.effect().sub(1).mul(100))+"%"},
            unlocked() {return hasMilestone("r",11)&&!hideUpgs(this.layer,this.id)},
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
            style: {'width':'300px','min-height':'60px','font-color':'white'}
        },
    }
}) // Green