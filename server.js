const express = require("express");
const pool = require("./db/database");

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());


// ========================================
// GET ALL LAPTOPS
// ========================================

app.get("/laptops", async (req, res) => {

    try {

        const result = await pool.query(
            "SELECT * FROM laptops ORDER BY id"
        );

        res.status(200).json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Error fetching laptops"
        });
    }
});


// ========================================
// GET LAPTOP BY ID
// ========================================

app.get("/laptops/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(
            "SELECT * FROM laptops WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Laptop not found"
            });
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Error fetching laptop"
        });
    }
});


// ========================================
// CREATE LAPTOP
// ========================================

app.post("/laptops", async (req, res) => {

    try {

        const {
            model,
            price,
            manufacturing_year
        } = req.body;

        const result = await pool.query(
            `INSERT INTO laptops
            (model, price, manufacturing_year)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [model, price, manufacturing_year]
        );

        res.status(201).json({
            message: "Laptop created successfully",
            laptop: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Error creating laptop"
        });
    }
});


// ========================================
// UPDATE LAPTOP
// ========================================

app.put("/laptops/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const {
            model,
            price,
            manufacturing_year
        } = req.body;

        const result = await pool.query(
            `UPDATE laptops
             SET model = $1,
                 price = $2,
                 manufacturing_year = $3
             WHERE id = $4
             RETURNING *`,
            [
                model,
                price,
                manufacturing_year,
                id
            ]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Laptop not found"
            });
        }

        res.status(200).json({
            message: "Laptop updated successfully",
            laptop: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Error updating laptop"
        });
    }
});


// ========================================
// DELETE LAPTOP
// ========================================

app.delete("/laptops/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM laptops WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Laptop not found"
            });
        }

        res.status(200).json({
            message: "Laptop deleted successfully",
            laptop: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Error deleting laptop"
        });
    }
});


// ========================================
// START SERVER
// ========================================

app.listen(PORT, () => {

    console.log(`Server running on http://localhost:${PORT}`);

});