import { config } from "dotenv";
config();
import App from "./createApp.js";

const app = App();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
