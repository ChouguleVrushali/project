import url from "url";
export function decodeURL(reqUrl){
    const path=url.parse(reqUrl,true);
    let queryPara=path.query||{};
    let pathname=path.pathname.split("/");
     return {
        queryPara:queryPara,
        pathSegments:pathname,
        pathLength:pathname.length
    }
}
