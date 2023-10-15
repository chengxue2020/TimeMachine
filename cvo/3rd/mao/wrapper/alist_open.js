import{_}from"assets://js/lib/cat.js";import{findBestLCS}from"./lib/similarity.js";const http=async function(url,options={}){"POST"==options.method&&options.data&&(options.body=JSON.stringify(options.data),options.headers=Object.assign({"content-type":"application/json"},options.headers));const res=await req(url,options);return res.json=()=>res.content?JSON.parse(res.content):null,res.text=()=>res.content,res},__drives=(["get","post"].forEach(method=>{http[method]=function(url,options={}){return http(url,Object.assign(options,{method:method.toUpperCase()}))}}),{}),__subtitle_cache={};async function get_drives_path(tid){var index=tid.indexOf("/",1),name=tid.substring(1,index),tid=tid.substring(index);return{drives:await get_drives(name),path:tid}}async function get_drives(name){var{settings,api,server}=__drives[name];return null==settings.v3&&(settings.v3=!1,server=(await http.get(server+"/api/public/settings")).json().data,_.isArray(server)?(settings.title=server.find(x=>"title"==x.key)?.value,settings.v3=!1,settings.version=server.find(x=>"version"==x.key)?.value,settings.enableSearch="true"==server.find(x=>"enable search"==x.key)?.value):(settings.title=server.title,settings.v3=!0,settings.version=server.version,settings.enableSearch=!1),api.path=settings.v3?"/api/fs/list":"/api/public/path",api.file=settings.v3?"/api/fs/get":"/api/public/path",api.search=(settings.v3,"/api/public/search"),api.other=settings.v3?"/api/fs/other":null),__drives[name]}let siteKey="",siteType=0;function init(cfg){siteKey=cfg.skey,siteType=cfg.stype,cfg.ext.forEach(item=>__drives[item.name]={name:item.name,server:item.server.endsWith("/")?item.server.substring(0,item.server.length-1):item.server,startPage:item.startPage||"/",showAll:!0===item.showAll,params:item.params||{},_path_param:item.params?_.sortBy(Object.keys(item.params),function(x){return-x.length}):[],settings:{},api:{},getParams(path){var key=this._path_param.find(x=>path.startsWith(x));return Object.assign({},this.params[key],{path:path})},async getPath(path){path=(await http.post(this.server+this.api.path,{data:this.getParams(path)})).json();return this.settings.v3?path.data.content:path.data.files},async getFile(path){path=(await http.post(this.server+this.api.file,{data:this.getParams(path)})).json(),path=this.settings.v3?path.data:path.data.files[0];return this.settings.v3||(path.raw_url=path.url),path},async getOther(method,path){path=this.getParams(path),path.method=method,method=(await http.post(this.server+this.api.other,{data:path})).json();return method},isFolder(data){return 1==data.type},isVideo(data){return this.settings.v3?2==data.type:3==data.type},isSubtitle(data){return 1!=data.type&&[".srt",".ass",".scc",".stl",".ttml"].some(x=>data.name.endsWith(x))},getType(data){var isVideo=this.isVideo(data);return this.isFolder(data)?0:isVideo?10:1},getPic(data){return(this.settings.v3?data.thumb:data.thumbnail)||(this.isFolder(data)?"http://img1.3png.com/281e284a670865a71d91515866552b5f172b.png":"")},getSize(data){let sz=data.size||0;if(sz<=0)return"";let filesize="";return filesize=1099511627776<sz?(sz/=1099511627776,"TB"):1073741824<sz?(sz/=1073741824,"GB"):1048576<sz?(sz/=1048576,"MB"):(sz/=1024,"KB"),sz.toFixed(2)+filesize},getRemark(data){return""}})}async function dir(dir,pg){for(const k in __subtitle_cache)delete __subtitle_cache[k];if(pg=pg||1,"/"===dir||""===dir)return result=_.map(__drives,function(d){return{name:d.name,path:"/"+d.name+d.startPage,type:0,thumb:""}}),JSON.stringify({parent:"",page:pg,pagecount:pg,list:result});let{drives,path}=await get_drives_path(dir);const id=dir.endsWith("/")?dir:dir+"/";var result=await drives.getPath(path);let subtList=[],videos=[],allList=[];return result.forEach(item=>{drives.isSubtitle(item)&&subtList.push(item.name);var isVideo=drives.isVideo(item);(drives.showAll||drives.isFolder(item)||isVideo)&&(isVideo={name:item.name.replaceAll("$","_").replaceAll("#","_"),path:id+item.name+(drives.isFolder(item)?"/":""),thumb:drives.getPic(item),type:drives.getType(item),size:drives.getSize(item),remark:drives.getRemark(item)},drives.isVideo(item)&&videos.push(isVideo),allList.push(isVideo))}),0<subtList.length&&videos.forEach(item=>{var sbust=findBestLCS(item.name,subtList);sbust.bestMatch&&(__subtitle_cache[item.path]=[id+sbust.bestMatch.target])}),JSON.stringify({parent:id,page:pg,pagecount:pg,list:allList})}async function file(file){var{drives,path}=await get_drives_path(file),item=await drives.getFile(path),subs=[];if(__subtitle_cache[file])for(const sub of __subtitle_cache[file])try{var subP=await get_drives_path(sub),subItem=await drives.getFile(subP.path);subs.push(subItem.raw_url)}catch(error){}if("AliyundriveShare2Open"===item.provider&&drives.api.other){var urls=["原画",item.raw_url];try{for(const live of(await drives.getOther("video_preview",path)).data.video_preview_play_info.live_transcoding_task_list)"finished"===live.status&&(urls.push(live.template_id),urls.push(live.url))}catch(error){}file={name:item.name,url:urls,size:drives.getSize(item),remark:drives.getRemark(item),header:{},extra:{subt:subs}};return JSON.stringify(file)}if("123Pan"===item.provider){let url=item.raw_url;try{url=(await http.get(url)).json().data.redirect_url}catch(error){}const result={name:item.name,url:url,size:drives.getSize(item),remark:drives.getRemark(item),header:{},extra:{subt:subs}};return JSON.stringify(result)}{const result={name:item.name,url:item.raw_url,size:drives.getSize(item),remark:drives.getRemark(item),header:{},extra:{subt:subs}};return JSON.stringify(result)}}function search(wd){return JSON.stringify({list:[]})}function __jsEvalReturn(){return{init:init,dir:dir,file:file,search:search}}export{__jsEvalReturn};