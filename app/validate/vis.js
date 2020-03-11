const ClasDeartment = require('../global/clasdepartment');

const bardatavali = {
    type: ['1'],
    department: Object.keys(ClasDeartment)
}

const bardataClasVali = {
    type: ['2'],
    department: Object.keys(ClasDeartment),
    clas: 'string'
}

module.exports = { bardatavali, bardataClasVali };