import {Request, Response} from 'express';

//importa conexão com o banco de dados
import knex from '../database/connection';

class PointsController {
    
    async index(request: Request, response: Response) {
        const { city, uf, items } = request.query;

        const parsedItems = String(items)
            .split(",")
            .map((item) => 
                Number(item.trim())
            );

        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');

        return response.json(points);
    };

    async show(request: Request, response: Response) {
        const { id } = request.params;

        const point = await knex('points').where('id', id).first();
        
        if (!point) {
            return response.status(400).json({message: 'Point not found'});
        }
        /*
        * SELECT items.title FROM items
        * JOIN point_items 
        * ON items.id = point_items.item_id
        * WHERE point_items.point_id = ${id}
        */
        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title');

        return response.json({point, items});
    };


    async create(request: Request, response: Response) {
    
        // const name = request.body.name;
        // const email = request.body.email;
        // DESESTRUTURAÇÃO: eu listo em um objeto todos os campos a serem retornados da minha variável alvo
        const {
            name,
            email,
            whatsapp,
            lat,
            long,
            city,
            uf,
            items
        } = request.body;
    
        //transaction do knex
        //cria uma 'dependência' entra as ações
        //uma inserção não será realizada se a outra falhar
        const trx = await knex.transaction();
    
        //insere na tabela 'points' o novo ponto de coleta
        const point = {
            image: 'https://images.unsplash.com/photo-1591457333270-8d18091674e5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=60',
            name,
            email,
            whatsapp,
            lat,
            long,
            city,
            uf
        }
        const insertedIds = await trx('points').insert(point);
    
        //insere na tabela 'point_items' a relação entre os itens e os pontos de coleta
        const point_id = insertedIds[0];
        const pointItems = items.map((item_id: number) => {
            return {
                item_id,
                point_id,
            }
        })
    
        try {
            await trx('point_items').insert(pointItems)
            await trx.commit();
        } catch (error) {
            await trx.rollback();
            return response.status(400).json({ message: 'Falha na inserção na tabela point_items, verifique se os items informados são válidos' })
        }
    
        return response.json({ id: point_id, ...point, })
    };
}

export default PointsController;