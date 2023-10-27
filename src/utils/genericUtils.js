import store from '../store'
import { format, subDays, differenceInDays } from 'date-fns'

export const formatNumber = (val, idTipoMoneda) => {
    const dfidTipoMoneda = idTipoMoneda || 1
    const isFind = store.state.utilities.tipoMoneda.find((x) => x.id === dfidTipoMoneda)
    return new Intl.NumberFormat(isFind.country, {
        style: 'currency',
        currency: isFind.currency
    }).format(val)
}
export const stringToNull = (str) => {
    if (str == '' || str == null || str == undefined) {
        return null
    } else {
        return str
    }
}
export const financial = (x) => {
    const r = Number.parseFloat(x || 0).toFixed(2)
    return r.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
export const sortItems = (items, label, tipo, kind = 1) => {
    if (kind === 1) {
        if (tipo === 1) {
            // Descendente
            return items.sort((a, b) => b[label] - a[label])
        }
        return items.sort((a, b) => a[label] - b[label])
    }
    // by date
    if (tipo === 1) {
        // Descendente
        return items.sort((a, b) => (a[label] < b[label] ? -1 : a[label] > b[label] ? 1 : 0))
    }
    return items.sort((a, b) => (a[label] > b[label] ? -1 : a[label] < b[label] ? 1 : 0))
}

export const getValue = (idValue, items, label, labelReturn) => {
    let output = ''
    try {
        // console.log('idValue ', idValue, ' items ', items)
        const result = items.find((x) => x[label] == idValue)
        output = result[labelReturn]
    } catch (error) {
        // console.log('err ', error)
    }
    return output
}

export const callAsync = async (url, method, payload) => {
    try {
        const { data } = await axios({
            url,
            method,
            headers: {
                'content-type': 'application/json',
                Authorization: process.env.VUE_APP_AUTHORIZATION
            },
            data: payload
        })

        console.log('DATA---->', data)
        return data
    } catch (error) {
        console.log('err ', error)
        throw new Error('failed function')
    }
}

export const downloadFile = async (payload, name, type, isPrint = false) => {
    const timestamp = Date.now()
    const rename = `${name}_${timestamp}`
    const blobFile = new Blob([payload], { type: `application/${type}` })
    const url = window.URL.createObjectURL(blobFile)
    const link = document.createElement('a')
    link.style = 'display: none'
    document.body.appendChild(link)
    link.href = url
    link.target = '_blank'
    if (type === 'pdf' && isPrint) {
        printJS(url)
    }
    link.setAttribute('download', `${rename}.${type}`)
    link.click()
    window.URL.revokeObjectURL(url)
    link.remove()

    const base64 = await blobToBase64(blobFile)
    return {
        filename: `${rename}.${type}`,
        path: base64
    }
}
export const setParseJson = (payload) => {
    try {
        return JSON.parse(payload)
    } catch (error) {
        if (payload) {
            return payload
        }
        return []
    }
}
export const blobToBase64 = (blob) => {
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    return new Promise((resolve) => {
        reader.onloadend = () => {
            resolve(reader.result)
        }
    })
}

export const renameKeys = (arr, replaceKeys) => {
    return arr.map((item) => {
        const newItem = {}
        Object.keys(replaceKeys).forEach((key) => {
            if (replaceKeys[key]) {
                newItem[replaceKeys[key]] = item[[key]]
            }
        })
        return newItem
    })
}

export const complaintsFilterPayload = (payload) => {
    console.log('payload', payload)
    const idBussines = stringToNull(payload.idBussines)
    const idDepartamento = stringToNull(payload.idDepartamento)
    const idNumeroDocumento = stringToNull(payload.idNumeroDocumento)
    const idProduct = stringToNull(payload.idProduct)
    const idTipoReclamo = stringToNull(payload.idTipoReclamo)
    const idHojaReclamo = stringToNull(payload.idHojaReclamo)
    const idName = stringToNull(payload.idName)
    const fromDate = !stringToNull(payload.fechaFiltro) ? [null, null] : payload.fechaFiltro
    console.log('fromDate', fromDate)
    return {
        fromDate,
        idBussines,
        idDepartamento,
        idNumeroDocumento,
        idProduct,
        idTipoReclamo,
        idHojaReclamo,
        idName
    }
}
export const getFormatId = (id) => {
    const serialReclamo = 'LRV-'
    const idReclaims = String(id).padStart(6, '0')
    return serialReclamo.concat(idReclaims)
}
export const buildFilterPayload = (payload) => {
    const location = stringToNull(payload.location)
    const nivel = stringToNull(payload.nivel)
    const operador = stringToNull(payload.operador)
    const tipoDocumento = stringToNull(payload.tipoDocumento)
    const fromDate = !stringToNull(payload.fechaFiltro) ? format(new Date(), 'YYYY-MM') : payload.fechaFiltro
    let fromDateYear = fromDate.split('-')[0]
    let fromDateMonth = fromDate.split('-')[1]

    return {
        fromDateYear,
        fromDateMonth,
        tipoDocumento,
        location,
        nivel,
        operador
    }
}
