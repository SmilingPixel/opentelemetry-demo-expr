// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import type { NextApiRequest, NextApiResponse } from 'next';
import InstrumentationMiddleware from '../../utils/telemetry/InstrumentationMiddleware';
import AdGateway from '../../gateways/rpc/Ad.gateway';
import { Ad, Empty } from '../../protos/demo';

type TResponse = Ad[] | Empty;

/**
 * @swagger
 * /api/data:
 *   get:
 *     summary: Retrieve a list of ads
 *     description: Fetches a list of ads based on the provided context keys.
 *     parameters:
 *       - in: query
 *         name: contextKeys
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: List of context keys describing the context.
 *     responses:
 *       200:
 *         description: A list of ads
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ad'
 *       405:
 *         description: Method not allowed
 */
const handler = async ({ method, query }: NextApiRequest, res: NextApiResponse<TResponse>) => {
  switch (method) {
    case 'GET': {
      const { contextKeys = [] } = query;
      const { ads: adList } = await AdGateway.listAds(Array.isArray(contextKeys) ? contextKeys : contextKeys.split(','));

      return res.status(200).json(adList);
    }

    default: {
      return res.status(405).send('');
    }
  }
};

export default InstrumentationMiddleware(handler);
