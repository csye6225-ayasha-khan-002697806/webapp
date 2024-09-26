import { connectingDB } from '../config/database.js';

const checkServerHealth = async (req, res) => {
    try{
        res.header('cache-control', 'no-cache, no-store, must-revalidate');
        res.set('Pragma', 'no-cache');
        if (req.method !== 'GET') {
            return res.status(405).end();//.end() method makes sure, response does not have payload.
        }
        else if(req.headers['content-type'] || Object.keys(req.query).length > 0){
            return res.status(400).send();
        }
        else{
            try {
                await connectingDB();
                return res.status(200).end();
            } catch (error) {
                console.error(error);
                return res.status(503).end();
            }
        }
        
    }catch(error){
        return res.status(500).send();
    }
};

export {checkServerHealth};
