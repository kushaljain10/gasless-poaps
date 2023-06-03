import cors from "cors";
import dotenv from "dotenv";
import express, { Request } from "express";
// import { mint } from "./nft";
import { spawn } from 'child_process';

dotenv.config();

const app = express();

app.get('/:script', (req: Request) => {
  const scriptName = req.params.script;
  
  // Run the script with child process
  spawn('node', [`./${scriptName}.ts`]);
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "*",
  })
);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`The server is running on port ${port}`);
});
