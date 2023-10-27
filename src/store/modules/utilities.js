import { sortItems } from '@/utils/genericUtils'

const state = {
    tipoDocumento: [
        { text: 'PERSONAS', id: 1 },
        { text: 'AGENCIAS', id: 2 }
    ],
    itemListaOrigen: [
        {
            id: 1,
            descripcion: 'Ahuashiyacu'
        },
        {
            id: 2,
            descripcion: 'Lamas'
        },
        {
            id: 3,
            descripcion: 'Laguna Azul'
        },
        {
            id: 4,
            descripcion: 'Altomayo'
        },
        {
            id: 5,
            descripcion: 'Pishurayacu'
        },
        {
            id: 6,
            descripcion: 'City Tour'
        }
    ],

    niveles: [
        { id: 1, description: 'Cocoloco', rango: [80, 100] },
        { id: 2, description: 'Palmera', rango: [51, 79] },
        { id: 3, description: 'Tronco', rango: [31, 50] },
        { id: 4, description: 'Maduro', rango: [15, 30] },
        { id: 5, description: 'Plátano', rango: [0, 14] }
    ],

    _bussines: [
        {
            id: 1,
            description: 'SAMIRIA S AC'
        },
        {
            id: 2,
            description: 'CORPORACIÓN SAMIRIA SAC'
        },
        {
            id: 3,
            description: 'ZS MOTORS'
        }
    ],
    tipoMoneda: [
        {
            id: 1,
            text: 'S/.',
            value: 'Soles',
            country: 'es-PE',
            currency: 'PEN'
        },
        {
            id: 2,
            text: '$',
            value: 'Dolares',
            country: 'en-US',
            currency: 'USD'
        }
    ],
    metodoEnvio: [
        {
            id: 4,
            text: 'Domicilio'
        },
        {
            id: 3,
            text: 'Recojo en Tienda'
        }
    ],
    selectCargo: [
        { id: 2, text: 'ADMINISTRADOR' },
        { id: 3, text: 'SUPER_ADMIN' },
        { id: 1, text: 'OTRO' }
    ]
}

const mutations = {}
const actions = {}
export default {
    namespaced: true,
    state,
    mutations,
    actions
}
