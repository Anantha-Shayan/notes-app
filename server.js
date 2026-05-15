const express = require("express")

const app = express()

app.use(express.json())

const notes = [
    {
        id: 1,
        text: "first note",
        checkboxes: [
            {
                "id": 1,
                "task": "clean house",
                "status": "pending"

            }
        ]
    }
]
app.get('/notes', (req, res) => {
    res.status(200).json({
        success: true,
        data: notes,
        error: null
    })
})

app.post("/notes", (req, res) => {
	const body = req.body
	const { id, text, checkboxes } = body

	notes.push({
		id,
		text,
		checkboxes
	})

	res.status(200).json({
		success: true
	})
})

app.listen(5000, () => {
    console.log("server running on http://localhost:5000")
})

