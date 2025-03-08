const express = require("express");
const Post = require("../models/Post");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Multer Storage for Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Cloudinary upload stream
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "blog_posts" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

// ✅ Get all posts with comments
router.get("/", authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username")
      .populate({
        path: "comments",
        populate: { path: "author", select: "username" },
      })
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Get user's posts ("/mypost")
router.get("/mypost", authMiddleware, async (req, res) => {
  try {
    const userPosts = await Post.find({ author: req.user.id })
      .populate("author", "username")
      .sort({ createdAt: -1 });

    res.status(200).json(userPosts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user's posts", error });
  }
});

// ✅ Create a post
router.post(
  "/create",
  upload.single("image"),
  async (req, res) => {
    try {
      const { title } = req.body;
      let imageUrl = null;

      if (req.file) {
        const result = await uploadToCloudinary(req.file.buffer);
        imageUrl = result.secure_url;
      }

      const post = await Post.create({
        title,
        image: imageUrl,
        author: req.user.id,
      });

      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ message: "Error creating post", error });
    }
  }
);

// ✅ Update a post (Only user's post)
router.put("/:id", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to edit this post" });
    }

    post.title = req.body.title || post.title;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      post.image = result.secure_url;
    }

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Error updating post", error });
  }
});

// ✅ Delete a post
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this post" });
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error });
  }
});

// ✅ Like a post
router.put("/like/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.likes.includes(req.user.id)) {
      return res.status(400).json({ message: "You already liked this post" });
    }

    post.likes.push(req.user.id);
    await post.save();

    res
      .status(200)
      .json({ message: "Post liked successfully", likes: post.likes.length });
  } catch (error) {
    res.status(500).json({ message: "Error liking post", error });
  }
});

// ✅ Unlike a post
router.put("/unlike/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.likes = post.likes.filter(
      (userId) => userId.toString() !== req.user.id
    );
    await post.save();

    res
      .status(200)
      .json({ message: "Post unliked successfully", likes: post.likes.length });
  } catch (error) {
    res.status(500).json({ message: "Error unliking post", error });
  }
});

module.exports = router;
