export function errorMiddleware(err,req,res,next){
  const causeMessage = err.cause?.message ? ` Cause: ${err.cause.message}` : '';
  console.error(`[${req.method} ${req.originalUrl}] ${err.name || 'Error'}: ${err.message || 'Unknown error'}${causeMessage}`);
  if(err.message==='CORS origin not allowed')return res.status(403).json({success:false,message:'Origin not allowed'});
  if(err.name === 'MulterError' || err.message === 'Multipart: Boundary not found') {
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'Uploaded file is too large.' : 'The upload form could not be parsed. Please choose the image again.';
    return res.status(err.code === 'LIMIT_FILE_SIZE' ? 413 : 400).json({success:false,message});
  }
  if(err.code === 'LIMIT_FILE_SIZE')return res.status(413).json({success:false,message:'Uploaded file is too large.'});
  if(err.statusCode)return res.status(err.statusCode).json({success:false,message:err.message});
  if(err.name==='ValidationError'||err.name==='CastError')return res.status(400).json({success:false,message:'Invalid input',errors:[err.message]});
  res.status(500).json({success:false,message:'Internal server error'});
}