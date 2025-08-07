import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";


// const todos = [
//     { id: 1, text: 'Buy milk', completedAt: new Date() },
//     { id: 2, text: 'Buy bread', completedAt: new Date() },
//     { id: 3, text: 'Buy butter', completedAt: new Date() },
// ];

export class TodosController {
    
    //* DI - Dependency Injection
    constructor() {}

    public getTodos = async (req: Request, res: Response) => {
        const todos = await prisma.todo.findMany();
        return res.json(todos);
    }

    public getTodoById = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if ( isNaN(id) ) return res.status(400).json({ error: 'id argument is not a number'});

        // const todo = todos.find( todo => todo.id === id );
        const todo = await prisma.todo.findUnique({
            where: {
                id: id,
            },
        });

        ( todo )
            ? res.json(todo)
            : res.status(404).json({ error: `TODO with id ${id} not found` })
    }

    public createTodo = async (req: Request, res: Response) => {
        // const { text } = req.body;
        const [error, createTodoDto] = CreateTodoDto.create(req.body);

        if ( error ) return res.status(400).json({ error });

        const todo = await prisma.todo.create({
            data: createTodoDto!
        })

        // const newTodo = {
        //     id: todos.length + 1,
        //     text: text,
        //     completedAt: new Date()
        // }

        // todos.push(newTodo);

        res.json(todo);
    }

    public updateTodo = async (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, updateTodoDto] = UpdateTodoDto.create({...req.body, id});
        
        if ( error ) return res.status(400).json({error});
        // if ( isNaN(id) ) return res.status(400).json({ error: 'id argument is not a number'});

        // const { text, completedAt } = req.body;

        // const todo = todos.find( todo => todo.id === id );
        const todo = await prisma.todo.update({
            where: {
                id: id,
            },
            data: updateTodoDto!.values,
        });

        // if ( !todo ) return res.status(400).json({ error: `todo with id ${id} not found`});
        res.json( todo );

        // todo.text = text || todo.text;
        // ( completedAt === 'null' )
        //     ? todo.completedAt = new Date()
        //     : todo.completedAt = new Date( completedAt || todo.completedAt );

        //! Ojo, referencia
        // todos.forEach( (todo, index) => {
        //     if ( todo.id === id ) {
        //         todos[index] = todo;
        //     }
        // });
    }

    public deleteTodo = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if ( isNaN(id) ) return res.status(400).json({ error: 'id argument is not a number'});

        // const todo = todos.find( todo => todo.id === id );
        const todo = await prisma.todo.findUnique({
            where: {
                id: id,
            },
        });

        if ( !todo ) return res.status(400).json({ error: `todo with id ${id} not found`});
        
        const deleted = await prisma.todo.delete({
            where: { id }
        });


        ( deleted )
            ? res.json( deleted )
            : res.status(400).json({error: `Todo with id ${id} not found`});
            
        // todos.splice( todos.indexOf(todo), 1);
        
    }
}

