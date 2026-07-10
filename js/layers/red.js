function generateEGEffText(effText,req,layer,id) {
    let len = effText.length
    let result = ""
    for(let index = 0; index < len; index++)
        if(getBuyableAmount(layer,id).gte(req[index])) {
            if(index != 0) result = result+"<br>"
            result = result+effText[index]
        }
    return result
}

addLayer("r", {
    tabFormat: [
        ["display-text", function() {
            return "You have "+layerText("h2","r",formatWhole(player[this.layer].points))+" "+tmp[this.layer].resource+"."
        }],"resource-display",
        "prestige-button",
        "blank",
        ["microtabs","sep"],
    ],
    name: "Red", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "R", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        bEnergy: new Decimal(0),
        gEnergy: new Decimal(0),
        rEnergy: new Decimal(0),
    }},
    infoboxes: {
        
    },
    microtabs: {
        sep: {
            Milestones: {
                content: ["milestones"]
            },
            Energy: {
                content: [
                    "buyables",["blank", function(){return getBuyableAmount("r",11).gte(1)?"":"0px"}],
                    ["display-text",function() {
                        let resourceText = "You have "+layerText("h2","b",formatWhole(player.r.bEnergy))+" Blue Energy.<br>In which it translates to the following effects:<br><br>"
                        let effText = [
                            "BEG1: "+"x"+layerText("h2","b",format(tmp.r.bEnergyEff1))+" to points gain.",
                            "BEG2: "+"x"+layerText("h2","b",format(tmp.r.bEnergyEff2))+" Blue #B2 base.",
                            "BEG3: "+"x"+layerText("h2","b",format(tmp.r.bEnergyEff3))+" to GL gain.",
                            "BEG4: "+"+"+layerText("h2","b",format(tmp.r.bEnergyEff4))+" to points gain.",
                            "BEG5: "+"+"+layerText("h2","b",format(tmp.r.bEnergyEff5))+" Blue #B4 base.",
                            "BEG6: "+"x"+layerText("h2","b",format(tmp.r.bEnergyEff6,3))+" BE cap.",
                        ]
                        let req = [1,4,11,30,101,501]
                        let effects = generateEGEffText(effText,req,this.layer,11)
                        return resourceText+effects
                    }],["blank", function(){return getBuyableAmount("r",12).gte(1)?"":"0px"}],
                    ["display-text",function() {
                        let resourceText = "You have "+layerText("h2","g",formatWhole(player.r.gEnergy))+" Green Energy.<br>In which it translates to the following effects:<br><br>"
                        let effText = [
                            "GEG1: "+"x"+layerText("h2","g",format(tmp.r.gEnergyEff1))+" Green #19 effect.",
                            "GEG2: "+"+"+layerText("h2","g",format(tmp.r.gEnergyEff2))+" GL multiplier.",
                            "GEG3: "+"+"+layerText("h2","g",format(tmp.r.gEnergyEff3))+" effective Blue Energy to BEG1-BEG3.",
                            "GEG4: "+"+"+layerText("h2","g",format(tmp.r.gEnergyEff4))+" to GL gain.",
                        ]
                        let req = [1,2,10,17]
                        let effects = generateEGEffText(effText,req,this.layer,12)
                        return resourceText+effects
                    }],["blank", function(){return getBuyableAmount("r",13).gte(1)?"":"0px"}],
                    ["display-text",function() {
                        let resourceText = "You have "+layerText("h2","r",formatWhole(player.r.rEnergy))+" Red Energy.<br>In which it translates to the following effects:<br><br>"
                        let effText = [
                            "REG1: "+"+"+layerText("h2","r",format(tmp.r.rEnergyEff1))+" RE mult.",
                            "REG2: "+"/"+layerText("h2","r",format(tmp.r.rEnergyEff2))+" requirement for RE.",
                            "REG3: "+"+"+layerText("h2","r",format(tmp.r.rEnergyEff3))+" effective Green Energy to GEG1-GEG4."
                        ]
                        let req = [1,10,16]
                        let effects = generateEGEffText(effText,req,this.layer,13)
                        return resourceText+effects
                    }]
                ],
                unlocked() {return hasMilestone("r",5)}
            },
            Upgrades: {
                content: ["upgrades"],
                unlocked() {return hasMilestone("r",14)}
            }
        }
    },
    color: "#ff0000",
    requires() {
        let req = new Decimal(5e6)
        if(getBuyableAmount("r",13).gte(10)) req = req.div(tmp.r.rEnergyEff2)
        return req
    }, // Can be a function that takes requirement increases into account
    resource: "Red Essence", // Name of prestige currency
    baseResource: "Points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.2, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        if(hasMilestone("r",3)) mult = mult.add(1)
        if(hasMilestone("r",7)) mult = mult.add(0.5)
        if(hasUpgrade("b",53)) mult = mult.add(1)
        mult = mult.add(tmp.r.rEnergyEff1)
        if(hasUpgrade("r",11)) mult = mult.add(5)
        if(hasUpgrade("r",12)) mult = mult.add(5)
        if(hasUpgrade("r",13)) mult = mult.add(5)
        if(hasUpgrade("r",14)) mult = mult.add(5)
        if(hasUpgrade("r",15)) mult = mult.add(5)
        if(hasUpgrade("r",21)) mult = mult.add(10)
        if(hasUpgrade("r",22)) mult = mult.add(10)
        if(hasUpgrade("r",23)) mult = mult.add(10)
        if(hasUpgrade("r",24)) mult = mult.add(10)
        if(hasUpgrade("r",25)) mult = mult.add(10)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    passiveGeneration() {
        let gain = new Decimal(0)
        if(hasMilestone("r",0)) gain = gain.add(0.1)
        if(hasUpgrade("b",55)) gain = gain.add(0.1)
        if(hasUpgrade("r",23)) gain = gain.add(0.2)
        if(hasUpgrade("r",32)) gain = gain.add(0.6)
        return gain
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    position: 0,
    hotkeys: [
        //{key: "w", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasUpgrade("g",45)},

    doReset(resettingLayer) {
        
    },

    effect() {
        
    },

    redM2eff() {
        let inc = player.r.points.mul(100).min(1e5)
        return inc
    },

    redM4eff() {
        let inc = player.r.points.mul(1000)
        return inc
    },

    redM8eff() {
        let inc = player.r.points
        if(hasUpgrade("r",34)) inc = player.r.total
        if(hasUpgrade("g",63)) inc = inc.mul(2)
        if(hasUpgrade("r",23)) inc = inc.mul(2)
        return inc
    },

    redM9eff() {
        let exp = 0.25
        if(hasUpgrade("g",73)) exp = exp+0.1
        let inc = player.b.points.pow(exp)
        return inc
    },

    redM17eff() {
        let mult = tmp.r.bEnergyEff5.pow(0.75)
        return mult
    },

    bEnergyEff1() {
        let be = player.r.bEnergy
        if(getBuyableAmount("r",12).gte(10)) be = be.add(tmp.r.gEnergyEff3)
        let mult = be.div(2).add(1)
        if(hasUpgrade("g",64)) mult = mult.mul(1.5)
        return mult
    },

    bEnergyEff2() {
        let be = player.r.bEnergy
        if(getBuyableAmount("r",12).gte(10)) be = be.add(tmp.r.gEnergyEff3)
        let mult = be.sub(2).max(1), inverseSCPow = 1-1/3, SCStrength = 1
        if(hasUpgrade("g",71)) SCStrength = SCStrength-0.2
        if(hasUpgrade("r",33)) SCStrength = SCStrength-0.3
        inverseSCPow = SCStrength*inverseSCPow
        softcapPower = 1-inverseSCPow
        if(mult.gte(10)) mult = mult.div(10).pow(softcapPower).mul(10)
        if(hasUpgrade("r",24)) mult = mult.mul(2)
        return mult
    },

    bEnergyEff3() {
        let be = player.r.bEnergy
        if(getBuyableAmount("r",12).gte(10)) be = be.add(tmp.r.gEnergyEff3)
        let mult = be.sub(10).div(5).add(1).max(1)
        if(hasMilestone("r",9)) mult = mult.mul(2)
        if(hasUpgrade("g",62)) mult = mult.mul(5)
        return mult
    },

    bEnergyEff4() {
        let be = player.r.bEnergy
        if(hasUpgrade("r",21)) be = be.add(tmp.r.gEnergyEff3)
        let mult = be.sub(29).pow(1.1).mul(1e9)
        if(hasUpgrade("g",71)) mult = mult.mul(3)
        if(hasUpgrade("g",72)) mult = mult.mul(2)
        if(hasUpgrade("g",73)) mult = mult.mul(2)
        if(hasUpgrade("g",74)) mult = mult.mul(2)
        if(hasUpgrade("g",75)) mult = mult.mul(2)
        if(hasUpgrade("r",11)) mult = mult.mul(upgradeEffect("r",11))
        if(hasUpgrade("r",12)) mult = mult.mul(buyableEffect("b",13))
        if(hasUpgrade("r",32)) mult = mult.mul(10)
        return mult
    },

    bEnergyEff5() {
        let be = player.r.bEnergy
        let mult = be.sub(100).pow(1.5).mul(0.3)
        return mult
    },

    bEnergyEff6() {
        let be = player.r.bEnergy
        let base = new Decimal(1.006)
        let mult = base.pow(be.sub(500).pow(0.9))
        return mult
    },

    gEnergyEff1() {
        let ge = player.r.gEnergy
        if(getBuyableAmount("r",13).gte(16)) ge = ge.add(tmp.r.rEnergyEff3)
        let mult = ge.mul(0.75).add(1)
        if(hasMilestone("r",11)) mult = mult.mul(5)
        if(hasMilestone("r",15)) mult = mult.mul(2)
        return mult
    },

    gEnergyEff2() {
        let ge = player.r.gEnergy
        if(getBuyableAmount("r",13).gte(16)) ge = ge.add(tmp.r.rEnergyEff3)
        let mult = ge.sub(1).mul(5)
        if(hasMilestone("r",11)) mult = mult.mul(1.5)
        if(hasMilestone("r",15)) mult = mult.mul(2)
        if(hasMilestone("r",16)) mult = mult.mul(tmp.r.redM17eff)
        return mult
    },

    gEnergyEff3() {
        let ge = player.r.gEnergy
        if(getBuyableAmount("r",13).gte(16)) ge = ge.add(tmp.r.rEnergyEff3)
        let mult = ge.sub(9).max(0)
        if(hasMilestone("r",11)) mult = mult.mul(1.5)
        if(hasUpgrade("r",21)) mult = mult.mul(1.5)
        if(hasMilestone("r",15)) mult = mult.mul(2)
        return mult
    },

    gEnergyEff4() {
        let ge = player.r.gEnergy
        if(getBuyableAmount("r",13).gte(16)) ge = ge.add(tmp.r.rEnergyEff3)
        let mult = ge.sub(16).pow(1.2).mul(1e11)
        if(hasUpgrade("g",61)) mult = mult.mul(1.2)
        if(hasUpgrade("g",65)) mult = mult.mul(3)
        if(hasUpgrade("g",71)) mult = mult.mul(4)
        if(hasUpgrade("g",72)) mult = mult.mul(4)
        if(hasUpgrade("g",73)) mult = mult.mul(4)
        if(hasUpgrade("g",74)) mult = mult.mul(4)
        if(hasUpgrade("g",75)) mult = mult.mul(4)
        if(hasUpgrade("r",13)) mult = mult.mul(upgradeEffect("g",42))
        if(hasUpgrade("r",22)) mult = mult.mul(upgradeEffect("r",22))
        if(hasMilestone("r",15)) mult = mult.mul(2)
        if(hasUpgrade("r",32)) mult = mult.mul(10)
        return mult
    },

    rEnergyEff1() {
        let mult = player.r.rEnergy.pow(1.15)
        if(hasUpgrade("g",74)) mult = mult.mul(2)
        if(hasUpgrade("r",31)) mult = mult.mul(2)
        if(hasUpgrade("r",32)) mult = mult.mul(2)
        if(hasUpgrade("r",33)) mult = mult.mul(2)
        if(hasUpgrade("r",34)) mult = mult.mul(2)
        if(hasUpgrade("r",35)) mult = mult.mul(8)
        return mult
    },

    rEnergyEff2() {
        let mult = player.r.rEnergy.sub(10).pow(1.2).add(5)
        return mult
    },

    rEnergyEff3() {
        let inc = player.r.rEnergy.sub(15)
        if(hasUpgrade("r",35)) inc = inc.mul(2)
        return inc
    },

    automate() {
        layers[this.layer].buyables[11].buy()
        layers[this.layer].buyables[12].buy()
        layers[this.layer].buyables[13].buy()
    },

    autoPrestige() {return tmp[this.layer].baseAmount.gte(tmp[this.layer].requires)},

    autoUpgrade: true,

    canReset() {return !hasMilestone("r",0)},

    update(diff) {
        player.r.bEnergy = buyableEffect("r",11)
        player.r.gEnergy = buyableEffect("r",12)
        player.r.rEnergy = buyableEffect("r",13)
    },

    buyables: {
        11: {
            title: "Red #B1",
            cost(x) {
                let base = [new Decimal(33e4), new Decimal(150e4), new Decimal(3.75e7),new Decimal(1e15)]
                let scale = [new Decimal(1.5e4),new Decimal(5e4), new Decimal(10e4), new Decimal(1e6), new Decimal(1e7),new Decimal(1.02)]
                let scaledCost = [
                    base[0].add(scale[0].mul(x)),
                    base[0].add(scale[0].mul(18)).add(scale[1].mul(x.sub(18))),
                    base[1].add(scale[2].mul(x.sub(27))),
                    base[2].add(scale[3].mul(x.sub(100).pow(1.1))),
                    base[2].add(scale[3].mul(new Decimal(400).pow(1.1))).add(scale[4].mul(x.sub(500).pow(1.5))),
                    base[3].mul(scale[4].pow(x.sub(1000))),
                ]
                let consume = scaledCost[0]
                if(x.gte(19)&&x.lt(27)) consume = scaledCost[1]
                if(x.gte(27)&&x.lt(100)) consume = scaledCost[2]
                if(x.gte(100)&&x.lt(500)) consume = scaledCost[3]
                if(x.gte(500)&&x.lt(1000)) consume = scaledCost[4]
                if(x.gte(1000)) consume = scaledCost[5]
                return consume
            },
            baseEffect() {
                let base = new Decimal(1)
                return base
            },
            effect(x) {
                let eff = new Decimal(0)
                let base = this.baseEffect()
                if(x.gt(0)) eff = eff.add(base.mul(x))
                return eff
            },
            canAfford() {return player.b.points.gte(this.cost())},
            buy() {
                if(!this.canAfford()) return
                cost = tmp[this.layer].buyables[this.id].cost
                if(!hasMilestone("r",12)) player.b.points = player.b.points.sub(cost)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            display() {
                let gainDesc = "+"+formatWhole(this.baseEffect())+" "+layerText("b","b","Blue")+" Energy<br>"
                let boughtText = "("+formatWhole(getBuyableAmount(this.layer,this.id))+" purchased)<br><br>"
                let costText = "Cost: "+formatWhole(this.cost())+" "+tmp.b.resource
                return gainDesc+boughtText+costText
            },
            style: {'height':'110px', 'width':'160px'},
        },
        12: {
            title: "Red #B2",
            cost(x) {
                let base = new Decimal(1.5e10)
                let scale = [new Decimal(5/3)]
                let accel = new Decimal(1.02)
                let scaledCost = [
                    scale[0].pow(x.pow(accel)).mul(base),
                ]
                let consume = scaledCost[0]
                return consume
            },
            baseEffect() {
                let base = new Decimal(1)
                return base
            },
            effect(x) {
                let eff = new Decimal(0)
                let base = this.baseEffect()
                if(x.gt(0)) eff = eff.add(base.mul(x))
                return eff
            },
            canAfford() {return player.g.gl.gte(this.cost())},
            buy() {
                if(!this.canAfford()) return
                cost = tmp[this.layer].buyables[this.id].cost
                if(!hasMilestone("r",13)) player.g.gl = player.g.gl.sub(cost)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            display() {
                let gainDesc = "+"+formatWhole(this.baseEffect())+" "+layerText("b","g","Green")+" Energy<br>"
                let boughtText = "("+formatWhole(getBuyableAmount(this.layer,this.id))+" purchased)<br><br>"
                let costText = "Cost: "+formatWhole(this.cost())+" Green Light"
                return gainDesc+boughtText+costText
            },
            style: {'height':'110px', 'width':'160px'},
            unlocked() {return getBuyableAmount(this.layer,11).gte(3)}
        },
        13: {
            title: "Red #B3",
            cost(x) {
                let base = new Decimal(1.5e4)
                let scale = [new Decimal(1.5)]
                let accel = new Decimal(1.03)
                let scaledCost = [
                    scale[0].pow(x.pow(accel)).mul(base),
                ]
                let consume = scaledCost[0]
                return consume
            },
            baseEffect() {
                let base = new Decimal(1)
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
                player[this.layer].points = player[this.layer].points.sub(cost)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            display() {
                let gainDesc = "+"+formatWhole(this.baseEffect())+" "+layerText("b","r","Red")+" Energy<br>"
                let boughtText = "("+formatWhole(getBuyableAmount(this.layer,this.id))+" purchased)<br><br>"
                let costText = "Cost: "+formatWhole(this.cost())+" "+tmp.r.resource
                return gainDesc+boughtText+costText
            },
            style: {'height':'110px', 'width':'160px'},
            unlocked() {return hasMilestone("r",10)}
        },
    },

    upgrades: {
        11: {
            title: "Red #1",
            description: "+5 RE mult, BEG1 gives a small multiplier to BEG4.",
            effect() {
                let eff = tmp.r.bEnergyEff1.pow(0.25).add(0.5)
                return eff
            },
            effectDisplay() {return "x"+format(this.effect())},
            cost: new Decimal(25e4),
            style: {'touch-action':'manipulation'},
        },
        12: {
            title: "Red #2",
            description: "+5 RE mult, the effect of Blue #B3 is altered.",
            cost: new Decimal(35e4),
            unlocked() {return hasUpgrade("r",11)},
            style: {'touch-action':'manipulation'},
        },
        13: {
            title: "Red #3",
            description: "+5 RE mult, the effect of Green #17 is altered.",
            cost: new Decimal(45e4),
            unlocked() {return hasUpgrade("r",12)},
            style: {'touch-action':'manipulation'},
        },
        14: {
            title: "Red #4",
            description: "+5 RE mult, the effect of Green #20 is altered.",
            cost: new Decimal(50e4),
            unlocked() {return hasUpgrade("r",13)},
            style: {'touch-action':'manipulation'},
        },
        15: {
            title: "Red #5",
            description: "+5 RE mult, the requirement of getting next GE is reduced by 50%.",
            cost: new Decimal(625e3),
            unlocked() {return hasUpgrade("r",14)},
            style: {'touch-action':'manipulation'},
        },
        21: {
            title: "Red #6",
            description: "+10 RE mult, GEG3 also applies to BEG4 and is 50% stronger.",
            cost: new Decimal(125e4),
            unlocked() {return hasUpgrade("r",15)},
            style: {'touch-action':'manipulation'},
        },
        22: {
            title: "Red #7",
            description: "+10 RE mult, BEG3 gives a small multiplier to GEG4.",
            cost: new Decimal(150e4),
            effect() {
                let eff = tmp.r.bEnergyEff3.pow(1/3).add(1.8)
                return eff
            },
            effectDisplay() {return "x"+format(this.effect())},
            unlocked() {return hasUpgrade("r",21)},
            style: {'touch-action':'manipulation'},
        },
        23: {
            title: "Red #8",
            description: "+10 RE mult, RE passive gain and Red #M8 effect are twice as strong.",
            cost: new Decimal(175e4),
            unlocked() {return hasUpgrade("r",22)},
            style: {'touch-action':'manipulation'},
        },
        24: {
            title: "Red #9",
            description: "+10 RE mult, BEG2 is twice as strong.",
            cost: new Decimal(250e4),
            unlocked() {return hasUpgrade("r",23)},
            style: {'touch-action':'manipulation'},
        },
        25: {
            title: "Red #10",
            description: "+10 RE mult, Blue #B5 no longer costs BE. Unlock a new Blue buyable.",
            cost: new Decimal(300e4),
            unlocked() {return hasUpgrade("r",24)},
            style: {'touch-action':'manipulation'},
        },
        31: {
            title: "Red #11",
            description: "REG1 is twice as strong. The cost scaling of Blue #B3 is softer.",
            cost: new Decimal(1e7),
            unlocked() {return getBuyableAmount("b",23).gte(1)},
            style: {'touch-action':'manipulation'},
        },
        32: {
            title: "Red #12",
            description: "REG1 is twice as strong. Gain 100% of RE and x10 BEG4 and GEG4.",
            cost: new Decimal(2e7),
            unlocked() {return hasUpgrade("r",31)},
            style: {'touch-action':'manipulation'},
        },
        33: {
            title: "Red #13",
            description: "REG1 is twice as strong. BEG2 softcap is 30% weaker (additively).",
            cost: new Decimal(3.5e7),
            unlocked() {return hasUpgrade("r",32)},
            style: {'touch-action':'manipulation'},
        },
        34: {
            title: "Red #14",
            description: "REG1 is twice as strong. Red #M8 uses total RE instead of current one.",
            cost: new Decimal(6e7),
            unlocked() {return hasUpgrade("r",33)},
            style: {'touch-action':'manipulation'},
        },
        35: {
            title: "Red #15",
            description: "REG1 is 8 times as strong, and REG3 is twice as strong.",
            cost: new Decimal(1e8),
            unlocked() {return hasUpgrade("r",33)},
            style: {'touch-action':'manipulation'},
        },
    },

    milestones: {
        0: {
            requirementDescription: "Red #M1: 1 RE",
            effectDescription: "+3,000 points gain, GL gain and +1,000 BE cap. Disable the prestige button for Red and instead generate 10% RE on reset.",
            done() {return player.r.points.gte(1)},
        },
        1: {
            requirementDescription: "Red #M2: 10 RE",
            effectDescription() {
                let descText = "Increase BE cap based on RE. This effect caps at "+formatWhole(1e5)+".<br>"
                let effText = "Currently: +"+format(tmp.r.redM2eff)
                return descText+effText
            },
            done() {return player.r.points.gte(10)},
        },
        2: {
            requirementDescription: "Red #M3: 20 RE",
            effectDescription: "+5,000 points gain. Unlock a new row of Blue upgrades.",
            done() {return player.r.points.gte(20)},
        },
        3: {
            requirementDescription: "Red #M4: 100 RE",
            effectDescription() {
                let descText = "+1 RE mult. RE boosts points gain significantly.<br>"
                let effText = "Currently: +"+format(tmp.r.redM4eff)
                return descText+effText
            },
            done() {return player.r.points.gte(100)},
        },
        4: {
            requirementDescription: "Red #M5: 150 RE",
            effectDescription: "Unlock a new row of Green upgrades.",
            done() {return player.r.points.gte(150)},
        },
        5: {
            requirementDescription: "Red #M6: 1,250 RE",
            effectDescription: "Unlock Energy.",
            done() {return player.r.points.gte(1250)},
            unlocked() {return hasUpgrade("g",55)}
        },
        6: {
            requirementDescription: "Red #M7: 7 Blue Energy",
            effectDescription: "Blue #15 uses the best Green Light you have instead of current one.",
            done() {return player.r.bEnergy.gte(7)},
            unlocked() {return hasMilestone("r",5)}
        },
        7: {
            requirementDescription: "Red #M8: 5,000 RE",
            effectDescription() {
                let descText = "+0.5 RE mult, increase BE cap based on RE.<br>"
                let effText = "Currently: +"+format(tmp.r.redM8eff)
                return descText+effText
            },
            done() {return player.r.points.gte(5000)},
            unlocked() {return player.r.bEnergy.gte(11)}
        },
        8: {
            requirementDescription: "Red #M9: 4 Green Energy",
            effectDescription() {
                let exp = 0.25
                if(hasUpgrade("g",73)) exp = exp+0.1
                let descText = "BE^"+format(exp)+" multiplies GL gain. Disable Green #17 and Green #20.<br>"
                let effText = "Currently: x"+format(tmp.r.redM9eff)
                return descText+effText
            },
            done() {return player.r.gEnergy.gte(4)},
            unlocked() {return hasMilestone("r",7)}
        },
        9: {
            requirementDescription: "Red #M10: 20 Blue Energy",
            effectDescription: "x2 BEG3. Unlock a new row of Blue upgrades.",
            done() {return player.r.bEnergy.gte(20)},
            unlocked() {return hasMilestone("r",8)}
        },
        10: {
            requirementDescription: "Red #M11: 10,000 RE",
            effectDescription: "Unlock Red Energy.",
            done() {return player.r.points.gte(10000)},
            unlocked() {return hasUpgrade("b",55)}
        },
        11: {
            requirementDescription: "Red #M12: 20 Green Energy",
            effectDescription: "x5 to GEG1 and x1.5 to GEG2 and GEG3. Unlock 2 new rows of Green upgrades.",
            done() {return player.r.gEnergy.gte(20)},
            unlocked() {return hasMilestone("r",10)}
        },
        12: {
            requirementDescription: "Red #M13: 50 Blue Energy",
            effectDescription: "Buying Blue Energy no longer costs BE.",
            done() {return player.r.bEnergy.gte(50)},
            unlocked() {return hasMilestone("r",11)}
        },
        13: {
            requirementDescription: "Red #M14: 30 Green Energy",
            effectDescription: "Buying Green Energy no longer costs GL.",
            done() {return player.r.gEnergy.gte(30)},
            unlocked() {return hasMilestone("r",11)}
        },
        14: {
            requirementDescription: "Red #M15: 100 Blue Energy & 1e19 Green Light",
            effectDescription: "Unlock Red upgrades.",
            done() {return player.r.bEnergy.gte(100)&&player.g.gl.gte(1e19)},
            unlocked() {return hasUpgrade("g",75)}
        },
        15: {
            requirementDescription: "Red #M16: 50 Green Energy",
            effectDescription: "All GEGs are twice as strong (not including the upcoming ones).",
            done() {return player.r.gEnergy.gte(50)},
            unlocked() {return hasUpgrade("r",25)}
        },
        16: {
            requirementDescription: "Red #M17: 250 Blue Energy",
            effectDescription() {
                let descText = "Drastically improve GEG2 based on BEG5.<br>"
                let effText = "Currently: x"+format(tmp.r.redM17eff)
                return descText+effText
            },
            done() {return player.r.bEnergy.gte(250)},
            unlocked() {return hasUpgrade("r",25)}
        },
        17: {
            requirementDescription: "Red #M18: 1,000 Blue Energy",
            effectDescription: "The effect of Blue #3 is altered. x2 Blue #15 first effect.",
            done() {return player.r.bEnergy.gte(1000)},
            unlocked() {return hasUpgrade("r",25)}
        },
    },
    
    clickables: {
        11: {
        },
    }
}) // Red