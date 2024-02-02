import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
const PORT = "3000";

app.get("/", (req : Request, res : Response) => {
  try{
    res.status(200).json("hola :)")
  }catch(err : any){
    res.status(500).send(err.message)
  }
})

app.listen(PORT, () => {console.log("Listening on port "+PORT)})