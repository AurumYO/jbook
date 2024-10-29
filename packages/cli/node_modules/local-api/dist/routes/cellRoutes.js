"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cellRoutes = void 0;
const express_1 = __importDefault(require("express"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const cellRoutes = (filename, dir) => {
    const cellRouter = express_1.default.Router();
    const fullPath = path_1.default.join(dir, filename);
    cellRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const isLocalApiError = (err) => {
            return typeof err.code === 'string';
        };
        try {
            // Read the file
            const result = yield promises_1.default.readFile(fullPath, { encoding: 'utf-8' });
            // parse a list of cells
            // send list of cells back to browser
            res.send(JSON.parse(result));
        }
        catch (error) {
            // If read throws an error
            // Inspect the error, see if it says that the file doesn't exist
            if (isLocalApiError(error)) {
                if (error.code === 'ENOENT') {
                    // create the file and add default cells
                    yield promises_1.default.writeFile(fullPath, '[]', 'utf-8');
                    res.send([]);
                }
                else {
                    throw error;
                }
            }
        }
    }));
    cellRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // Take list of cells from the request obj
        // serialize them
        const { cells } = req.body;
        // write the cells into the file
        yield promises_1.default.writeFile(fullPath, JSON.stringify(cells), 'utf-8');
        res.send({ status: 'ok' });
    }));
    return cellRouter;
};
exports.cellRoutes = cellRoutes;
