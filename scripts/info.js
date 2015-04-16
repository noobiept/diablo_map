var INFO = {
    act_1: {
        image: 'act_1',

            // entrances position in act1 image
        damp_cellar: {
            text: 'Damp Cellar', x: -270, y: 512, dest: 'damp_cellar'
        },

        dark_cellar: {
            text: 'Dark Cellar', x: -46, y: 487
        },

        hidden_cellar: {
            text: 'The Hidden Cellar', x: 285, y: 414
        },

        mass_grave: {
            text: 'Mass Grave', x: 216, y: 240
        },

        leorics_passage: {
            text: "Leoric's Passage", x: 462, y: 150
        },

        cathedral_level_1: {
            text: "Cathedral Level 1", x: 377, y: 65
        },

        dank_cellar: {
            text: 'Dank Cellar', x: -178, y: 315
        },

        cave_under_the_well: {
            text: 'The Cave Under the Well', x: -247, y: 381,
            alternate: [ { x: -415, y: 505 }, { x: -190, y: 565 } ]
        },

        musty_cellar: {
            text: 'Musty Cellar', x: -155, y: 715
        },


        cave_entrances: [
            'damp_cellar', 'dark_cellar', 'hidden_cellar', 'mass_grave', 'leorics_passage', 'cathedral_level_1', 'dank_cellar', 'cave_under_the_well', 'musty_cellar'
        ],

        cave_exits: [

        ]
    },
    damp_cellar: {
        image: 'damp_cellar',

        old_tristram_road: {
            text: 'Old Tristram Road', x: 39, y: -38, dest: 'act_1', position: 'damp_cellar'
        },

        cave_entrances: [],

        cave_exits: [ 'old_tristram_road' ]
    }
};