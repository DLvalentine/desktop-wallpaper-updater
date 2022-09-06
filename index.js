// First impl is just going to pull the current front-page cover scan of a newspaper I choose
// In the future, could probably set an array or use some web service to randomly set the wallpaper.
import {default as pdfConverter} from 'pdf-poppler'
import { setWallpaper } from 'wallpaper';
import moment from 'moment';
import * as fs from 'fs';
import * as https from 'https';

const today = moment().format('D');
const appdataPath = process.env.APPDATA;
const nytScanURL = `https://cdn.freedomforum.org/dfp/pdf${today}/CA_LAT.pdf`;
const pdfPath = `${appdataPath}\\CA_LAT.pdf`;
const imagePath = `${appdataPath}/LAT-1.jpg`;
const file = fs.createWriteStream(pdfPath);

// cleanup pdf and old image
try { await fs.rmSync(pdfPath); } catch {}
try { await fs.rmSync(imagePath); } catch {}

// Grab new PDF
await https.get(nytScanURL, (response) => {
   response.pipe(file);

   file.on('finish', () => {
       file.close();
       // Convert to image
        let option = {
            format: 'jpeg',
            out_dir: `${appdataPath}`,
            out_prefix: `LAT`,
            page: 1,
            scale: 4096
        };

        pdfConverter.convert(pdfPath, option)
        .then(() => {
            // set wallpaper
            setWallpaper(imagePath, {
                scale: 'fit'
            });
            // cleanup pdf
            try { fs.rmSync(pdfPath); } catch {}
        })
        .catch((err) => {
            console.log(`PDF Conversion Error: ${err}`)
        });
   });
});
