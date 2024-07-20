import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
let posts = [];

function generateUniqueId() {
  return Date.now() + Math.random().toString(36).substr(2, 9); // A simple unique ID generator
}
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.render("index.ejs", { posts });
});
app.get("/home", (req, res) => {
  // Extract query parameters
  const { title, name, content, description, id } = req.query;

  // Create an object to hold data if it exists
  const viewData = {};

  // Add data to viewData object only if it exists
  if (id) viewData.id = id;
  if (title) viewData.title = title;
  if (name) viewData.name = name;
  if (description) viewData.description = description;
  if (content) viewData.content = content;

  if (Object.keys(viewData).length > 0) {
    posts.push(viewData);
  }

  res.render("index.ejs", { posts });
});

app.get("/search", (req, res) => {
  const query = req.query.query;
  console.log(query);
  res.render("index.ejs", { query: query });
});

app.get("/post/:id", (req, res) => {
  const postId = req.params.id;
  const post = posts.find((post) => post.id === postId);
  res.render("post.ejs", { post: post });
});

app.get("/add-post", (req, res) => {
  res.render("add.ejs");
});
app.post("/add-post", (req, res) => {
  // Encode the data
  const encodedID = generateUniqueId();
  const encodedTitle = encodeURIComponent(req.body.title);
  const encodedDescription = encodeURIComponent(req.body.description);
  const encodedName = encodeURIComponent(req.body.name);
  const encodedContent = encodeURIComponent(req.body.content);

  // Use the encoded data in a URL and redirect
  const url = `/home?title=${encodedTitle}&name=${encodedName}&content=${encodedContent}&description=${encodedDescription}&id=${encodedID}`;
  res.redirect(url);
});
app.listen(port, () => {
  console.log("listening on port " + port);
});
