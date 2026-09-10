export function errorMiddleware(err,req,res,next){
  console.error(err);
  if(err.name==='ValidationError'||err.name==='CastError')return res.status(400).json({success:false,message:'Invalid input',errors:[err.message]});
  res.status(500).json({success:false,message:'Internal server error'});
}