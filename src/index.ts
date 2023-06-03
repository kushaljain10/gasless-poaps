import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { mint } from "./nft";

dotenv.config();

type MakeTransactionInputData = {
  account: string;
};

type MakeTransactionGetResponse = {
  label: string;
  icon: string;
};

type MakeTransactionOutputData = {
  transaction: string;
  message: string;
};

type ErrorOutput = {
  error: string;
};

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "*",
  })
);

app.all(
  "/",
  async (
    req: Request,
    res: Response<
      MakeTransactionGetResponse | MakeTransactionOutputData | ErrorOutput
    >
  ) => {
    function get(res: Response<MakeTransactionGetResponse>) {
      res.status(200).json({
        label: "Zo World POAPs", 
        icon: "https://res.cloudinary.com/dnjbui12k/image/upload/v1685694169/Zo_Orange_Logo_hodhh6.png",
      });
    }

    async function post(
      req: Request,
      res: Response<MakeTransactionOutputData | ErrorOutput>
    ) {
      try {
        const { account } = req.body as MakeTransactionInputData;
        if (!account) {
          res.status(40).json({ error: "No account provided" });
          return;
        }
        console.log(account as string);

        const base64 = await mint(account);

        return res.status(200).json({
          transaction: base64,
          message: "powered by Zo World",
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "error creating transaction" });
        return;
      }
    }

    if (req.method === "GET") {
      return get(res);
    } else if (req.method === "POST") {
      return await post(req, res);
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  }
);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`The server is running on port ${port}`);
});
