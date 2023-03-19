import { io } from "./services";

//um socket é a representação do nosso client no servidor
//cada vez que um cliente conecta na nossa aplicação, é gerado um socket pra ele
//ex: socket.id nos retorna o id da conexão

interface UserRoom {
  socket_id: string;
  username: string;
  room: string;
}

interface Message {
  content: string;
  username: string;
  room: string;
  createdAt: Date;
}

const users: UserRoom[] = [];
const messages: Message[] = [];

io.on("connection", (socket) => {
  socket.on("enter_room", (data, callback) => {
    socket.join(data.room); //colocando o meu usuário na sala selecionada

    const userInRoom = users.find(
      (user) => user.username === data.username && user.room === data.room
    );
    if (userInRoom) {
      userInRoom.socket_id = socket.id;
    } else {
      users.push({ ...data, socket_id: socket.id });
    }

    const messagesRoom = getRoomMessages(data.room);
    callback(messagesRoom) //esse callback é uma função de retorno
    console.log(users);
  });

  socket.on("message", (data) => {
    const { message, room, username } = data;
    const newMessage: Message = {
      room,
      username,
      content: message,
      createdAt: new Date(),
    };

    messages.push(newMessage);

    io.to(data.room).emit("message", newMessage); //socket envia somente para um usuário específico, já o io envia para todos os usuários da sala
  });
});

function getRoomMessages(room: string) {
  const roomMessages = messages.filter((message) => message.room === room);
  return roomMessages;
}
