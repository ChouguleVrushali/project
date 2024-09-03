export function checkUserAuthentication(req,res){
    const header=req.headers['authorization'];
    const token=header && header.split(' ')[1];
    if(!token){
        res.writeHead(401, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: 'Unauthorized' }));
    }
    return token;
}
export function response(...resp){
    if(resp.length===4){
        resp[3].writeHead(resp[2],{'Content-Type':'application/json'});
        resp[3].end(JSON.stringify({message:resp[1],data:resp[0]}));
    }
    else{
        resp[2].writeHead(resp[1],{'Content-Type':'application/json'});
        resp[2].end(JSON.stringify({message:resp[0]}));
    }
}

export function checkNotFound(k,res){
    if(k===0){
        response("Task not found",404,res)
    } 
}