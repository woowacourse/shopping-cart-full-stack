import Product from "../models/Product.js";
import { Request, Response, NextFunction } from "express";
import type { DBInterface } from "../db/db.js";
import { ProductValidationError } from "../errors/productError.js";

export default class ProductController {
  #db;
  #index;

  constructor(db: DBInterface) {
    this.#db = db;
    this.#index = 0;
  }

  getProductAll = (req: Request, res: Response) => {
    try {
      const products = Array.from(this.#db.PRODUCT_TABLE.entries()).map(
        ([id, productData]) => {
          const product = new Product(productData);
          const { name, imgUrl, price } = product.getProduct();
          return {
            id,
            name,
            imgUrl,
            price,
          };
        },
      );

      const sorted = products.sort((a, b) => {
        return a.id - b.id;
      });
      res.status(200).json({
        result: "success",
        data: {
          products: sorted,
        },
      });
    } catch (error) {
      res.status(500).json();
    }
  };

  getProduct = (req: Request, res: Response) => {
    try {
      const { productId } = req.params;
      const numberId = Number(productId);
      if (Number.isNaN(numberId)) {
        return res.status(400).json({
          result: "error",
          message: "해당하는 상품의 id 형식이 유효하지 않습니다.",
        });
      }
      if (this.#db.PRODUCT_TABLE.has(numberId) === false) {
        return res.status(404).json({
          result: "error",
          message: "해당하는 상품이 없습니다.",
        });
      }

      const result = this.#db.PRODUCT_TABLE.get(numberId);
      res.status(200).json({
        result: "success",
        data: {
          id: numberId,
          ...result,
        },
      });
    } catch (error) {
      res.status(500).json({
        result: "error",
        message: "서버 내부 오류가 발생했습니다.",
      });
    }
  };
  // POST 상품 추가
  addProduct = (req: Request, res: Response) => {
    try {
      const { name, price, imgUrl } = req.body;
      // 여기서 형식 검사 하고
      if (name === undefined || price === undefined) {
        return res.status(400).json({ message: "형식이 비었습니다" });
      }
      // 밑에서 도메인 검사
      const product = new Product({ name, price, imgUrl });
      this.#db.PRODUCT_TABLE.set(this.#index, product.getProduct());

      res.status(201).json();
    } catch (error) {
      if (error instanceof ProductValidationError) {
        return res.status(error.status).json({
          result: "error",
          message: error.message,
          errors: error.errors,
        });
      }
      res.status(500).json();
    }
  };

  removeProduct = (req: Request, res: Response) => {
    try {
      const { productId } = req.params;
      const numberId = Number(productId);

      if (Number.isNaN(numberId)) {
        return res.status(204).json();
      }

      this.#db.PRODUCT_TABLE.delete(numberId);
      res.status(204).json();
    } catch (error) {
      res.status(500).json();
    }
  };
}
