// First impl is just going to pull the current NYT cover scan
// In the future, could probably set an array or use some web service to randomly set the wallpaper.
import {default as pdfConverter} from 'pdf-poppler'
import { setWallpaper } from 'wallpaper';
import * as fs from 'fs';
import * as https from 'https';


const appdataPath = process.env.APPDATA;
const nytScanURL = 'https://cdn.freedomforum.org/dfp/pdf9/NY_NYT.pdf';
const pdfPath = `${appdataPath}\\NY_NYT.pdf`;
const imagePath = `${appdataPath}/NYT-1.jpg`;
const file = fs.createWriteStream(pdfPath);

// cleanup pdf and old image
try { await fs.rmSync(pdfPath); } catch {}
try { await fs.rmSync(imagePath); } catch {}

// Grab new PDF
await https.get(nytScanURL, (response) => {
   response.pipe(file);

   file.on("finish", () => {
       file.close();
       // Convert to image
        let option = {
            format: 'jpeg',
            out_dir: `${appdataPath}`,
            out_prefix: `NYT`,
            page: 1,
            scale: 4096
        }

        pdfConverter.convert(pdfPath, option)
        .then(() => {
            // set wallpaper
            setWallpaper(imagePath, {
                scale: 'fit'
            });
            // cleanup pdf
            try { fs.rmSync(pdfPath); } catch {}
        })
        .catch(err => {
            console.log('an error has occurred in the pdf converter ' + err)
        });
   });
});
