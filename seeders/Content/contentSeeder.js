// src/seeders/Content/contentSeeder.js
async function seedContent(models) {
  const { BlogPost, Guide, Video } = models;

  const blogCount = await BlogPost.count();
  const guideCount = await Guide.count();
  const videoCount = await Video.count();

  if (blogCount > 0 || guideCount > 0 || videoCount > 0) {
    console.log("Contenido ya tiene datos, se salta seeder de Content.");
    return;
  }

  // 1) Blog posts
  const blogPostsData = [
    {
      id: 1,
      title: "10 Formas de Reducir tu Huella de Carbono",
      slug: "10-formas-de-reducir-tu-huella-de-carbono",
      excerpt: "Consejos prácticos para reducir tu impacto ambiental en el día a día.",
      content: "Contenido de ejemplo del artículo...",
      published_at: "2024-01-15",
      views: 1234,
      status: "published",
    },
    {
      id: 2,
      title: "Guía Completa de Compostaje en Casa",
      slug: "guia-completa-de-compostaje-en-casa",
      excerpt: "Aprende paso a paso cómo iniciar tu propio compost en casa.",
      content: "Contenido de ejemplo del artículo...",
      published_at: "2024-01-10",
      views: 892,
      status: "published",
    },
    {
      id: 3,
      title: "El Impacto del Plástico en los Océanos",
      slug: "el-impacto-del-plastico-en-los-oceanos",
      excerpt: "Un vistazo a cómo el plástico está afectando la vida marina.",
      content: "Contenido de ejemplo del artículo...",
      published_at: "2024-01-05",
      views: 2156,
      status: "published",
    },
  ];

  await BlogPost.bulkCreate(blogPostsData, { ignoreDuplicates: true });

  // 2) Guides
  const guidesData = [
    {
      id: 1,
      title: "Guía de Reciclaje para Principiantes",
      slug: "guia-de-reciclaje-para-principiantes",
      description: "Una guía básica para empezar a reciclar en casa.",
      file_url: "https://example.com/guides/guia-de-reciclaje-para-principiantes.pdf",
      format: "PDF",
      downloads: 567,
      status: "active",
    },
    {
      id: 2,
      title: "Manual de Compostaje Urbano",
      slug: "manual-de-compostaje-urbano",
      description: "Manual práctico para compostaje en espacios reducidos.",
      file_url: "https://example.com/guides/manual-de-compostaje-urbano.pdf",
      format: "PDF",
      downloads: 423,
      status: "active",
    },
    {
      id: 3,
      title: "100 Tips para una Vida Sostenible",
      slug: "100-tips-para-una-vida-sostenible",
      description: "Consejos rápidos para incorporar hábitos sostenibles.",
      file_url: "https://example.com/guides/100-tips-para-una-vida-sostenible.pdf",
      format: "PDF",
      downloads: 891,
      status: "active",
    },
  ];

  await Guide.bulkCreate(guidesData, { ignoreDuplicates: true });

  // 3) Videos
  const videosData = [
    {
      id: 1,
      title: "Introducción al Reciclaje",
      slug: "introduccion-al-reciclaje",
      description: "Conceptos básicos para empezar a reciclar correctamente.",
      video_url: "https://example.com/videos/introduccion-al-reciclaje",
      thumbnail_url: "https://example.com/thumbnails/introduccion-al-reciclaje.jpg",
      duration: "12:34",
      views: 3456,
      status: "published",
    },
    {
      id: 2,
      title: "Cómo Hacer Compost en Casa",
      slug: "como-hacer-compost-en-casa",
      description: "Tutorial paso a paso de compostaje doméstico.",
      video_url: "https://example.com/videos/como-hacer-compost-en-casa",
      thumbnail_url: "https://example.com/thumbnails/como-hacer-compost-en-casa.jpg",
      duration: "18:22",
      views: 2789,
      status: "published",
    },
    {
      id: 3,
      title: "Reducir, Reusar, Reciclar",
      slug: "reducir-reusar-reciclar",
      description: "Aplicando las 3R en tu vida diaria.",
      video_url: "https://example.com/videos/reducir-reusar-reciclar",
      thumbnail_url: "https://example.com/thumbnails/reducir-reusar-reciclar.jpg",
      duration: "15:45",
      views: 4123,
      status: "published",
    },
  ];

  await Video.bulkCreate(videosData, { ignoreDuplicates: true });

  console.log("Seeder de Content ejecutado.");
}

module.exports = { seedContent };
