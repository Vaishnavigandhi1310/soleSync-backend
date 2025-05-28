const styleModel = require('../Model/StyleModel');



const addStyle = async (req, res) => {
  try {
    const name = req.body.name;
    const date = req.body.date;
    const img = req.file?.filename;

    if (!name || !date || !img) {
      return res.status(400).send({ msg: "Name, date, and image are required" });
    }

    const data = new styleModel({ name, date, img });
    const saved = await data.save();

    res.status(201).send({ msg: "Style added successfully", data: saved });
  } catch (error) {
    console.error("Error in addNewStyle:", error);
    res.status(500).send({ msg: "Failed to add style", error: error.message });
  }
};


const getStyle = async (req, res) => {
  try {
    const existingStyle = await styleModel.find({});
    return res.status(200).send({ message: "Successful", data: existingStyle });
  } catch (error) {
    console.error("Error in existingStyle:", error);
    return res
      .status(500)
      .send({ message: "Failed", data: "", error: error.message || error });
  }
};
const uploadFile = async (req,res) => {
    if (req.file.size<(1024*50)) {
      console.log(req.file);
      
     res.status(200).send({message:"success",data:"http://localhost:8080/upload/"+req.file.originalname})
    } else {
       fs.unlinkSync("./uploads"+req.file.filename);
     res.status(400).send({message:"success",data:"",error:"img size is larger "})
    }
   }

module.exports = { addStyle,getStyle ,uploadFile};
