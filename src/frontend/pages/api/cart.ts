// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import type { NextApiHandler } from 'next';
import CartGateway from '../../gateways/rpc/Cart.gateway';
import { AddItemRequest, Empty } from '../../protos/demo';
import ProductCatalogService from '../../services/ProductCatalog.service';
import { IProductCart, IProductCartItem } from '../../types/Cart';
import InstrumentationMiddleware from '../../utils/telemetry/InstrumentationMiddleware';

type TResponse = IProductCart | Empty;

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Retrieve the cart
 *     description: Fetches the cart details for a given session.
 *     parameters:
 *       - in: query
 *         name: sessionId
 *         schema:
 *           type: string
 *         description: The session ID for the cart.
 *       - in: query
 *         name: currencyCode
 *         schema:
 *           type: string
 *         description: The currency code for the cart items.
 *     responses:
 *       200:
 *         description: The cart details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       405:
 *         description: Method not allowed
 *   post:
 *     summary: Add an item to the cart
 *     description: Adds an item to the cart.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddItemRequest'
 *     responses:
 *       200:
 *         description: The updated cart details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       405:
 *         description: Method not allowed
 */
const handler: NextApiHandler<TResponse> = async ({ method, body, query }, res) => {
  switch (method) {
    case 'GET': {
      const { sessionId = '', currencyCode = '' } = query;
      const { userId, items } = await CartGateway.getCart(sessionId as string);

      const productList: IProductCartItem[] = await Promise.all(
        items.map(async ({ productId, quantity }) => {
          const product = await ProductCatalogService.getProduct(productId, currencyCode as string);

          return {
            productId,
            quantity,
            product,
          };
        })
      );

      return res.status(200).json({ userId, items: productList });
    }

    case 'POST': {
      const { userId, item } = body as AddItemRequest;

      await CartGateway.addItem(userId, item!);
      const cart = await CartGateway.getCart(userId);

      return res.status(200).json(cart);
    }

    case 'DELETE': {
      const { userId } = body as AddItemRequest;
      await CartGateway.emptyCart(userId);

      return res.status(204).send('');
    }

    default: {
      return res.status(405);
    }
  }
};

export default InstrumentationMiddleware(handler);
