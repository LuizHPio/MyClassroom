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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsertAssignment = void 0;
const DatabaseConnection_1 = require("./DatabaseConnection");
function InsertAssignment(assignment) {
    return __awaiter(this, void 0, void 0, function* () {
        let collection = DatabaseConnection_1.DatabaseClient.collection("Default");
        switch (assignment.assingmentType) {
            case "HOMEWORK":
                collection = DatabaseConnection_1.DatabaseClient.collection("Homework");
                break;
            case "ESSAY":
                collection = DatabaseConnection_1.DatabaseClient.collection("Essay");
                break;
            default:
                return Promise.reject(new Error("Could not send assignment to database."));
        }
        try {
            return yield collection.insertOne(assignment);
        }
        catch (err) {
            return Promise.reject(new Error(err));
        }
    });
}
exports.InsertAssignment = InsertAssignment;
