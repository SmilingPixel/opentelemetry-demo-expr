// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import type { NextApiRequest, NextApiResponse } from 'next';
import InstrumentationMiddleware from '../../utils/telemetry/InstrumentationMiddleware';
import RecommendationsGateway from '../../gateways/rpc/Recommendations.gateway';
import { Empty, Product } from '../../protos/demo';
import ProductCatalogService from '../../services/ProductCatalog.service';

type TResponse = Product[] | Empty;

/**
 * @swagger
 * /api/recommendations:
 *   get:
 *     summary: Retrieve product recommendations
 *     description: Fetches a list of recommended products based on the provided product IDs and session ID.
 *     parameters:
 *       - in: query
 *         name: productIds
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: List of product IDs to base recommendations on.
 *       - in: query
 *         name: sessionId
 *         schema:
 *           type: string
 *         description: The session ID for the recommendations.
 *       - in: query
 *         name: currencyCode
 *         schema:
 *           type: string
 *         description: The currency code for the recommended products.
 *     responses:
 *       200:
 *         description: A list of recommended products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       405:
 *         description: Method not allowed
 */
const handler = async ({ method, query }: NextApiRequest, res: NextApiResponse<TResponse>) => {
  switch (method) {
    case 'GET': {
      const { productIds = [], sessionId = '', currencyCode = '' } = query;
      const { productIds: productList } = await RecommendationsGateway.listRecommendations(
        sessionId as string,
        productIds as string[]
      );
      const recommendedProductList = await Promise.all(
        productList.slice(0, 4).map(id => ProductCatalogService.getProduct(id, currencyCode as string))
      );

      return res.status(200).json(recommendedProductList);
    }

    default: {
      return res.status(405).send('');
    }
  }
};

export default InstrumentationMiddleware(handler);
