const preset = {
    id: 'contortionist',
    "settings": {
        "config": {
            "bpm": 90
        },
        "sequences": [{
            "id": "total",
            "bars": 8,
            "beats": 4
        }, {
            "id": "CUSTOM_SEQUENCE_1",
            "description": "Guitars",
            "bars": 8,
            "beats": 4,
            "hitChance": 1,
            "allowedLengths": [{
                "id": "0.25",
                "name": "whole",
                "amount": 0,
                "isTriplet": false,
                "isDotted": false
            }, {
                "id": "0.5",
                "name": "half",
                "amount": 1,
                "isTriplet": false,
                "isDotted": true
            }, {
                "id": "1",
                "name": "quarter",
                "amount": 1,
                "isTriplet": false,
                "isDotted": true
            }, {
                "id": "2",
                "name": "eighth",
                "amount": 0,
                "isTriplet": false,
                "isDotted": false
            }, {
                "id": "4",
                "name": "sixteenth",
                "amount": 0,
                "isTriplet": false,
                "isDotted": false
            }]
        }, {
            "id": "CUSTOM_SEQUENCE_2",
            "description": "Lead Guitar",
            "bars": 1,
            "beats": 6,
            "hitChance": 1,
            "allowedLengths": [{
                "id": "0.25",
                "name": "whole",
                "amount": 0,
                "isTriplet": false,
                "isDotted": false
            }, {
                "id": "0.5",
                "name": "half",
                "amount": 1,
                "isTriplet": false,
                "isDotted": false
            }, {
                "id": "1",
                "name": "quarter",
                "amount": 1,
                "isTriplet": false,
                "isDotted": true
            }, {
                "id": "2",
                "name": "eighth",
                "amount": 1,
                "isTriplet": false,
                "isDotted": false
            }, {
                "id": "4",
                "name": "sixteenth",
                "amount": 0,
                "isTriplet": false,
                "isDotted": false
            }]
        }, {
            "id": "CUSTOM_SEQUENCE_3",
            "description": "Hihat",
            "bars": 2,
            "beats": 4,
            "hitChance": 1,
            "allowedLengths": [{
                "id": "0.25",
                "name": "whole",
                "amount": 0,
                "isTriplet": false,
                "isDotted": false
            }, {
                "id": "0.5",
                "name": "half",
                "amount": 0,
                "isTriplet": false,
                "isDotted": false
            }, {
                "id": "1",
                "name": "quarter",
                "amount": 0,
                "isTriplet": false,
                "isDotted": false
            }, {
                "id": "2",
                "name": "eighth",
                "amount": 9,
                "isTriplet": false,
                "isDotted": false
            }, {
                "id": "4",
                "name": "sixteenth",
                "amount": 1,
                "isTriplet": false,
                "isDotted": false
            }]
        }, {
            "id": "CUSTOM_SEQUENCE_4",
            "description": "Dotted",
            "bars": 4,
            "beats": 4,
            "hitChance": 1,
            "allowedLengths": [{
                "id": "0.25",
                "name": "whole",
                "amount": 0,
                "isTriplet": false,
                "isDotted": false
            }, {
                "id": "0.5",
                "name": "half",
                "amount": 0,
                "isTriplet": false,
                "isDotted": false
            }, {
                "id": "1",
                "name": "quarter",
                "amount": 1,
                "isTriplet": false,
                "isDotted": true
            }, {
                "id": "2",
                "name": "eighth",
                "amount": 0,
                "isTriplet": false,
                "isDotted": true
            }, {
                "id": "4",
                "name": "sixteenth",
                "amount": 0,
                "isTriplet": false,
                "isDotted": false
            }]
        }],
        "instruments": [{
            "id": "g",
            "sounds": [{
                "id": "sixth-0-chord",
                "amount": 1
            }, {
                "id": "sixth-5-chord",
                "amount": 1
            }, {
                "id": "sixth-7-chord",
                "amount": 1
            }],
            "repeatHitTypeForXBeat": 8
        }, {
            "id": "lg",
            "sequences": ["CUSTOM_SEQUENCE_2"],
            "sounds": [{
                "id": "gs4",
                "amount": 3
            }, {
                "id": "b5",
                "amount": 3
            }, {
                "id": "cs5",
                "amount": 1
            }, {
                "id": "e5",
                "amount": 1
            }, {
                "id": "gs5",
                "amount": 3
            }],
            "fadeOutDuration": 0.05,
            "volume": 0.7
        }, {
            "id": "k",
            "sounds": [{
                "id": "k",
                "amount": 1
            }]
        }, {
            "id": "s",
            "sequences": ["offsetWholes", "offsetHalfs"],
            "sounds": [{
                "id": "s",
                "amount": 1
            }]
        }, {
            "id": "h",
            "sequences": ["CUSTOM_SEQUENCE_3"],
            "sounds": [{
                "id": "hc",
                "amount": 1
            }],
            "volume": 0.7
        }, {
            "id": "c",
            "sequences": ["twoBars", "CUSTOM_SEQUENCE_4"],
            "sounds": [{
                "id": "crash-left",
                "amount": 1
            }, {
                "id": "crash-right",
                "amount": 1
            }]
        }]
    }
}

export default preset
