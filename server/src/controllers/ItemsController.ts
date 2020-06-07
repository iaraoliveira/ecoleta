import {Request, Response} from 'express';

//importa conexão com o banco de dados
import knex from '../database/connection';

class ItemsController {
    async index(request: Request, response: Response) {
    
        //SELECT * FROM items
        const items = await knex('items').select('*');
    
        //os dados retornados não estão da forma exata que devem ser mostrados ao usuário, eles precisam ser 'serializados'
        const serializedItems = items.map(item => {
            return {
                id: item.id,
                title: item.title,
                image: `http://localhost:3333/uploads/${item.image}`,
            }
        })
    
        return response.json(serializedItems);
    }
}

export default ItemsController;