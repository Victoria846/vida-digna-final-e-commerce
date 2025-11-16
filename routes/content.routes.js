// src/routes/content.routes.js
const express = require("express");
const router = express.Router();

const contentController = require("../controllers/contentController");
const { authMiddleware, adminMiddleware } = require("../middlewares/auth");

/* ==========
 * PUBLIC - BLOG
 * ========== */

router.get("/blog", contentController.listBlogPosts);
router.get("/blog/:slug", contentController.getBlogPostBySlug);

/* ==========
 * PUBLIC - GUIDES
 * ========== */

router.get("/guides", contentController.listGuides);
router.get("/guides/:slug", contentController.getGuideBySlug);

/* ==========
 * PUBLIC - VIDEOS
 * ========== */

router.get("/videos", contentController.listVideos);
router.get("/videos/:slug", contentController.getVideoBySlug);

/* ==========
 * ADMIN - BLOG
 * ========== */

router.post("/admin/blog", authMiddleware, adminMiddleware, contentController.createBlogPost);
router.put("/admin/blog/:id", authMiddleware, adminMiddleware, contentController.updateBlogPost);
router.delete("/admin/blog/:id", authMiddleware, adminMiddleware, contentController.deleteBlogPost);

/* ==========
 * ADMIN - GUIDES
 * ========== */

router.post("/admin/guides", authMiddleware, adminMiddleware, contentController.createGuide);
router.put("/admin/guides/:id", authMiddleware, adminMiddleware, contentController.updateGuide);
router.delete("/admin/guides/:id", authMiddleware, adminMiddleware, contentController.deleteGuide);

/* ==========
 * ADMIN - VIDEOS
 * ========== */

router.post("/admin/videos", authMiddleware, adminMiddleware, contentController.createVideo);
router.put("/admin/videos/:id", authMiddleware, adminMiddleware, contentController.updateVideo);
router.delete("/admin/videos/:id", authMiddleware, adminMiddleware, contentController.deleteVideo);

module.exports = router;
