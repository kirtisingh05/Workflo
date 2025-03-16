import express from "express";
import "dotenv/config";

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", (req, res) => {
	res.status(200).json({ result: "Server is working!" });
});


app.listen(port, () => {
	console.log(` Listening on port ${port}... `);
});