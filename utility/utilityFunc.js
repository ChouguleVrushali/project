import url from "url";
export function decodeURL(url){
    const path=url.parse(req.url,true);
    let queryPara=path.query||{};
    let pathname=path.pathname.split("/");
     return {
        ...queryPara,
        pathSegments:pathname,
        pathLength:pathname.length
    }
}
