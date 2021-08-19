const users = [];

const addUser = ({id, name, room}) => {
    //trimming username and room name
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // const existingUser = users.find((user) => user.room === room && user.name === name);

    // check if username is exists in the room
    // if(existingUser){
    //     return {error: 'Username already taken'};
    // };

    if (!name || !room) return { error: 'Username and room are required.' };

    const user = { id, name, room };
    users.push(user);
    return { user }
}

const removeUser = ({ id }) => {
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

//check if user exists
const getUser = (id) => users.find((user) => user.id === id);

//check if the user is in this room
const checkUserRoom = (room) => users.filter((user) => user.room === room);

module.exports = {addUser, removeUser,getUser,checkUserRoom};