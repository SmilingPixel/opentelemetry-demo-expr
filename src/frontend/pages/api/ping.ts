import type { NextApiRequest, NextApiResponse } from 'next';
import InstrumentationMiddleware from '../../utils/telemetry/InstrumentationMiddleware';

type TResponse = string;

const handler = async ({ method, query }: NextApiRequest, res: NextApiResponse<TResponse>) => {
  switch (method) {
    case 'GET': {

        console.log('GET /api/ping, query:', query);
        // res.setHeader('X-Hello-From', 'InstrumentationMiddleware');
        return res.status(200).json('pong');
      }
    default:
      return res.status(405).end();
  }
};

export default InstrumentationMiddleware(handler);