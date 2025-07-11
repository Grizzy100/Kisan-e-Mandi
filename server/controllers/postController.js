import Post from "../models/Post.js";

export const createPost = async (req, res) => {
  try {
    const { name, description, imageUrl } = req.body;
    const userId = req.user?.uid;

    if (!name || !description || !imageUrl || !userId) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const newPost = await Post.create({ name, description, imageUrl, userId });
    res.status(201).json({ message: "Post created successfully.", post: newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Server error while creating post." });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Server error while fetching posts." });
  }
};
