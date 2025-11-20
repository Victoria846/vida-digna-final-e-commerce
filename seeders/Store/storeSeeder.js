const BASE_URL = process.env.APP_URL || `http://localhost:${process.env.APP_PORT || 3000}`;

async function seedStore(models) {
  const { ProductCategory, Product, Order, OrderItem, User } = models;

  const productCount = await Product.count();
  if (productCount > 0) {
    console.log("Productos ya tienen datos, se salta seeder de Store.");
    return;
  }

  const categoriesData = [
    { id: 1, name: "Accesorios", slug: "accesorios" },
    { id: 2, name: "Jardinería", slug: "jardineria" },
    { id: 3, name: "Cocina", slug: "cocina" },
    { id: 4, name: "Oficina", slug: "oficina" },
  ];

  await ProductCategory.bulkCreate(categoriesData, { ignoreDuplicates: true });

  const productsData = [
    {
      id: 1,
      name: "Bolsas Reutilizables",
      price: 1500.0,
      stock: 150,
      status: "active",
      image_url: `${BASE_URL}/img/bolsasReutilizables.jpg`,
      category_id: 1,
      short_description: "Bolsas de alta calidad reutilizables.",
      description:
        "Nuestras bolsas reutilizables están fabricadas con materiales 100% reciclados y son perfectas para tus compras diarias. Resistentes, lavables y con capacidad para hasta 15kg. Contribuye al cuidado del medio ambiente mientras haces tus compras.",
      features: ["Material reciclado", "Capacidad 15kg", "Lavables", "Duraderas"],
    },
    {
      id: 2,
      name: "Cesto Cocina",
      price: 3500.0,
      stock: 80,
      status: "active",
      image_url: `${BASE_URL}/img/CestoCocina.jpg`,
      category_id: 3,
      short_description: "Tres Cestos de cocina",
      description:
        "Set de tres cestos especialmente diseñados para organizar tu cocina. Incluye cestos de diferentes tamaños para separar residuos orgánicos, reciclables y basura general. Material resistente y fácil de limpiar.",
      features: ["Set de 3 cestos", "Diferentes tamaños", "Fácil limpieza", "Material resistente"],
    },
    {
      id: 3,
      name: "Cesto Económico",
      price: 2800.0,
      stock: 120,
      status: "active",
      image_url: `${BASE_URL}/img/CestoEconomico.jpg`,
      category_id: 1,
      short_description: "Cesto Económico para interior.",
      description:
        "Cesto económico ideal para interiores, perfecto para comenzar con el reciclaje en tu hogar. Diseño compacto que se adapta a cualquier espacio. Excelente relación calidad-precio.",
      features: ["Precio accesible", "Diseño compacto", "Para interiores", "Fácil uso"],
    },
    {
      id: 4,
      name: "Combo Premium",
      price: 4500.0,
      stock: 50,
      status: "active",
      image_url: `${BASE_URL}/img/ComboComposteroCompleto.jpg`,
      category_id: 2,
      short_description: "Compostera de alta calidad.",
      description:
        "Combo completo para compostar que incluye compostera de alta calidad, filtros de carbón activado, herramientas y manual instructivo. Todo lo que necesitas para crear tu propio compost casero y reducir residuos orgánicos.",
      features: ["Kit completo", "Filtros incluidos", "Manual instructivo", "Alta capacidad"],
    },
    {
      id: 5,
      name: "Productos Reciclables",
      price: 3500.0,
      stock: 100,
      status: "active",
      image_url: `${BASE_URL}/img/KitProductosReciclables.jpg`,
      category_id: 4,
      short_description: "Tipos de productos",
      description:
        "Kit de productos reciclables que incluye contenedores separadores con etiquetas para papel, plástico, vidrio y metal. Sistema de clasificación intuitivo que facilita el reciclaje en el hogar.",
      features: ["Sistema de clasificación", "Etiquetas incluidas", "4 categorías", "Apilables"],
    },
    {
      id: 6,
      name: "Mini Compostera",
      price: 2800.0,
      stock: 60,
      status: "active",
      image_url: `${BASE_URL}/img/MiniCompostera.jpg`,
      category_id: 2,
      short_description: "Compostera de tamaño compacto",
      description:
        "Mini compostera perfecta para apartamentos o espacios pequeños. Con filtro de carbón activado que elimina olores. Capacidad de 5 litros, ideal para residuos orgánicos diarios de 1-2 personas.",
      features: ["Tamaño compacto", "Filtro anti-olores", "5 litros", "Ideal apartamentos"],
    },
  ];

  await Product.bulkCreate(productsData, { ignoreDuplicates: true });

  const user = await User.findByPk(1);
  if (user && Order && OrderItem) {
    const order = await Order.create({
      user_id: user.id,
      status: "paid",
      total_amount: 6500.0,
      currency: "UYU",
      notes: "Orden de ejemplo creada por seeder",
    });

    await OrderItem.bulkCreate(
      [
        {
          order_id: order.id,
          product_id: 1,
          quantity: 2,
          unit_price: 1500.0,
          subtotal: 3000.0,
        },
        {
          order_id: order.id,
          product_id: 2,
          quantity: 1,
          unit_price: 3500.0,
          subtotal: 3500.0,
        },
      ],
      { ignoreDuplicates: true },
    );
  }

  console.log("Seeder de Store ejecutado.");
}

module.exports = { seedStore };
