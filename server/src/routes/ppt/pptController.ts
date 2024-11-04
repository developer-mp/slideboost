// import pptService from "../../services/ppt/pptService";
// import { Request, Response } from "express";
// import fs from "fs";

// const PPTController = {
//   createPPT: async (req: Request, res: Response): Promise<void> => {
//     const { templateId, transcript } = req.body;
//     try {
//       const filePath = await pptService.createPPT(templateId, transcript);
//       if (filePath) {
//         res.download(
//           filePath,
//           `Presentation_template_${templateId}.pptx`,
//           (err: any) => {
//             if (err) {
//               console.error("Error sending PowerPoint file:", err);
//               res.status(500).send("Error sending PowerPoint file");
//             } else {
//               fs.unlinkSync(filePath);
//             }
//           }
//         );
//       } else {
//         throw new Error("PowerPoint file path is undefined");
//       }
//     } catch (error) {
//       console.error("Error creating PowerPoint file:", error);
//       res
//         .status(500)
//         .json({ message: "Error creating PowerPoint file", error });
//     }
//   },
// };

// export default PPTController;
