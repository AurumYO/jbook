import express from 'express';
import fs from 'fs/promises';
import path from 'path';

interface Cell {
    id: string;
    content: string;
    type: 'text' | 'code';
}

interface LocalApiError {
    code: string;
    }

export const createCellsRouter = (filename: string, dir: string) => {
    const router = express.Router();

    router.use(express.json());

    const fullPath = path.join(dir, filename);

    router.get('/cells', async (req, res) => {
        const isLocalApiError = (err: any): err is LocalApiError => {
            return typeof err.code === "string";
        };
        // Read file
        try{
            const result =  await fs.readFile(fullPath, { encoding: 'utf-8'});

            res.send(JSON.parse(result));

        } catch (err) {
            
            if (isLocalApiError(err)) {
                if (err.code === "ENOENT") {
                    // Add code to creatre a file and add default cells
                    await fs.writeFile(fullPath, "[]", "utf-8");
                    res.send([]);
                }
            } else {
                throw err;
            }
        
        }
        // Read file

        // parse a list of cells out of it

        // send list of cells back to the browser
    });

    router.post('/cells', async (req, res) => {
        // Take the list of cells from the request object 
        // serialize them
        const { cells }: { cells: Cell[] } = req.body;

        //Write the cells into the file
        await fs.writeFile(fullPath, JSON.stringify(cells), 'utf-8');

        res.send({ status: 'ok'});
    });

    return router;
};