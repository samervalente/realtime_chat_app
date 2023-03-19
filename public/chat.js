const socket = io(process.env.API_URL); //i'ts like const socket = io("http://localhost:4000");

//emit => enviar alguma informação pro servidor
//on => escutar algum evento/informação

const urlSearch = new URLSearchParams(window.location.search);
const username = urlSearch.get("username");
const room = urlSearch.get("select_room");
const messageArea = document.getElementById("area-msg")
const logoutButton = document.getElementById("logout")

socket.emit("enter_room", {
    username,
    room
}, messages => {
    messages.forEach(message => createMessage(message))
}) //messages vem do retorno da nossa função de callback

const messageInput = document.getElementById("message_input")

messageInput.addEventListener("keypress", event => {
    if (event.key === 'Enter') {
        event.preventDefault()
        const message = event.target.value

        const data = { room, message, username }

        socket.emit("message", data)
        event.target.value = ""
    }
})

socket.on("message", message => {
    createMessage(message)
})


function createMessage(message) {
    const { username, content } = message
    const messageDate = dayjs(message.createdAt).format("DD/MM")
    const messageHour = dayjs(message.createdAt).format("HH:mm")
    messageArea.innerHTML += ` 
    <label class="message">
    <strong>${username}:</strong> <span>${content} -${messageDate} às ${messageHour} </span>
  </label>`
}