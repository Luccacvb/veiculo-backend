const express = require('express')

const server = express()

const cors = require('cors')

server.use(express.json())

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

server.use(cors())

function consultarVeiculo(placa) {
    return prisma.veiculo.findUnique({
        where: {
            placa,
        }
    })
}

server.get('/veiculo', async (req, res) => {
    const veiculos = await prisma.veiculo.findMany()
    return res.json(veiculos)
})

server.get('/veiculo/:placa', async (req, res) => {
    const veiculo = await consultarVeiculo(req.params.placa)

    return veiculo
        ? res.json(veiculo)
        : res.status(500).json("veiculo não encontrado")

})

server.post('/veiculo', async (req, res) => {
    if (await consultarVeiculo(req.body.placa)) {
        res.status(500).json("veiculo ja cadastrado")
    } else {
        const veiculo = await prisma.veiculo.create({
            data: req.body
        })
        return res.json(veiculo)
    }
})

server.delete('/veiculo/:placa', async (req, res) => {

    if (await consultarVeiculo(req.params.placa)) {
        const veiculo = await prisma.veiculo.delete({
            where: {
                placa: req.params.placa
            }
        })
        return res.json(veiculo)
    } else {
        return res.status(500).json("veiculo não encontrado")
    }
})

server.put('/veiculo', async (req, res) => {
    if (await consultarVeiculo(req.body.placa)) {
        const veiculo = await prisma.veiculo.update({
            data: req.body,
            where: {
                placa: req.body.placa
            }
        })
        return res.json(veiculo)
    } else{
        return res.status(500).json("veiculo não encontrado")
    }
})

server.listen(3333, () => {
    console.log('Server up!!')
})