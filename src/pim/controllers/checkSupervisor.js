


const checkSupervisor = async (req, res) => {
    try {
        if(req.user.role ==="admin"){
            res.send(false)
        }
        else{
            res.send(true)
        }

    } catch (e) {
        res.status(500).send(e);
    }
}
module.exports = {
  checkSupervisor
}