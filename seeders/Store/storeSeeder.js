// src/seeders/Store/storeSeeder.js
async function seedStore(models) {
  const { ProductCategory, Product, Order, OrderItem, User } = models;

  const productCount = await Product.count();
  if (productCount > 0) {
    console.log("Productos ya tienen datos, se salta seeder de Store.");
    return;
  }

  // 1) Categorías desde los mocks
  const categoriesData = [
    { id: 1, name: "Accesorios", slug: "accesorios" },
    { id: 2, name: "Jardinería", slug: "jardineria" },
    { id: 3, name: "Cocina", slug: "cocina" },
    { id: 4, name: "Oficina", slug: "oficina" },
  ];

  await ProductCategory.bulkCreate(categoriesData, { ignoreDuplicates: true });

  // 2) Productos (adaptando tus mockProducts)
  const productsData = [
    {
      id: 1,
      name: "Bolsa Reutilizable Eco",
      price: 20.0,
      stock: 150,
      status: "active",
      image_url: null, // después podés cambiar a una URL real
      category_id: 1,
    },
    {
      id: 2,
      name: "Kit de Compostaje",
      price: 40.0,
      stock: 75,
      status: "active",
      image_url: null,
      category_id: 2,
    },
    {
      id: 3,
      name: "Botellas de Vidrio Set",
      price: 25.0,
      stock: 200,
      status: "active",
      image_url: null,
      category_id: 3,
    },
    {
      id: 4,
      name: "Papel Reciclado Pack",
      price: 15.0,
      stock: 0,
      status: "out_of_stock",
      image_url: null,
      category_id: 4,
    },
  ];

  await Product.bulkCreate(productsData, { ignoreDuplicates: true });

  // 3) Order + OrderItems de ejemplo (si existe al menos un user)
  const user = await User.findByPk(1);
  if (user && Order && OrderItem) {
    const order = await Order.create({
      user_id: user.id,
      status: "paid",
      total_amount: 60.0,
      currency: "USD",
      notes: "Orden de ejemplo creada por seeder",
    });

    await OrderItem.bulkCreate(
      [
        {
          order_id: order.id,
          product_id: 1,
          quantity: 2,
          unit_price: 20.0,
          subtotal: 40.0,
        },
        {
          order_id: order.id,
          product_id: 2,
          quantity: 1,
          unit_price: 20.0,
          subtotal: 20.0,
        },
      ],
      { ignoreDuplicates: true },
    );
  }

  console.log("Seeder de Store ejecutado.");
}

module.exports = { seedStore };
