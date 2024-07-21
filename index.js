import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";
const app = express();
const port = 3000;
let posts = [];

function generateUniqueId() {
  return Date.now() + Math.random().toString(36).substr(2, 9); // A simple unique ID generator
}

app.use((req, res, next) => {
  console.log(`Request Method: ${req.method}`);
  console.log(`Request URL: ${req.url}`);
  console.log(`Request Body:`, req.body);
  next();
});
app.use(bodyParser.urlencoded({ extended: true })); // Body parser should be before methodOverride
app.use(methodOverride("_method")); // Ensure methodOverride is used
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
  const query = req.query.query || ""; // Default to an empty string if no query
  if (!query) return res.render("index.ejs", { posts, query: null });

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.name.toLowerCase().includes(query.toLowerCase()) ||
      post.description.toLowerCase().includes(query.toLowerCase()) ||
      post.content.toLowerCase().includes(query.toLowerCase())
  );

  res.render("index.ejs", { posts: filteredPosts, query });
});

app.get("/post/:id", (req, res) => {
  const postId = req.params.id;
  const post = posts.find((post) => post.id === postId);
  res.render("post.ejs", { post: post });
});

app.get("/add-post", (req, res) => {
  res.render("add.ejs");
});

app.get("/edit/:id", (req, res) => {
  const postId = req.params.id;
  const post = posts.find((post) => post.id === postId);
  res.render("edit.ejs", { post: post });
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

app.patch("/edit/:id", (req, res) => {
  console.log("PATCH route hit");
  console.log("Request Body:", req.body);
  console.log("Content:", req.body.content);
  const postid = req.params.id;
  const updates = req.body;
  posts = posts.map((post) =>
    post.id === postid ? { ...post, ...updates } : post
  );
  res.redirect("/");
});

app.delete("/post/:id", (req, res) => {
  const postId = req.params.id;
  console.log(`Received DELETE request for post ID: ${postId}`); // Logging

  const initialLength = posts.length;
  posts = posts.filter((post) => post.id !== postId);

  if (posts.length < initialLength) {
    console.log(`Post ID: ${postId} deleted successfully.`); // Logging
    res.status(200).send({ message: "Post deleted successfully" });
  } else {
    console.log(`Post ID: ${postId} not found.`); // Logging
    res.status(404).send({ message: "Post not found" });
  }
});

app.listen(port, () => {
  console.log("listening on port " + port);
});
