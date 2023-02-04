"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function CanCast(variable) {
    let object = variable;
    console.log(object, typeof object);
    return object != null ? true : false;
}
exports.default = CanCast;
