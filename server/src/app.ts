import express from 'express';

const app = express();
app.use(express.json());

let products: Array<Product> = [
  {
    id: '1',
    name: 'EASTER',
    price: 100000000000,
    imageUrl: '/testURL1',
  },
  {
    id: '2',
    name: 'PARADI',
    price: 1,
    imageUrl: '/testURL2',
  },
  {
    id: '3',
    name: 'BIBIBING',
    price: 2000,
    imageUrl: '/testURL3',
  },
];

let carts: Array<CartItem> = [
  {
    id: '1',
    productInfo: products[0],
    quantity: 1,
  },
  {
    id: '2',
    productInfo: products[1],
    quantity: 2,
  },
];

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

interface CartItem {
  id: string;
  productInfo: Product;
  quantity: number;
}

interface GetProductRes {
  body: Array<Product>;
}

interface PostProductRes {
  body: {id: string};
}

interface GetCartRes {
  body: Array<CartItem>;
}

interface PatchCartRes {
  body: {
    id: string;
    quantity: number;
  };
}

const updateCartQuantity = (targetId: string, quantity: number) => {
  const targetCart = carts.find((cart) => cart.id === targetId);

  if (!targetCart) {
    return null;
  }

  targetCart.quantity = quantity;

  return targetCart;
};

app.get('/products', (req, res) => {
  let resData: GetProductRes = {
    body: [],
  };

  try {
    resData.body.push(...products);
  } catch (error) {
    return res.status(500).send();
  }

  res.status(200).json(resData);
});

app.post('/products', (req, res) => {
  const {name, price, imageUrl} = req.body;

  let resData: PostProductRes = {
    body: {
      id: '',
    },
  };

  const newId = Number(products[products.length - 1].id) + 1;

  const isDuplicated = products.find((product) => product.name === name);
  if (isDuplicated) {
    return res.status(409).send();
  }

  try {
    products.push({
      id: `${newId}`,
      name: name,
      price: price,
      imageUrl: imageUrl,
    });

    resData.body.id = `${newId}`;
  } catch (error) {
    return res.status(500).send();
  }

  //201: Created
  res.status(201).json(resData);
});

app.delete('/products/:id', (req, res) => {
  const reqId = req.params.id;

  const isExistId = products.some((product) => product.id === reqId);
  if (!isExistId) {
    return res.status(404).send();
  }

  try {
    //삭제
    products = products.filter((product) => product.id !== reqId);
  } catch (error) {
    return res.status(500).send();
  }

  res.sendStatus(204);
});

app.get('/carts', (req, res) => {
  let resData: GetCartRes = {
    body: [],
  };

  try {
    resData.body.push(...carts);
  } catch (error) {
    return res.status(500).send();
  }

  res.status(200).json(resData);
});

app.patch('/carts/:id', (req, res) => {
  const targetId = req.params.id;
  const {quantity} = req.body;

  let resData: PatchCartRes = {
    body: {
      id: targetId,
      quantity: 0,
    },
  };

  try {
    const updatedCart = updateCartQuantity(targetId, quantity);

    if (!updatedCart) {
      return res.status(404).send();
    }

    resData.body.quantity = updatedCart.quantity;
  } catch (error) {
    return res.status(500).send();
  }

  res.status(200).json(resData);
});

app.delete('/carts/:id', (req, res) => {
  const reqId = req.params.id;

  const isExistId = carts.some((cart) => cart.id === reqId);
  if (!isExistId) {
    return res.status(404).send();
  }

  try {
    //삭제
    carts = carts.filter((cart) => cart.id !== reqId);
  } catch (error) {
    return res.status(500).send();
  }

  res.sendStatus(204);
});

export default app;
