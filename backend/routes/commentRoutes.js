const express = require("express");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Helper function for error response
const handleError = (res, message, error, statusCode = 500) => {
  console.error(message, error);
  res.status(statusCode).json({ message, error });
};

// ✅ Add a comment to a post
router.post("/:postId", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    const { postId } = req.params;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = await Comment.create({
      text,
      author: req.user.id,
      post: postId,
    });

    // Add comment reference to post
    post.comments.push(comment._id);
    await post.save();

    res.status(201).json({ message: "Comment added successfully", comment });
  } catch (error) {
    handleError(res, "Error adding comment", error);
  }
});

// ✅ Get all comments for a post
router.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId })
      .populate("author", "username")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    handleError(res, "Error fetching comments", error);
  }
});

// ✅ Delete a comment
router.delete("/:commentId", authMiddleware, async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete this comment" });
    }

    await Comment.findByIdAndDelete(commentId);

    // Remove comment reference from the post
    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: commentId },
    });

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    handleError(res, "Error deleting comment", error);
  }
});

module.exports = router;
