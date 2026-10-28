const express = require("express");
const fs = require("fs/promises");
const path = require("path");

const app = express();
const PORT = 3000;

const DATA_FILE = path.join(
    __dirname,
    "data",
    "destinations.json"
);

// Middleware
app.use(express.json({ limit: "100kb" }));
app.use(express.static(path.join(__dirname, "public")));

// Read destinations from the JSON file
async function readDestinations() {
    const data = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(data);
}

// Save destinations to the JSON file
async function saveDestinations(destinations) {
    await fs.writeFile(
        DATA_FILE,
        JSON.stringify(destinations, null, 2),
        "utf8"
    );
}

// Check destination information
function validateDestination(place) {
    const validCategories = [
        "Beach",
        "Mountain",
        "Heritage",
        "Nature"
    ];

    return (
        place &&
        typeof place.name === "string" &&
        place.name.trim().length > 0 &&
        typeof place.location === "string" &&
        place.location.trim().length > 0 &&
        validCategories.includes(place.category) &&
        Number.isFinite(place.budget) &&
        place.budget >= 0 &&
        typeof place.description === "string" &&
        typeof place.image === "string"
    );
}

// HOME PAGE
app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "public", "index.html")
    );
});

// GET ALL DESTINATIONS
// Example: GET /api/destinations
app.get("/api/destinations", async (req, res) => {
    try {
        let places = await readDestinations();

        const search = String(req.query.search || "")
            .trim()
            .toLowerCase();

        const category = String(req.query.category || "")
            .trim();

        const sort = String(req.query.sort || "");

        // Search destinations
        if (search) {
            places = places.filter(place =>
                place.name.toLowerCase().includes(search) ||
                place.location.toLowerCase().includes(search) ||
                place.category.toLowerCase().includes(search) ||
                place.description.toLowerCase().includes(search)
            );
        }

        // Filter by category
        if (category && category !== "All") {
            places = places.filter(
                place => place.category === category
            );
        }

        // Sort destinations
        if (sort === "name") {
            places.sort((a, b) =>
                a.name.localeCompare(b.name)
            );
        } else if (sort === "budget") {
            places.sort((a, b) =>
                a.budget - b.budget
            );
        }

        res.json(places);
    } catch (error) {
        console.error("Error reading destinations:", error);
        res.status(500).json({
            error: "Unable to load destinations."
        });
    }
});

// GET ONE DESTINATION
// Example: GET /api/destinations/1
app.get("/api/destinations/:id", async (req, res) => {
    try {
        const places = await readDestinations();

        const place = places.find(
            item => item.id === req.params.id
        );

        if (!place) {
            return res.status(404).json({
                error: "Destination not found."
            });
        }

        res.json(place);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Unable to retrieve destination."
        });
    }
});

// ADD A DESTINATION
// Send destination information as JSON in the request body.
app.post("/api/destinations", async (req, res) => {
    try {
        const place = req.body;

        if (!validateDestination(place)) {
            return res.status(400).json({
                error: "Please provide valid destination details."
            });
        }

        const places = await readDestinations();

        const newPlace = {
            id: require("crypto").randomUUID(),
            name: place.name.trim(),
            location: place.location.trim(),
            category: place.category,
            budget: place.budget,
            description: place.description.trim(),
            image: place.image.trim()
        };

        places.push(newPlace);
        await saveDestinations(places);

        res.status(201).json({
            message: "Destination added successfully.",
            destination: newPlace
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Unable to add destination."
        });
    }
});

// DELETE A DESTINATION
// Example: DELETE /api/destinations/1
app.delete("/api/destinations/:id", async (req, res) => {
    try {
        const places = await readDestinations();

        const updatedPlaces = places.filter(
            place => place.id !== req.params.id
        );

        if (updatedPlaces.length === places.length) {
            return res.status(404).json({
                error: "Destination not found."
            });
        }

        await saveDestinations(updatedPlaces);

        res.json({
            message: "Destination deleted successfully."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Unable to delete destination."
        });
    }
});

// Handle invalid API routes
app.use("/api", (req, res) => {
    res.status(404).json({
        error: "API endpoint not found."
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Wanderly server running at http://localhost:${PORT}`);
});