import 'dotenv/config';
import { app } from './app.js';
import { startAutoShutoffJob } from './services/ruleService.js';

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET não definido');
  process.exit(1);
}

const port = process.env.PORT ?? 3001;
app.listen(port, () => console.log(`Automate API em http://localhost:${port}`));
startAutoShutoffJob();
