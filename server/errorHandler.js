function withSocketErrorHandler(handler) {
    return (...args) => {
        try {
            handler(...args);
        } catch (err) {
            const socket = args[0]; // ти можеш явно передавати socket в handler, якщо треба
            console.error("Socket error:", err);
            if (socket?.emit) {
                socket.emit('error_occurred', { message: err.message || 'Unknown error' });
            }
        }
    };
}
module.exports = { withSocketErrorHandler };
