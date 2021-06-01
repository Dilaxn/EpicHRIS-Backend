


const checkSupervisor = async (req, res) => {
    try {
        res.send(true)
    } catch (e) {
        res.status(500).send(e);
    }
}
module.exports = {
  checkSupervisor
}