import animalRoutes from "./routes/animalRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
// ...
app.use("/api/animals", animalRoutes);
app.use("/api/applications", applicationRoutes);
