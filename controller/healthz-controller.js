import { connectingDB } from '../config/database.js';
import logger from '../services/logger.js';
import { statsdClient } from '../services/statD.js'

const checkServerHealth = async (req, res) => {
    statsdClient.increment('api.check_server_health.count');
    const start = Date.now();
    try{
        res.header('cache-control', 'no-cache, no-store, must-revalidate');
        res.set('Pragma', 'no-cache');
        if (req.method !== 'GET') {
            logger.error({
                message: "Request method not allowed", 
                httpRequest: {
                  requestMethod: req.method,
                  requestUrl: req.originalUrl,
                  status: 405, 
                }
            })
            return res.status(405).end();//.end() method makes sure, response does not have payload.
        }
        else if(req.headers['content-type'] || Object.keys(req.query).length > 0){
            logger.error({
                message: "Payload not allowed", 
                httpRequest: {
                  requestMethod: req.method,
                  requestUrl: req.originalUrl,
                  status: 400, 
                }
            })
            return res.status(400).send();
        }
        else{
            try {
                await connectingDB();
                logger.info({
                    message: "Connected to database successfully", 
                    httpRequest: {
                      requestMethod: req.method,
                      requestUrl: req.originalUrl,
                      status: 200, 
                    }
                })
                return res.status(200).end();
            } catch (error) {
                console.error(error);
                logger.error({
                    message: "Error while connecting to database", 
                    httpRequest: {
                      requestMethod: req.method,
                      requestUrl: req.originalUrl,
                      status: 503, 
                    }
                })

                return res.status(503).end();
            }
        }
        
    }catch(error){
        logger.error({
            message: "Technical error in database connectivity", 
            httpRequest: {
              requestMethod: req.method,
              requestUrl: req.originalUrl,
              status: 500, 
            }
        })
        return res.status(500).send();
    }finally {
        // Calculate duration and send to StatsD
        const duration = Date.now() - start;
        statsdClient.timing('api.check_server_health.duration', duration);
    }
};

const checkServerCICD = async (req, res) => {
    statsdClient.increment('api.check_server_health.count');
    const start = Date.now();
    try{
        res.header('cache-control', 'no-cache, no-store, must-revalidate');
        res.set('Pragma', 'no-cache');
        if (req.method !== 'GET') {
            logger.error({
                message: "Request method not allowed", 
                httpRequest: {
                  requestMethod: req.method,
                  requestUrl: req.originalUrl,
                  status: 405, 
                }
            })
            return res.status(405).end();//.end() method makes sure, response does not have payload.
        }
        else if(req.headers['content-type'] || Object.keys(req.query).length > 0){
            logger.error({
                message: "Payload not allowed", 
                httpRequest: {
                  requestMethod: req.method,
                  requestUrl: req.originalUrl,
                  status: 400, 
                }
            })
            return res.status(400).send();
        }
        else{
            try {
                await connectingDB();
                logger.info({
                    message: "Connected to database successfully", 
                    httpRequest: {
                      requestMethod: req.method,
                      requestUrl: req.originalUrl,
                      status: 200, 
                    }
                })
                return res.status(200).end();
            } catch (error) {
                console.error(error);
                logger.error({
                    message: "Error while connecting to database", 
                    httpRequest: {
                      requestMethod: req.method,
                      requestUrl: req.originalUrl,
                      status: 503, 
                    }
                })

                return res.status(503).end();
            }
        }
        
    }catch(error){
        logger.error({
            message: "Technical error in database connectivity", 
            httpRequest: {
              requestMethod: req.method,
              requestUrl: req.originalUrl,
              status: 500, 
            }
        })
        return res.status(500).send();
    }finally {
        // Calculate duration and send to StatsD
        const duration = Date.now() - start;
        statsdClient.timing('api.check_server_health.duration', duration);
    }
};

export {checkServerHealth, checkServerCICD};
