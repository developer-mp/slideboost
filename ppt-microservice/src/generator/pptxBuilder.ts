import JSZip from "jszip";
import { BuildPptxInput, BuildPptxResult } from "../types";
import { textToPresentationModel } from "./textToSlides";
import {
  buildAppXml,
  buildContentTypesXml,
  buildCoreXml,
  buildPresPropsXml,
  buildPresentationRelsXml,
  buildPresentationXml,
  buildRootRelsXml,
  buildSlideLayoutRelsXml,
  buildSlideLayoutXml,
  buildSlideMasterRelsXml,
  buildSlideMasterXml,
  buildSlideRelsXml,
  buildSlideXml,
  buildTableStylesXml,
  buildThemeXml,
  buildViewPropsXml,
} from "./xml";

export async function buildCustomPptx(
  input: BuildPptxInput,
): Promise<BuildPptxResult> {
  const model = textToPresentationModel(input);
  const zip = new JSZip();
  const slideCount = model.slides.length;

  zip.file("[Content_Types].xml", buildContentTypesXml(slideCount));
  zip.file("_rels/.rels", buildRootRelsXml());

  zip.file("docProps/app.xml", buildAppXml(slideCount));
  zip.file("docProps/core.xml", buildCoreXml());

  zip.file("ppt/presentation.xml", buildPresentationXml(slideCount));
  zip.file(
    "ppt/_rels/presentation.xml.rels",
    buildPresentationRelsXml(slideCount),
  );

  zip.file("ppt/slideLayouts/slideLayout1.xml", buildSlideLayoutXml());
  zip.file(
    "ppt/slideLayouts/_rels/slideLayout1.xml.rels",
    buildSlideLayoutRelsXml(),
  );

  zip.file("ppt/slideMasters/slideMaster1.xml", buildSlideMasterXml());
  zip.file(
    "ppt/slideMasters/_rels/slideMaster1.xml.rels",
    buildSlideMasterRelsXml(),
  );

  zip.file("ppt/theme/theme1.xml", buildThemeXml());
  zip.file("ppt/presProps.xml", buildPresPropsXml());
  zip.file("ppt/viewProps.xml", buildViewPropsXml());
  zip.file("ppt/tableStyles.xml", buildTableStylesXml());

  model.slides.forEach((slide, index) => {
    const slideNumber = index + 1;
    zip.file(
      `ppt/slides/slide${slideNumber}.xml`,
      buildSlideXml(slide, model.title),
    );
    zip.file(
      `ppt/slides/_rels/slide${slideNumber}.xml.rels`,
      buildSlideRelsXml(),
    );
  });

  const fileBuffer = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 9 },
  });

  return {
    fileBuffer,
    slideCount,
  };
}
