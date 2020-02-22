import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get( "/filteredimage", async ( req, res ) => {
    let files: string[] = [];
    const image_url = req.query.image_url;

    // check if url is valid
    if(!image_url){
      return res.status(400).send({ message: 'Image url is required' });
    }

    // filter the image
    const filtered_path = await filterImageFromURL(image_url);

    // send file in the response
    res.status(200).sendFile(filtered_path);

    // delete files after response finish
    res.on('finish', function() {
      files.push(filtered_path);
      deleteLocalFiles(files);
    }) ;
  } );

  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();