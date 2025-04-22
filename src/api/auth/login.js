export async function login(req, res) {
    try {
        console.log(req.body);
        res.send(JSON.stringify({ success: "Logged In!" }));
    } catch (error) {
        console.log(`ERROR (/api/auth/login): ${error}`);
        return res.status(500).json({ error: `${error}` });
    }
}