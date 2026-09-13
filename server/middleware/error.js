export function errorMiddleware(err,req,res,next){
  console.error(err);
  if(err.message==='CORS origin not allowed')return res.status(403).json({success:false,message:'Origin not allowed'});
  if(err.code === 'LIMIT_FILE_SIZE')return res.status(413).json({success:false,message:'Uploaded file is too large.'});
  if(err.statusCode)return res.status(err.statusCode).json({success:false,message:err.message});
  if(err.name==='ValidationError'||err.name==='CastError')return res.status(400).json({success:false,message:'Invalid input',errors:[err.message]});
  res.status(500).json({success:false,message:'Internal server error'});
}