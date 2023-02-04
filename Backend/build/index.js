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
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const helmet_1 = __importDefault(require("helmet"));
const Operations_1 = require("./MongoDB/Operations");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.post("/assignments", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let body = req.body;
    let epoch = Number(body.deadline);
    let date = new Date(epoch);
    body.deadline = date;
    if (body.assingmentType == "HOMEWORK") {
        let requestedHomework = body;
        yield (0, Operations_1.InsertAssignment)(requestedHomework)
            .then(() => {
            res.sendStatus(200);
        })
            .catch((err) => {
            res.send(err);
        });
    }
    else if (body.assingmentType == "ESSAY") {
        let requestedHomework = body;
        yield (0, Operations_1.InsertAssignment)(requestedHomework)
            .then(() => {
            res.sendStatus(200);
        })
            .catch((err) => {
            res.send(err);
        });
    }
    else {
        res.status(400).send("Non existent assignment type");
    }
}));
app.listen(3000, () => {
    console.log("listening on port 3000");
});
