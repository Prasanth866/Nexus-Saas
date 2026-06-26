import app from "./app.js";
import { logDevToken } from './utils/dev-token.js';

const PORT = process.env.PORT || 5001;

app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);

    await logDevToken();
});