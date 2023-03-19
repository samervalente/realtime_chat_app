import { serverHttp } from "./services";
import "./websocket";

serverHttp.listen(4000, () => console.log("Server is running on port 4000"));

export default serverHttp;
