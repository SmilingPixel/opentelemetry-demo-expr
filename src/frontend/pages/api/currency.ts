// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import type { NextApiRequest, NextApiResponse } from 'next';
import InstrumentationMiddleware from '../../utils/telemetry/InstrumentationMiddleware';
import CurrencyGateway from '../../gateways/rpc/Currency.gateway';
import { Empty } from '../../protos/demo';

type TResponse = string[] | Empty;

/**
 * @swagger
 * /api/currency:
 *   get:
 *     summary: Retrieve a list of supported currencies
 *     description: Fetches a list of supported currency codes.
 *     responses:
 *       200:
 *         description: A list of supported currency codes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       405:
 *         description: Method not allowed
 */
const handler = async ({ method }: NextApiRequest, res: NextApiResponse<TResponse>) => {
  switch (method) {
    case 'GET': {
      const { currencyCodes = [] } = await CurrencyGateway.getSupportedCurrencies();

      return res.status(200).json(currencyCodes);
    }

    default: {
      return res.status(405);
    }
  }
};

export default InstrumentationMiddleware(handler);
