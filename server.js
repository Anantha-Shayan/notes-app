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

//path params
app.get('/notes/:id', (req,res)=>{
	const id = parseInt(req.params.id)
//`	function filterCondition(note){
//		const noteId = note.id;
//		if(noteId===id){
//		console.log("Returning id ",noteId )
//		return true
//		}

//		console.log("removing id", noteId)
//		return false
//	}
	const filteredNotes = notes.filter((item)=>item.id===id)
	res.status(200).json({"success":true, data:filteredNotes})
})

app.get('/notes/query', (req,res)=>{
	const hasText = req.query.hasText == "true";
	const filtered = notes.filter((note)=>{
		if(hasText){
		 return note.text!=="";
		}

		return note.text==="";
	})
	res.status(200).json({"success":true, data:filtered})
})

app.listen(5000, () => {
    console.log("server running on http://localhost:5000")
})

