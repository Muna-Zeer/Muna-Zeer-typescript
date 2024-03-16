"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuccessUserReq = exports.BadServerReq = exports.BadClientReq = void 0;
const BadClientReq = (res, message) => {
    return res.status(400).json({ message });
};
exports.BadClientReq = BadClientReq;
const BadServerReq = (res, error) => {
    console.log(error);
    return res.status(500).json({ message: "Internal Server error" });
};
exports.BadServerReq = BadServerReq;
const SuccessUserReq = (res, message) => {
    return res.status(200).json({ message });
};
exports.SuccessUserReq = SuccessUserReq;
