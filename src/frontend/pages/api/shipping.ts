// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import type { NextApiRequest, NextApiResponse } from 'next';
import InstrumentationMiddleware from '../../utils/telemetry/InstrumentationMiddleware';
import ShippingGateway from '../../gateways/rpc/Shipping.gateway';
import { Address, CartItem, Empty, Money } from '../../protos/demo';
import CurrencyGateway from '../../gateways/rpc/Currency.gateway';

type TResponse = Money | Empty;

/**
 * @swagger
 * /api/shipping:
 *   get:
 *     summary: Retrieve shipping cost
 *     description: Fetches the shipping cost for the given cart items and address.
 *     parameters:
 *       - in: query
 *         name: itemList
 *         schema:
 *           type: string
 *         description: JSON stringified list of cart items.
 *       - in: query
 *         name: currencyCode
 *         schema:
 *           type: string
 *         description: The currency code for the shipping cost.
 *       - in: query
 *         name: address
 *         schema:
 *           type: string
 *         description: JSON stringified address object.
 *     responses:
 *       200:
 *         description: The shipping cost
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Money'
 *       405:
 *         description: Method not allowed
 */
const handler = async ({ method, query }: NextApiRequest, res: NextApiResponse<TResponse>) => {
  switch (method) {
    case 'GET': {
      const { itemList = '', currencyCode = 'USD', address = '' } = query;
      const { costUsd } = await ShippingGateway.getShippingCost(JSON.parse(itemList as string) as CartItem[],
          JSON.parse(address as string) as Address);
      const cost = await CurrencyGateway.convert(costUsd!, currencyCode as string);

      return res.status(200).json(cost!);
    }

    default: {
      return res.status(405);
    }
  }
};

export default InstrumentationMiddleware(handler);
