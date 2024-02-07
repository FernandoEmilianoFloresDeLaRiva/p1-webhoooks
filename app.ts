import express, { Request, Response } from "express";
import cors from "cors";
import { URL_WEBHOOK_DISCORD } from "./src/constants/url_webhook_discord";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  try {
    res.status(200).json({ success: true });
  } catch (err: any) {
    res.status(500).send(err.message);
  }
});

//recibiendo datos de un webhook
app.post("/github-event", (req: Request, res: Response) => {
  try {
    const { action, sender, repository } = req.body;
    const event = req.header("x-github-event");
    let message = "";
    switch (event) {
      case "star":
        console.log(
          `${sender.login} ${action} star on ${repository.full_name}`
        );
        message = `${sender.login} ${action} star on ${repository.full_name}`;
        break;
      case "issues":
        const { issue } = req.body;
        console.log(
          `${sender.login} ${action} issue ${issue.title} on ${repository.full_name}`
        );
        message = `${sender.login} ${action} issue ${issue.title} on ${repository.full_name}`;
        break;
      case "push":
        console.log(`${sender.login} pushes on ${repository.full_name}`);
        message = `${sender.login} pushes on ${repository.full_name}`;
        break;
      default:
        console.log(`evento desconocido: ${event}`);
        message = `evento desconocido: ${event}`;
        break;
    }
    fetchNotifyDiscord(message);
    res.status(200).json({
      success: true,
    });
  } catch (err: any) {
    res.status(500).send(err.message);
  }
});

//mandando datos a un webhook
const fetchNotifyDiscord = async (reqUser: string) => {
  try {
    const body = {
      content: reqUser,
    };
    const bodyReq = {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    };
    const response = await fetch(URL_WEBHOOK_DISCORD, bodyReq);
    if (!response?.ok) throw new Error("Error enviando datos a discord");
  } catch (err: any) {
    throw new Error(err.message);
  }
};

app.listen(3000, () => {
  console.log("Listening on port " + 3000);
});
