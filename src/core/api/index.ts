import { Router } from 'express';
import v1Router from './v1/v1.routes.js';
import v2Router from './v2/v2.routes.js';

const apiRouter = Router();

// Mount API versions
apiRouter.use('/v1', v1Router);
apiRouter.use('/v2', v2Router);

export default apiRouter;
