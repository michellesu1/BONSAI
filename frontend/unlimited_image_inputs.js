// combine logos test images: 
// https://static.independent.co.uk/2025/05/13/8/42/google-logo-update-new.jpeg?width=1200&height=1200&fit=crop
// https://lh7-us.googleusercontent.com/zX5ZJI62MW7QRwamuJN2-SiVZMdCD5gBaDLTqaynKTcX_Ejva4wJQ_pYInKZclYQbA_15yaUYdOapwVwYaT1PC1xsy3J5__6POIsXqIeEiTqnefktOPwAi5L3Fk_kxr14R56VLcgN63I

import fs from "fs";
import OpenAI from "openai";
import dotenv from "dotenv";
import readline from "readline";
dotenv.config();

import { KEY } from "./API_KEYS.js";
const openai = new OpenAI({ apiKey: KEY });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function getUserInput(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (input) => resolve(input));
  });
}

async function main() {
  try {
    const userPrompt = await getUserInput("Enter your prompt for the images: ");


    const imageUrls = [];
    while (true) {
      const url = await getUserInput("Enter an image URL (or just press Enter to finish): ");
      if (!url) break;
      imageUrls.push(url);
    }
    let outputFile = await getUserInput("Enter a name for the output image file (e.g., result.png): ");
    if (!outputFile) outputFile = "output.png"; // default if blank

    const content = [
      { type: "input_text", text: userPrompt },
      ...imageUrls.map(url => ({ type: "input_image", image_url: url })),
    ];

    const response = await openai.responses.create({
      model: "gpt-4o",
      input: [
        {
          role: "user",
          content,
        },
      ],
      tools: [{ type: "image_generation", input_fidelity: "low" }],
    });

    const imageBase64 = response.output.find(o => o.type === "image_generation_call")?.result;

    if (imageBase64) {
      const imageBuffer = Buffer.from(imageBase64, "base64");
      fs.writeFileSync(outputFile, imageBuffer);
      console.log(`Image saved as ${outputFile}`);
    } else {
      console.log("No image returned");
      console.dir(response, { depth: null });
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    rl.close();
  }
}

main();




// old
// input: [
//         {
//           role: "user",
//           content: [
//             { type: "input_text", text: "add the two people to one picture" },
//             //MODIFIY WITH USERPROMPT

//             { type: "input_image", image_url: "https://plus.unsplash.com/premium_photo-1689530775582-83b8abdb5020?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmFuZG9tJTIwcGVyc29ufGVufDB8fDB8fHww"},
//             { type: "input_image", image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRN6NnehmgDZgf8LuQrGs8J0eodVV69FFk3v78CTgIyNf0DkfYp_5bv-vtLpAx1LIn3ZhM&usqp=CAU"},
//           ],
//         },
//       ],