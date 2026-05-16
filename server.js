const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const app = express()

app.use(express.json())

const notes = [
    {
        id: 1,
        text: "first node",
        checkboxes: [
            {
                "id": 1,
                "task": "clean house",
                "status": "pending"
            }
        ]

    }
]

const users=[]

app.post('/user/register',(req,res)=>{
  try{
    const{username,password}=req.body;

    if(!username || !password){
        res.status(400).json({
            success:false,
            error:"username and password are required"
        }
    )  }

    const existingUser=users.find((user)=>user.username===username)
    if(existingUser){
        res.status(400).json({
            success:false,
            error:"username already exists"
        })
    }

	const hashedPwd = bcrypt.hashSync(password, 10);
	const newUser = {
		id: users.length+1,
		username,
		password: hashedPwd
	}

	users.push(newUser)
	res.status(200).json({
		success: true,
		message: "User registered"
	})

    } catch(error){
	res.status(500).json({
		success: false,
		error: "caught error"
	})
    }
})



app.post('/user/login', (req,res)=>{
	try{
		const{username,password} = req.body;
		const user = users.find((user)=>user.username===username)
		if(!user){
			return res.status(400).json({
				success:false,
				error: "User not found. Please register"
			})
		}

		const isPasswordMatching = bcrypt.compareSync(password, user.password);
		 if(!isPasswordMatching){
                        return res.status(400).json({
                                success:false,
                                error: "Incorrect password"
                        })
                }

		const token = jwt.sign({id: user.id, username: user.username}, "secretkey", {expiresIn: "1h"})

		res.status(200).json({
			success:true,
			message: "Login successful",
			data: {
				user,
				token
			      }
		})

	} catch(error){
		res.status(500).json({
			success:false,
			error: error.message || "Something went wrong"
		})
		}
})

app.get('/notes', (req, res) => {
    res.status(200).json({
        success: true,
        data: notes,
        error: null
    })
})

app.post("/notes", (req, res) => {
    const body = req.body;
    const { id, text, checkboxes } = body;

    //body.id
    //body.text
    //body.checkboxes

    notes.push({
        id, text, checkboxes
    })
    res.status(200).json({
        success: true
    })
})

// http://localhost:8000/notes/1
// path param

app.get('/notes/:id', (req, res) => {
    const id = parseInt(req.params.id);

    function filterCondition(note) {
        const noteId = note.id;

        if (noteId === id) {
            console.log("returning id", noteId);
            return true;
        }

        console.log("removing id", noteId);
        return false;
    }

    const filteredNotes = notes.filter(filterCondition);

    res.status(200).json({
        success: true,
        data: filteredNotes
    });
});
// Query parameter example
app.get('/notes/query', (req, res) => {

    const hasText = req.query.hasText === "true";
    console.log(hasText);

    const filtered = notes.filter((note) => {
        return hasText ? note.text !== "" : note.text === "";
    });

    res.status(200).json({
        success: true,
        data: filtered
    });
});






app.listen(4000, () => {
    console.log("server running on http://localhost:4000")
})
