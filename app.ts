import express, { Request, Response } from "express";
import cors from "cors";

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

app.post("/github-event", (req: Request, res: Response) => {
  try {
    const { action, sender, repository } = req.body;
    const event = req.header("x-github-event");
    switch (event) {
      case "star":
        console.log(
          `${sender.login} ${action} star on ${repository.full_name}`
        );
        break;
      case "issues":
        const { issue } = req.body;
        console.log(
          `${sender.login} ${action} issue ${issue.title} on ${repository.full_name}`
        );
        break;
      case "push":
        console.log(`${sender.login} pushes on ${repository.full_name}`);
        break;
      default:
        console.log(`evento desconocido: ${event}`);
        break;
    }
    res.status(200).json({
      success: true,
    });
  } catch (err: any) {
    res.status(500).send(err.message);
  }
});

app.listen(3000, () => {
  console.log("Listening on port " + 3000);
});
