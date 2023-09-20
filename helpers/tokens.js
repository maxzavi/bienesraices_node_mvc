const generateId = () => Math.random().toString(32)+ Date.now().toString(32);

export {
    generateId
}