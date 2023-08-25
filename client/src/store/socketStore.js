import {makeAutoObservable} from "mobx";
export default class SocketStore {

    constructor() {
        this._socket = null
        makeAutoObservable(this)

    }

    setSocket(socket) {
        this._socket = socket
    }

    get socket() {
        return this._socket

    }
}
