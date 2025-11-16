// src/controllers/contentController.js
const { Op } = require("sequelize");

function slugify(str) {
  return String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // tildes
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

const contentController = {
  /* ==============================
   * BLOG - PUBLIC
   * ============================== */

  // GET /api/content/blog?search=
  async listBlogPosts(req, res) {
    try {
      const models = req.app.get("models");
      const { BlogPost } = models;
      const { search } = req.query;

      const where = {
        status: "published",
      };

      if (search) {
        where.title = { [Op.like]: `%${search}%` };
      }

      const posts = await BlogPost.findAll({
        where,
        order: [["published_at", "DESC"]],
      });

      res.json(posts);
    } catch (error) {
      console.error("Error listBlogPosts:", error);
      res.status(500).json({ message: "Error al obtener los artículos del blog" });
    }
  },

  // GET /api/content/blog/:slug
  async getBlogPostBySlug(req, res) {
    try {
      const models = req.app.get("models");
      const { BlogPost } = models;
      const { slug } = req.params;

      const post = await BlogPost.findOne({
        where: {
          slug,
          status: "published",
        },
      });

      if (!post) {
        return res.status(404).json({ message: "Artículo no encontrado" });
      }

      // opcional: sumar una vista
      await post.update({ views: post.views + 1 });

      res.json(post);
    } catch (error) {
      console.error("Error getBlogPostBySlug:", error);
      res.status(500).json({ message: "Error al obtener el artículo" });
    }
  },

  /* ==============================
   * GUIDES - PUBLIC
   * ============================== */

  // GET /api/content/guides?search=
  async listGuides(req, res) {
    try {
      const models = req.app.get("models");
      const { Guide } = models;
      const { search } = req.query;

      const where = {
        status: "active",
      };

      if (search) {
        where.title = { [Op.like]: `%${search}%` };
      }

      const guides = await Guide.findAll({
        where,
        order: [["created_at", "DESC"]],
      });

      res.json(guides);
    } catch (error) {
      console.error("Error listGuides:", error);
      res.status(500).json({ message: "Error al obtener las guías" });
    }
  },

  // GET /api/content/guides/:slug
  async getGuideBySlug(req, res) {
    try {
      const models = req.app.get("models");
      const { Guide } = models;
      const { slug } = req.params;

      const guide = await Guide.findOne({
        where: {
          slug,
          status: "active",
        },
      });

      if (!guide) {
        return res.status(404).json({ message: "Guía no encontrada" });
      }

      // opcional: sumar una descarga cuando el front confirme download
      res.json(guide);
    } catch (error) {
      console.error("Error getGuideBySlug:", error);
      res.status(500).json({ message: "Error al obtener la guía" });
    }
  },

  /* ==============================
   * VIDEOS - PUBLIC
   * ============================== */

  // GET /api/content/videos?search=
  async listVideos(req, res) {
    try {
      const models = req.app.get("models");
      const { Video } = models;
      const { search } = req.query;

      const where = {
        status: "published",
      };

      if (search) {
        where.title = { [Op.like]: `%${search}%` };
      }

      const videos = await Video.findAll({
        where,
        order: [["created_at", "DESC"]],
      });

      res.json(videos);
    } catch (error) {
      console.error("Error listVideos:", error);
      res.status(500).json({ message: "Error al obtener los videos" });
    }
  },

  // GET /api/content/videos/:slug
  async getVideoBySlug(req, res) {
    try {
      const models = req.app.get("models");
      const { Video } = models;
      const { slug } = req.params;

      const video = await Video.findOne({
        where: {
          slug,
          status: {
            [Op.in]: ["published"], // si después usás "hidden", queda fuera
          },
        },
      });

      if (!video) {
        return res.status(404).json({ message: "Video no encontrado" });
      }

      // opcional: sumar una vista
      await video.update({ views: video.views + 1 });

      res.json(video);
    } catch (error) {
      console.error("Error getVideoBySlug:", error);
      res.status(500).json({ message: "Error al obtener el video" });
    }
  },

  /* ==============================
   * ADMIN - BLOG
   * ============================== */

  // POST /api/content/admin/blog
  async createBlogPost(req, res) {
    try {
      const models = req.app.get("models");
      const { BlogPost } = models;

      const data = { ...req.body };

      if (!data.slug && data.title) {
        data.slug = slugify(data.title);
      }

      if (!data.published_at && data.status === "published") {
        data.published_at = new Date();
      }

      const post = await BlogPost.create(data);

      res.status(201).json(post);
    } catch (error) {
      console.error("Error createBlogPost:", error);
      res.status(500).json({ message: "Error al crear artículo" });
    }
  },

  // PUT /api/content/admin/blog/:id
  async updateBlogPost(req, res) {
    try {
      const models = req.app.get("models");
      const { BlogPost } = models;
      const { id } = req.params;

      const post = await BlogPost.findByPk(id);

      if (!post) {
        return res.status(404).json({ message: "Artículo no encontrado" });
      }

      const data = { ...req.body };

      if (!data.slug && data.title) {
        data.slug = slugify(data.title);
      }

      // si pasa de draft/scheduled a published y no tiene fecha, se la setea
      if (data.status === "published" && !post.published_at && !data.published_at) {
        data.published_at = new Date();
      }

      await post.update(data);

      res.json(post);
    } catch (error) {
      console.error("Error updateBlogPost:", error);
      res.status(500).json({ message: "Error al actualizar artículo" });
    }
  },

  // DELETE /api/content/admin/blog/:id
  async deleteBlogPost(req, res) {
    try {
      const models = req.app.get("models");
      const { BlogPost } = models;
      const { id } = req.params;

      const post = await BlogPost.findByPk(id);

      if (!post) {
        return res.status(404).json({ message: "Artículo no encontrado" });
      }

      // soft delete: marcar como "archived"
      await post.update({ status: "archived" });

      res.json({ message: "Artículo archivado correctamente" });
    } catch (error) {
      console.error("Error deleteBlogPost:", error);
      res.status(500).json({ message: "Error al eliminar artículo" });
    }
  },

  /* ==============================
   * ADMIN - GUIDES
   * ============================== */

  // POST /api/content/admin/guides
  async createGuide(req, res) {
    try {
      const models = req.app.get("models");
      const { Guide } = models;

      const data = { ...req.body };

      if (!data.slug && data.title) {
        data.slug = slugify(data.title);
      }

      const guide = await Guide.create(data);

      res.status(201).json(guide);
    } catch (error) {
      console.error("Error createGuide:", error);
      res.status(500).json({ message: "Error al crear guía" });
    }
  },

  // PUT /api/content/admin/guides/:id
  async updateGuide(req, res) {
    try {
      const models = req.app.get("models");
      const { Guide } = models;
      const { id } = req.params;

      const guide = await Guide.findByPk(id);

      if (!guide) {
        return res.status(404).json({ message: "Guía no encontrada" });
      }

      const data = { ...req.body };

      if (!data.slug && data.title) {
        data.slug = slugify(data.title);
      }

      await guide.update(data);

      res.json(guide);
    } catch (error) {
      console.error("Error updateGuide:", error);
      res.status(500).json({ message: "Error al actualizar guía" });
    }
  },

  // DELETE /api/content/admin/guides/:id
  async deleteGuide(req, res) {
    try {
      const models = req.app.get("models");
      const { Guide } = models;
      const { id } = req.params;

      const guide = await Guide.findByPk(id);

      if (!guide) {
        return res.status(404).json({ message: "Guía no encontrada" });
      }

      // soft delete
      await guide.update({ status: "inactive" });

      res.json({ message: "Guía desactivada correctamente" });
    } catch (error) {
      console.error("Error deleteGuide:", error);
      res.status(500).json({ message: "Error al eliminar guía" });
    }
  },

  /* ==============================
   * ADMIN - VIDEOS
   * ============================== */

  // POST /api/content/admin/videos
  async createVideo(req, res) {
    try {
      const models = req.app.get("models");
      const { Video } = models;

      const data = { ...req.body };

      if (!data.slug && data.title) {
        data.slug = slugify(data.title);
      }

      const video = await Video.create(data);

      res.status(201).json(video);
    } catch (error) {
      console.error("Error createVideo:", error);
      res.status(500).json({ message: "Error al crear video" });
    }
  },

  // PUT /api/content/admin/videos/:id
  async updateVideo(req, res) {
    try {
      const models = req.app.get("models");
      const { Video } = models;
      const { id } = req.params;

      const video = await Video.findByPk(id);

      if (!video) {
        return res.status(404).json({ message: "Video no encontrado" });
      }

      const data = { ...req.body };

      if (!data.slug && data.title) {
        data.slug = slugify(data.title);
      }

      await video.update(data);

      res.json(video);
    } catch (error) {
      console.error("Error updateVideo:", error);
      res.status(500).json({ message: "Error al actualizar video" });
    }
  },

  // DELETE /api/content/admin/videos/:id
  async deleteVideo(req, res) {
    try {
      const models = req.app.get("models");
      const { Video } = models;
      const { id } = req.params;

      const video = await Video.findByPk(id);

      if (!video) {
        return res.status(404).json({ message: "Video no encontrado" });
      }

      await video.update({ status: "hidden" });

      res.json({ message: "Video ocultado correctamente" });
    } catch (error) {
      console.error("Error deleteVideo:", error);
      res.status(500).json({ message: "Error al eliminar video" });
    }
  },
};

module.exports = contentController;
