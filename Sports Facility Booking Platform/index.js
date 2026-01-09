import express from "express";
import mysql from "mysql2";
import bcrypt from "bcrypt";
import cors from "cors";

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(express.json());

//connect with mysql
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Hiimavery',
    database: 'ace_sports_hub',
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to MySQL database");
});

app.get("/contact", (req, res) => {
    res.send("GET /contact is reachable — but POST is what your form needs.");
});

app.get("/", (req, res) => {
    res.json("Hello this is the backend!");
});

//login
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Server error" });
        }

        if (result.length === 0) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const user = result[0];

        const passwordMatch = password === user.password;
        if (!passwordMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Successful login
        res.status(200).json({ message: "Login successful", user: { id: user.id, email: user.email } });
    });
});

//register
app.post("/register", async (req, res) => {
    const {fname,lname,DOB,email,phone,password,street,city,province,zip,country
    } = req.body;

    // Check if email existed in the database table users or not
    const checkUserSql = "SELECT * FROM users WHERE email = ?";
    db.query(checkUserSql, [email], async (err, result) => {
        if (err) {
            console.error("Error checking user:", err);
            return res.status(500).json({ message: "Server error" });
        }

        if (result.length > 0) {
            return res.status(400).json({ message: "Email already registered" });
        }

        //Hash password (for secuity)
        const hashedPassword = await bcrypt.hash(password, 10);

        const insertSql = `INSERT INTO users 
            (fname, lname, dob, email, phone, password, street, city, province, zip, country)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [fname,lname,DOB,email,phone,hashedPassword,street,city,province,zip,country];

        db.query(insertSql, values, (err, result) => {
            if (err) {
                console.error("Error inserting user:", err);
                return res.status(500).json({ message: "Database error" });
            }

            res.status(200).json({ message: "Registration successful" });
        });
    });
});

//New_booking
app.post("/book", (req, res) => {
    const { user_email, facility_type, booking_date, booking_time, duration, remark } = req.body;

    if (!user_email || !facility_type || !booking_date || !booking_time || !duration) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const sql = `INSERT INTO bookings (user_email, facility_type, booking_date, booking_time, duration, remark)
        VALUES (?, ?, ?, ?, ?, ?)`;

    const values = [user_email, facility_type, booking_date, booking_time, duration, remark || null];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error saving booking:", err);
            return res.status(500).json({ message: "Database error" });
        }

        res.status(200).json({ message: "Booking successful!" });
    });
});

//View Booking
app.get('/bookings', (req, res) => {
    const email = req.query.email;
    console.log("Received email query:", email);

    if (!email) {
        return res.status(400).json({ error: "Missing email parameter" });
    }

    const query = `SELECT id, booking_date AS date, booking_time AS time, facility_type AS facility, remark
        FROM bookings
        WHERE user_email = ?
        ORDER BY booking_date, booking_time;`;

    db.query(query, [email], (error, results) => {
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        console.log("Returning bookings:", results);
        res.json(results);
    });
});


//Contact
app.post("/contact", (req, res) => {
    const { name, email, phone, message } = req.body;

    const sql = `INSERT INTO contact_messages (name, email, phone, message)
        VALUES (?, ?, ?, ?)`;

    db.query(sql, [name, email, phone, message], (err, result) => {
        if (err) {
            console.error("Error saving contact message:", err);
            return res.status(500).json({ message: "Database error" });
        }

        res.status(200).json({ message: "Message received successfully!" });
    });
});

app.listen(5501, () => {
    console.log("Connected to backend");
});
